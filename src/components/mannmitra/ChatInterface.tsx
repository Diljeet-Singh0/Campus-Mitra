import React, { useState } from 'react';
import type { ChatMessage } from '../../types';
import { CartoonAvatarVisualizer } from './CartoonAvatarVisualizer';
import { Send, Mic, Globe, Sparkles, Shield, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, chatLoading = false }) => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('English');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const isTyping = chatLoading;

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || inputText;
    if (!finalMsg.trim()) return;
    onSendMessage(finalMsg);
    setInputText('');
  };

  const languages = ['English', 'Hindi', 'Hinglish', 'Tamil', 'Bengali', 'Marathi'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px] lg:h-[calc(100vh-140px)]">
      <div className="lg:col-span-7 glass-panel rounded-3xl p-4 lg:p-6 flex flex-col justify-between border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
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
              onClick={() => setIsVoiceOpen(true)}
              className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300 hover:bg-teal-500/25 transition-all shadow-xs shrink-0"
              title="Start Voice Session"
            >
              <Mic className="w-4 h-4" />
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
                      {msg.sender === 'user' ? 'Aarohi' : 'MannMitra'}
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
            <span>Language: {language}</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-5">
        <CartoonAvatarVisualizer isSpeaking={isTyping} />
      </div>

      {isVoiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-8 rounded-3xl max-w-md w-full border border-teal-500/30 text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto animate-pulse">
              <Mic className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Voice Assistant Active</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Speak naturally to MannMitra in English, Hindi, or your preferred language.
              </p>
            </div>
            <button
              onClick={() => setIsVoiceOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 text-xs font-bold transition-all"
            >
              Close Voice Session
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
