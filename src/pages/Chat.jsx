import React, { useState, useEffect, useRef } from 'react';
import FullBodyAvatar from '../components/FullBodyAvatar';
import { Mic, Send, Volume2, VolumeX, Square } from 'lucide-react';
import { generateResponseStream } from '../services/llmService';
import { speakText, resumeAudio, setMuted, stopAudio } from '../services/ttsService';
import { profiler } from '../utils/LatencyProfiler';

function Chat() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false); // Track user intention
  const abortControllerRef = useRef(null); // Track abort controller

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

  const handleStop = () => {
    // 1. Abort LLM Request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 2. Stop Audio & Clear Queue
    stopAudio();

    // 3. Reset State
    setIsProcessing(false);
    setIsSpeaking(false);

    // Optional: Add a system message or indicator that it was stopped?
    // for now just resetting state is enough visual feedback (button reverts)
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    // Add User Message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    // Add Placeholder AI Message
    setMessages(prev => [...prev, { role: 'assistant', text: '' }]);
    setIsProcessing(true);
    setIsSpeaking(true);

    // Create new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Stream AI Response
      profiler.start('Pipeline_Total');
      const messageIndex = messages.length + 1; // Index of the new assistant message
      let currentFullText = "";

      await generateResponseStream(
        userText,
        // On Sentence Ready -> Speak it
        (sentence) => {
          console.log("Speaking sentence:", sentence);
          speakText(sentence, {
            onStart: (duration) => {
              // duration is in seconds. If 0 or undefined, default to fast type.
              const words = sentence.trim().split(/\s+/);
              const totalTimeMs = (duration || 1.5) * 1000;
              const msPerWord = totalTimeMs / words.length;

              let wordIndex = 0;

              const typeNextWord = () => {
                if (wordIndex < words.length) {
                  currentFullText += (words[wordIndex] + " ");

                  setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastMsg = newMsgs[newMsgs.length - 1];
                    if (lastMsg.role === 'assistant') {
                      lastMsg.text = currentFullText.trim();
                    }
                    return newMsgs;
                  });

                  wordIndex++;
                  // Recursive delay for next word
                  setTimeout(typeNextWord, msPerWord);
                }
              };

              // Start typing immediately when audio starts
              typeNextWord();
            }
          });
        },
        // On Complete
        () => {
          setIsSpeaking(false);
          setIsProcessing(false);
          profiler.end('Pipeline_Total');
          abortControllerRef.current = null;
        },
        // On Text Update -> IGNORE (Don't spoil text before audio)
        (fullText) => {
          // Do nothing
        },
        controller.signal // Pass signal
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log("Generation stopped by user");
      } else {
        console.error("Chat Error:", error);
      }
      setIsProcessing(false);
      setIsSpeaking(false);
      abortControllerRef.current = null;
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
            setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

            // 3. Start Processing
            setIsProcessing(true);
            setIsSpeaking(true);
            profiler.start('Pipeline_Voice_Total');

            const controller = new AbortController();
            abortControllerRef.current = controller;

            let voiceFullText = "";

            await generateResponseStream(
              speechToText,
              // Callback 1: Speak Sentence
              (sentence) => {
                speakText(sentence, {
                  onStart: (duration) => {
                    const words = sentence.trim().split(/\s+/);
                    const totalTimeMs = (duration || 1.5) * 1000;
                    const msPerWord = totalTimeMs / words.length;

                    let wordIndex = 0;
                    const typeWord = () => {
                      if (wordIndex < words.length) {
                        voiceFullText += (words[wordIndex] + " ");
                        setMessages(prev => {
                          const newMsgs = [...prev];
                          const lastMsg = newMsgs[newMsgs.length - 1];
                          if (lastMsg && lastMsg.role === 'assistant') {
                            lastMsg.text = voiceFullText.trim();
                          }
                          return newMsgs;
                        });
                        wordIndex++;
                        setTimeout(typeWord, msPerWord);
                      }
                    };
                    typeWord();
                  }
                });
              },
              // Callback 2: On Complete
              () => {
                setTimeout(() => setIsSpeaking(false), 2000);
                setIsProcessing(false);
                profiler.end('Pipeline_Voice_Total');
                abortControllerRef.current = null;
              },
              // Callback 3: Update Chat Text (Streaming) -> IGNORE
              (fullText) => { },
              controller.signal
            );
          } catch (error) {
            if (error.name === 'AbortError') {
              console.log("Voice generation stopped by user");
            } else {
              console.error("Voice Error:", error);
            }
            setIsSpeaking(false);
            setIsProcessing(false);
            abortControllerRef.current = null;
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
        className="absolute top-24 bottom-32 left-4 md:left-10 z-40 w-full md:w-[450px] overflow-y-auto no-scrollbar mask-gradient pr-4"
      >
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((msg, idx) => {
            if (msg.role === 'assistant' && !msg.text) return null;
            return (
              <div
                key={idx}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative transform transition-all duration-300 max-w-[80%] md:max-w-[60%] px-6 py-4 rounded-2xl backdrop-blur-xl shadow-glass text-sm md:text-base leading-relaxed ${msg.role === 'user'
                    ? 'bg-cyan/10 border border-cyan/30 text-cyan rounded-tr-sm mr-0 hover:bg-cyan/20 shadow-glow-cyan-subtle'
                    : 'glass-panel text-offwhite rounded-tl-sm ml-0 hover:border-violet/30'
                    }`}
                >
                  <p className="font-mono text-xs opacity-50 mb-1 mb-2 tracking-widest uppercase">
                    {msg.role === 'user' ? 'You' : 'Dextora'}
                  </p>
                  <div className="font-sans font-light">
                    {msg.text}
                  </div>

                  {/* Tech accents */}
                  {msg.role !== 'user' && (
                    <div className="absolute -left-1 top-4 w-0.5 h-6 bg-violet/50"></div>
                  )}
                </div>
              </div>
            )
          })}
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
        <div className="flex items-center gap-4 p-2 rounded-full glass-panel border border-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.1)] transition-all hover:shadow-[0_0_50px_rgba(0,243,255,0.2)]">

          {/* Mute Button */}
          <button
            onClick={() => {
              const newState = !isMuted;
              setIsMuted(newState);
              setMuted(newState);
            }}
            className={`p-4 rounded-full border transition-all duration-300 ${isMuted
              ? 'bg-red-500/20 text-red-500 border-red-500/50'
              : 'bg-charcoal/50 text-cyan border-cyan/30 hover:bg-cyan/10 hover:shadow-glow-cyan'
              }`}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>


          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full border transition-all duration-300 group ${isListening
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]'
              : 'bg-charcoal/50 hover:bg-cyan/20 text-cyan border-cyan/30 hover:shadow-glow-cyan'
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
            onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
            placeholder="Initialize query..."
            disabled={isProcessing}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-cyan/30 text-lg px-4 font-mono tracking-wide disabled:opacity-50"
          />

          {/* Send / Stop Button */}
          {isProcessing ? (
            <button
              onClick={handleStop}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-in zoom-in duration-300"
              aria-label="Stop generation"
            >
              <Square className="w-6 h-6 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-4 rounded-full bg-cyan text-charcoal hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]"
              aria-label="Send message"
            >
              <Send className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export default Chat;
