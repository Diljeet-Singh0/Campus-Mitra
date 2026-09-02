import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, ChatSession } from '../../types';
import { CartoonAvatarVisualizer } from './CartoonAvatarVisualizer';
import {
  Send,
  Mic,
  MicOff,
  Globe,
  Sparkles,
  Shield,
  RefreshCw,
  Volume2,
  VolumeX,
  Plus,
  MessageSquare,
  Trash2,
  History,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatLoading?: boolean;
  userName?: string;
  chatSessions?: ChatSession[];
  activeSessionId?: string;
  onCreateNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  onDeleteSession?: (id: string, e?: React.MouseEvent) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  chatLoading = false,
  userName,
  chatSessions = [],
  activeSessionId,
  onCreateNewSession,
  onSelectSession,
  onDeleteSession
}) => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('English');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const userDisplayName = userName ? userName.split(' ')[0] : 'You';

  const isTyping = chatLoading;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading]);

  // Read newest MannMitra message aloud if TTS is enabled
  useEffect(() => {
    if (!isTTSEnabled || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === 'mannmitra' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lastMsg.text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      if (language === 'Hindi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isTTSEnabled, language]);

  // Speech Recognition Setup & Control
  const startListening = () => {
    setVoiceError(null);
    setTranscript('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser. Try Google Chrome or MS Edge.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error !== 'no-speech') {
          setVoiceError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to initialize speech recognition:', e);
      setVoiceError('Could not start microphone.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendVoiceMessage = () => {
    stopListening();
    if (transcript.trim()) {
      onSendMessage(transcript.trim());
      setTranscript('');
      setIsVoiceOpen(false);
    }
  };

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || inputText;
    if (!finalMsg.trim()) return;
    onSendMessage(finalMsg);
    setInputText('');
  };

  const openVoiceSession = () => {
    setIsVoiceOpen(true);
    startListening();
  };

  const closeVoiceSession = () => {
    stopListening();
    setIsVoiceOpen(false);
    setTranscript('');
    setVoiceError(null);
  };

  const languages = ['English', 'Hindi', 'Hinglish', 'Tamil', 'Bengali', 'Marathi'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px] lg:h-[calc(100vh-140px)]">
      {/* Main Chat Interface Panel */}
      <div className="lg:col-span-7 glass-panel rounded-3xl p-4 lg:p-6 flex flex-col justify-between border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Slide-over Chat History Overlay Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Blurry Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md z-30 transition-opacity cursor-pointer"
              />

              {/* Sliding Drawer Container */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 240 }}
                className="absolute top-0 left-0 bottom-0 w-80 max-w-[85%] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-2xl z-40 p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Previous Chats
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onCreateNewSession?.();
                          setIsSidebarOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3 h-3" /> New
                      </motion.button>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto space-y-2 pr-1 max-h-[calc(100vh-280px)]">
                    {chatSessions && chatSessions.length > 0 ? (
                      chatSessions.map((session) => {
                        const isActive = session.id === activeSessionId;
                        return (
                          <div
                            key={session.id}
                            onClick={() => {
                              onSelectSession?.(session.id);
                              setIsSidebarOpen(false);
                            }}
                            className={`p-3 rounded-2xl cursor-pointer transition-all border group flex items-center justify-between gap-2 ${
                              isActive
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-300 font-bold shadow-xs'
                                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs truncate leading-tight">{session.title}</p>
                                <p className="text-[10px] opacity-60 font-mono mt-0.5">{session.createdAt || 'Today'}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession?.(session.id, e);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 transition-all shrink-0"
                              title="Delete chat session"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 italic">No past sessions.</div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-medium text-center">
                  Multi-Turn Encrypted Sessions
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Cartoon Mascot Greeting Banner */}
        <div className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 mb-2 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-xl animate-bounce">😊</span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                MannMitra AI Companion
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">Online</span>
              </p>
              <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">"Hi! I'm here with a warm smile. Speak freely!"</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Top-Left History Drawer Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
              title="Open Chat History"
            >
              <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold hidden sm:inline">History</span>
            </motion.button>

            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                MannMitra AI Companion
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold">
                  Private Session
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 font-medium">Always here to listen & help you reflect</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Text-to-Speech Voice Output Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const next = !isTTSEnabled;
                setIsTTSEnabled(next);
                if (!next && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                isTTSEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
              title={isTTSEnabled ? 'Voice output ON (Click to mute)' : 'Voice output OFF (Click to read responses aloud)'}
            >
              {isTTSEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </motion.button>

            <div className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-semibold">
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-transparent text-xs outline-none cursor-pointer text-slate-900 dark:text-slate-200"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openVoiceSession}
              className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300 hover:bg-teal-500/25 transition-all shadow-xs shrink-0 relative"
              title="Start Voice Assistant Session"
            >
              <Mic className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 min-h-[300px] max-h-[480px]">
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed font-medium ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                      : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.sender === 'user' ? 'text-emerald-100' : 'text-teal-700 dark:text-teal-400'}`}>
                      {msg.sender === 'user' ? userDisplayName : 'MannMitra'}
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">{msg.timestamp}</span>
                  </div>
                  <p>{msg.text}</p>
                  {/* Tier / emotion badge for RAG-backed AI messages */}
                  {msg.sender === 'mannmitra' && (msg.tier || msg.isCrisis) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.isCrisis && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-700 dark:text-red-300 font-bold">🔴 CRISIS</span>
                      )}
                      {!msg.isCrisis && msg.tier === 'RED' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 font-bold">🔴 High Distress</span>
                      )}
                      {!msg.isCrisis && msg.tier === 'YELLOW' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-300 font-bold">🟡 Moderate</span>
                      )}
                      {msg.emotion && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium capitalize">{msg.emotion}</span>
                      )}
                      {msg.ragUsed && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-medium">📚 Knowledge</span>
                      )}
                    </div>
                  )}
                </div>

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%] sm:max-w-[85%]">
                    {msg.suggestions.map((sug, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all text-left font-bold shadow-xs"
                      >
                        💡 {sug}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-teal-50 dark:bg-slate-900/80 border border-teal-200 dark:border-slate-800 text-xs text-teal-800 dark:text-teal-400 w-fit font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>MannMitra is thinking empathetically...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Express what is on your mind..."
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all font-medium"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openVoiceSession}
              className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300 hover:bg-teal-500/25 transition-all shrink-0"
              title="Speak with Voice Assistant"
            >
              <Mic className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold shadow-md shadow-emerald-600/30 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Non-judgmental AI support companion
            </span>
            <span>Language: {language} ({isTTSEnabled ? '🔊 Voice On' : '🔇 Muted'})</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-5">
        <CartoonAvatarVisualizer isSpeaking={isTyping} />
      </div>

      {/* Real Interactive Voice Assistant Modal */}
      {isVoiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-8 rounded-3xl max-w-md w-full border border-teal-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-teal-500/30 animate-pulse" />
                </>
              )}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center relative z-10 transition-all ${
                isListening
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40 scale-105'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <MicOff className="w-10 h-10" />}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                Voice Assistant
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isListening ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isListening ? 'Listening...' : 'Paused'}
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Speak in {language}. Your voice will be transcribed directly to MannMitra.
              </p>
            </div>

            {/* Live Transcript Display */}
            <div className="min-h-[70px] max-h-[120px] overflow-y-auto p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 text-left font-medium">
              {transcript ? (
                <p className="leading-relaxed font-sans">{transcript}</p>
              ) : (
                <p className="text-slate-500 italic text-center text-xs">
                  {isListening ? "Listening... start speaking now." : "Click 'Start Speaking' to begin."}
                </p>
              )}
            </div>

            {voiceError && (
              <p className="text-xs font-semibold text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-800/40">
                ⚠️ {voiceError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="py-2.5 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all"
                >
                  Pause Mic
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className="py-2.5 px-4 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold hover:bg-teal-500/30 transition-all"
                >
                  Start Speaking
                </button>
              )}

              <button
                onClick={handleSendVoiceMessage}
                disabled={!transcript.trim()}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Voice
              </button>
            </div>

            <button
              onClick={closeVoiceSession}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
            >
              Close Voice Session
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

