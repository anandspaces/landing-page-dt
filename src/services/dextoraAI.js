/**
 * Dextora AI Service
 * Handles interactions with the LLM API (Gemini/OpenAI) with a specific system prompt.
 */

const SYSTEM_PROMPT = `
You are Dextora AI, an advanced AI mentorship platform designed for students from Class 1 to 12, as well as those preparing for competitive exams like IIT-JEE and NEET.
Your goal is to provide personalized guidance, research-backed study methods, and 24/7 adaptive support.
You are helpful, encouraging, and knowledgeable.
Keep your responses concise and spoken-friendly, as they may be read out loud.
`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
import { profiler } from '../utils/LatencyProfiler';

export const generateResponse = async (userText) => {
  let fullText = "";
  profiler.start('LLM_Response_Total');
  await generateResponseStream(userText, () => { }, () => { profiler.end('LLM_Response_Total'); }, (text) => fullText = text);
  return fullText;
}

/**
 * Streams the response from the LLM, parsing it into complete sentences for TTS.
 * @param {string} userText - User input.
 * @param {function} onSentence - Callback triggered when a complete sentence is ready.
 * @param {function} onComplete - Callback triggered when the entire stream is finished.
 * @param {function} onFullTextUpdate - Callback triggered with the current full aggregated text.
 * @returns {Promise<string>} - Returns the full aggregated text at the end (for chat history).
 */
export const generateResponseStream = async (userText, onSentence, onComplete, onFullTextUpdate) => {
  if (!API_KEY) {
    console.warn("Dextora AI: No API Key found. Streaming mock response.");
    console.warn("Dextora AI: No API Key found. Streaming mock response.");

    // Split into chunks:
    // 1. Functional confirmation -> Native Voice (Instant, Reliable, No Audio Loss)
    // 2. Persona Intro & Question -> HQ Voice (Merged for continuous flow)
    const mockSentences = [
      `[NATIVE] I heard you say: "${userText}".`,
      "I am Dextora AI, here to help you excel in your studies! How can I guide you today?"
    ];

    let fullText = "";
    for (const sent of mockSentences) {
      // Very fast dispatch (Native handles itself, HQ queues up)
      await new Promise(r => setTimeout(r, 50));
      onSentence(sent);
      fullText += sent.replace("[NATIVE] ", "") + " ";
      if (onFullTextUpdate) onFullTextUpdate(fullText.trim());
    }
    if (onComplete) onComplete();
    return fullText.trim();
  }

  try {
    // Local LLM Service Endpoint
    const LOCAL_API_URL = 'http://localhost:8000/chat';

    const response = await fetch(LOCAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let sentenceBuffer = "";
    let accumulatedSentence = "";
    let fullFinalText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (!profiler.hasFirstByte) {
        profiler.end('LLM_Request_Start');
        profiler.log('LLM_First_Byte');
        profiler.hasFirstByte = true;
      }
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      let cleanChunk = chunk;

      if (cleanChunk) {
        fullFinalText += cleanChunk;
        sentenceBuffer += cleanChunk;
        if (onFullTextUpdate) onFullTextUpdate(fullFinalText);

        // Sentence Splitting Logic
        let splitRegex = /([.?!]+)(\s+|"|$)/g;
        let splitMatch;

        while ((splitMatch = splitRegex.exec(sentenceBuffer)) !== null) {
          const index = splitMatch.index + splitMatch[1].length;
          const sentence = sentenceBuffer.substring(0, index).trim();
          const remainder = sentenceBuffer.substring(index);

          if (sentence.length > 0) {
            accumulatedSentence += sentence + " ";
            if (accumulatedSentence.length > 50) {
              onSentence(accumulatedSentence.trim());
              accumulatedSentence = "";
            }
            sentenceBuffer = remainder;
            splitRegex.lastIndex = 0;
          }
        }
      }
    }

    // Flush remaining
    if (sentenceBuffer.trim().length > 0) {
      accumulatedSentence += sentenceBuffer.trim();
    }
    if (accumulatedSentence.trim().length > 0) {
      onSentence(accumulatedSentence.trim());
    }

    if (onComplete) onComplete();
    return fullFinalText;

  } catch (e) {
    console.error(e);
    return "Error connecting to AI.";
  }
};
