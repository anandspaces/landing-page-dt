import { profiler } from '../utils/LatencyProfiler';

const LLM_API_URL = "http://localhost:8000/chat";

export const generateResponse = async (userText) => {
    let fullText = "";
    await generateResponseStream(userText, () => { }, () => { }, (text) => fullText = text);
    return fullText;
}

/**
 * Streams the response from the Local LLM.
 */
export const generateResponseStream = async (userText, onSentence, onComplete, onFullTextUpdate) => {
    try {
        const response = await fetch(LLM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let sentenceBuffer = "";
        let accumulatedSentence = "";
        let fullFinalText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // Local backend sends raw text chunks
            fullFinalText += chunk;
            sentenceBuffer += chunk;
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

                    // Speak if enough text
                    if (accumulatedSentence.length > 10) {
                        onSentence(accumulatedSentence.trim());
                        accumulatedSentence = "";
                    }

                    sentenceBuffer = remainder;
                    splitRegex.lastIndex = 0;
                }
            }
        }

        // Flush remainder
        if (sentenceBuffer.trim().length > 0) {
            accumulatedSentence += sentenceBuffer.trim();
        }
        if (accumulatedSentence.trim().length > 0) {
            onSentence(accumulatedSentence.trim());
        }

        if (onComplete) onComplete();
        return fullFinalText;

    } catch (e) {
        console.error("LLM Service Error:", e);
        return "Error connecting to Local AI.";
    }
};
