/**
 * TTS Service
 * Handles Server-Side Edge-TTS (Realistic Voice) via API.
 * Implements strict queueing to prevent skipping during fallback.
 */
import { profiler } from '../utils/LatencyProfiler';

let audioContext = null;
const API_URL = "http://localhost:8000/tts";

// Initialize AudioContext
export const initTTS = () => {
    getAudioContext();
};

export const resumeAudio = () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
};

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
};

// Queue for sequential playback (Audio OR Text)
const itemQueue = []; // { type: 'audio' | 'text', data: any }
let isPlaying = false;

const processQueue = async () => {
    if (isPlaying || itemQueue.length === 0) return;
    isPlaying = true;

    while (itemQueue.length > 0) {
        const item = itemQueue.shift();
        try {
            if (item.type === 'audio') {
                await playAudioBuffer(item.data);
            } else if (item.type === 'text') {
                await speakNativePromised(item.data);
            }
        } catch (e) {
            console.error("Playback error:", e);
        }
    }
    isPlaying = false;
};

const playAudioBuffer = async (arrayBuffer) => {
    const ctx = getAudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    return new Promise((resolve) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = resolve;
        source.start();
    });
};

// --- Native Fallback (Promisified) ---
const speakNativePromised = (text) => {
    return new Promise((resolve) => {
        if (!window.speechSynthesis) {
            resolve();
            return;
        }

        // Don't cancel here! We are in a queue.
        window.speechSynthesis.cancel(); // Safety clear only if getting stuck? No, just play.

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const preferred = voices.find(v => v.lang.startsWith('en')) || voices[0];
            utterance.voice = preferred;
        }

        utterance.onend = () => {
            resolve();
        };

        utterance.onerror = (e) => {
            console.error("Native TTS Error:", e);
            resolve(); // Resolve anyway to unblock queue
        };

        window.speechSynthesis.speak(utterance);
    });
};

// --- Public API ---

export const speakText = async (text) => {
    if (!text || !text.trim()) return;

    // Explicit Resume
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // Native Override
    if (text.startsWith("[NATIVE]")) {
        const cleanText = text.replace("[NATIVE]", "").trim();
        itemQueue.push({ type: 'text', data: cleanText });
        processQueue();
        return;
    }

    try {
        console.log("Fetching TTS for:", text);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) throw new Error(`TTS API Error: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        itemQueue.push({ type: 'audio', data: arrayBuffer });
        processQueue();

    } catch (e) {
        console.error("TTS Fetch Error (Using Fallback):", e);
        // Fallback: Queue text instead of audio -> Fixes skipping
        itemQueue.push({ type: 'text', data: text });
        processQueue();
    }
};
