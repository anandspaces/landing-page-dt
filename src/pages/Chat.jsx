import React, { useState, useEffect, useRef } from 'react';
import FullBodyAvatar from '../components/FullBodyAvatar';
import { Mic, Send } from 'lucide-react';
import { generateResponse, generateResponseStream } from '../services/llmService';
import { speakText, resumeAudio } from '../services/ttsService';
import { profiler } from '../utils/LatencyProfiler';

function Chat() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false); // Track user intention

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Pre-load TTS Workers
  useEffect(() => {
    import('../services/ttsService').then(module => {
      if (module.initTTS) module.initTTS();
    });
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    // Add User Message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    // Add Placeholder AI Message
    setMessages(prev => [...prev, { role: 'assistant', text: '...' }]);
    setIsProcessing(true);
    setIsSpeaking(true);

    try {
      // Stream AI Response
      profiler.start('Pipeline_Total');
      await generateResponseStream(
        userText,
        // On Sentence Ready -> Speak it
        (sentence) => {
          console.log("Speaking sentence:", sentence);
          speakText(sentence);
        },
        // On Complete
        () => {
          setIsSpeaking(false); // Only unset when full stream done? 
          // Actually, TTS queue might still be playing.
          // Ideally `isSpeaking` should listen to TTS queue status.
          // But for animation trigger, we can keep it true until stream ends + buffer?
          // Let's just set false here, but the avatar might stop early.
          // A better `isSpeaking` logic would come from `ttsService` callback, 
          // but for now, let's keep it simple: speak while generating.
          setIsProcessing(false);
          profiler.end('Pipeline_Total');
        },
        // On Text Update -> Update Chat Bubble
        (fullText) => {
          setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.text = fullText;
            }
            return newMsgs;
          });
        }
      );
    } catch (error) {
      console.error("Chat Error:", error);
      setIsProcessing(false);
      setIsSpeaking(false);
    }
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    profiler.start('STT_Session'); // Track validation session length? Or just overhead.
    recognition.lang = 'en-US';
    recognition.continuous = false; // We use restart logic for better control
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Recognition started");
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const lastResultIndex = event.results.length - 1;
      const speechToText = event.results[lastResultIndex][0].transcript;
      profiler.log('STT_Result', { text: speechToText, confidence: event.results[lastResultIndex][0].confidence });

      if (event.results[lastResultIndex].isFinal) {
        console.log("Heard:", speechToText);

        // Don't process empty or short noise
        if (speechToText.trim().length > 1) {
          try {
            // 1. Update UI with User Message (Visual Feedback)
            setMessages(prev => [...prev, { role: 'user', text: speechToText }]);

            // 2. Add AI Placeholder
            setMessages(prev => [...prev, { role: 'assistant', text: '...' }]);

            // 3. Start Processing
            setIsProcessing(true);
            setIsSpeaking(true);
            profiler.start('Pipeline_Voice_Total');

            await generateResponseStream(
              speechToText,
              // Callback 1: Speak Sentence
              (sentence) => speakText(sentence),
              // Callback 2: On Complete
              () => {
                setTimeout(() => setIsSpeaking(false), 2000);
                setIsProcessing(false);
                profiler.end('Pipeline_Voice_Total');
              },
              // Callback 3: Update Chat Text (Streaming)
              (fullText) => {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  const lastMsg = newMsgs[newMsgs.length - 1];
                  if (lastMsg && lastMsg.role === 'assistant') {
                    lastMsg.text = fullText;
                  }
                  return newMsgs;
                });
              }
            );
          } catch (error) {
            console.error("Voice Error:", error);
            setIsSpeaking(false);
            setIsProcessing(false);
          }
        }

      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        shouldListenRef.current = false;
        setIsListening(false);
      }
      // 'no-speech' is common, we just ignore and let it restart
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      if (shouldListenRef.current) {
        // Restart if user wants it active
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error("Restart error", e);
            // If specific error, maybe re-create instance?
            // Recursive call to create fresh instance is safer
            startRecognition();
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Start error", e);
      setIsListening(false);
      shouldListenRef.current = false;
    }
  };

  const toggleMic = () => {
    if (shouldListenRef.current) {
      // Turn Off
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // onend will fire, see flag is false, and set isListening false
      }
      setIsListening(false); // Immediate UI update
    } else {
      // Turn On
      resumeAudio(); // Ensure context is unlocked
      shouldListenRef.current = true;
      startRecognition();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Foreground Avatar */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        
        <div className="w-full h-full pointer-events-auto relative z-20">
          <FullBodyAvatar isTalking={isSpeaking} />
        </div>
      </div>

      {/* Chat History (Split View) */}
      <div
        ref={chatContainerRef}
        className="absolute top-24 inset-x-0 z-40 w-full px-4 md:px-10 h-[65vh] overflow-y-auto no-scrollbar mask-gradient"
      >
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`transform transition-all duration-300 max-w-[35%] lg:max-w-[30%] px-6 py-4 rounded-2xl backdrop-blur-xl shadow-2xl text-sm md:text-base leading-relaxed ${msg.role === 'user'
                  ? 'bg-cyan/20 border border-cyan/40 text-white rounded-tr-sm mr-0 hover:bg-cyan/30'
                  : 'bg-black/40 border border-white/15 text-offwhite rounded-tl-sm ml-0 hover:bg-black/50'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start w-full">
              <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-full flex gap-2 items-center ml-0">
                <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface - Input Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6">
        <div className="flex items-center gap-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(79,209,255,0.15)] transition-all hover:shadow-[0_0_40px_rgba(79,209,255,0.25)]">

          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full border transition-all duration-300 group ${isListening
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
              : 'bg-white/5 hover:bg-cyan/20 text-cyan border-white/10'
              }`}
            aria-label="Activate voice input"
          >
            <Mic className={`w-6 h-6 transition-transform ${!isListening && 'group-hover:scale-110'}`} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Let's sort your query..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg px-2 font-light tracking-wide"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isProcessing}
            className="p-4 rounded-full bg-gradient-to-r from-cyan to-violet text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(79,209,255,0.4)]"
            aria-label="Send message"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
