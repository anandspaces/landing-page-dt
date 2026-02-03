/**
 * TTS Service
 * Handles Server-Side Edge-TTS (Realistic Voice) via API.
 * Implements strict queueing to prevent skipping during fallback.
 */
import { profiler } from '../utils/LatencyProfiler';

let audioContext = null;
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tts`;

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
// Queue for sequential playback (Audio OR Text)
const itemQueue = []; // { type: 'audio' | 'text', data: any }
let isPlaying = false;
let isMuted = false;

export const setMuted = (muted) => {
    isMuted = muted;
    // Optional: Cancel current playback if muting? 
    // For now, let's just affect next items or allow logic inside play function to cut short.
    if (isMuted) {
        window.speechSynthesis.cancel();
        if (audioContext && audioContext.state === 'running') {
            audioContext.suspend();
        }
    } else {
        resumeAudio();
    }
};

export const getMuted = () => isMuted;

export const stopAudio = () => {
    // 1. Clear Queue
    itemQueue.length = 0;
    isPlaying = false;

    // 2. Stop Native TTS
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    // 3. Suspend Web Audio Context (Immediate Silence)
    if (audioContext && audioContext.state === 'running') {
        audioContext.suspend();
    }
};

const processQueue = async () => {
    if (isPlaying || itemQueue.length === 0) return;
    isPlaying = true;

    while (itemQueue.length > 0) {
        const item = itemQueue.shift();

        try {
            if (item.type === 'audio') {
                // Pass callback to be triggered AFTER decoding duration
                await playAudioBuffer(item.data, item.onStart);
            } else if (item.type === 'text') {
                // For native, we don't have exact duration easily, trigger immediately
                if (item.onStart) item.onStart(0);
                await speakNativePromised(item.data);
            }
        } catch (e) {
            console.error("Playback error:", e);
        }
    }
    isPlaying = false;
};

const playAudioBuffer = async (arrayBuffer, onStart) => {
    const ctx = getAudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;

    if (onStart) {
        try {
            onStart(duration);
        } catch (e) {
            console.error("Error in TTS onStart callback:", e);
        }
    }

    if (isMuted) {
        // If muted, we simulate the delay or just resolve? 
        // If we resolve immediately, the avatar mouth will stop moving immediately in Chat.jsx?
        // Chat.jsx `isSpeaking` logic was: `setTimeout(() => setIsSpeaking(false), 2000);` or based on stream.
        // Actually, the avatar animation in Chat.jsx is tied to `isSpeaking`. 
        // We probably want the avatar to still move? 
        // The user said "turn it of and on", implying sound. 
        // Usually, if sound is off, avatar might still move. 
        // Let's resolve effectively "playing silence" by just waiting the duration?
        // Or just return.
        // If we return immediately, the `await playAudioBuffer` in processQueue finishes instantly.
        // The next item starts. The text animation in Chat UI is running on `setTimeout` loop based on duration.
        // That animation is independent of this Promise once `onStart` triggers.
        // So resolving immediately is fine for text sync.
        // BUT, if we have multiple sentences in queue:
        // Sentence 1 start -> Text animates 5s.
        // Audio 1 skipped. Sentence 2 starts immediately.
        // Text animation for 2 overlaps with 1?
        // `currentFullText` append would be messy if parallel.
        // So we MUST wait for the duration even if muted to keep pacing.

        return new Promise(resolve => setTimeout(resolve, duration * 1000));
    }

    return new Promise((resolve) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = resolve;
        source.start();
    });
};

// --- Native Fallback (Promisified) ---
// --- Native Fallback (Promisified) ---
const speakNativePromised = (text) => {
    return new Promise((resolve) => {
        if (isMuted) {
            // Estimate duration for native text (e.g. 200ms per character?)
            const durationEst = text.length * 50;
            setTimeout(resolve, durationEst);
            return;
        }

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

export const speakText = async (text, options = {}) => {
    if (!text || !text.trim()) return;

    // Explicit Resume
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const { onStart } = options;

    // Native Override
    if (text.startsWith("[NATIVE]")) {
        const cleanText = text.replace("[NATIVE]", "").trim();
        itemQueue.push({ type: 'text', data: cleanText, onStart });
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
        itemQueue.push({ type: 'audio', data: arrayBuffer, onStart });
        processQueue();

    } catch (e) {
        console.error("TTS Fetch Error (Using Fallback):", e);
        // Fallback: Queue text instead of audio -> Fixes skipping
        itemQueue.push({ type: 'text', data: text, onStart });
        processQueue();
    }
};
