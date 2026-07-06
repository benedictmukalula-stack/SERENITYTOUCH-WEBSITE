'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, CheckCircle } from 'lucide-react';
import { THERAPIST_TINA } from '@/lib/images';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isBookingConfirmation?: boolean;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('serenity-chat-session-id');
  if (!id) {
    id = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('serenity-chat-session-id', id);
  }
  return id;
}

function formatContent(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part === '\n') return <br key={i} />;
    return <span key={i}>{part}</span>;
  });
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedRef = useRef(false);

  const scrollToBottom = useCallback(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  const simulateStream = useCallback((fullText: string, isBooking: boolean) => {
    setIsStreaming(true);
    setStreamingText('');
    const words = fullText.split(/(\s+)/);
    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        setStreamingText(words.slice(0, index + 1).join(''));
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setStreamingText('');
        setMessages((prev) => [...prev, { role: 'assistant', content: fullText, timestamp: new Date().toISOString(), isBookingConfirmation: isBooking }]);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetch(`/api/chat?sessionId=${encodeURIComponent(getSessionId())}`)
      .then((r) => r.json()).then((d) => { if (d.success && Array.isArray(d.messages)) setMessages(d.messages); setIsConnected(true); })
      .catch(() => setIsConnected(true));
  }, [isOpen]);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, streamingText, scrollToBottom]);
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping || isStreaming) return;
    const sessionId = getSessionId();
    const userContent = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userContent, timestamp: new Date().toISOString() }]);
    setIsTyping(true);
    setInput('');
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, content: userContent }) });
      const data = await res.json();
      setIsTyping(false);
      if (data.success && data.message) {
        simulateStream(data.message.content, !!data.booking?.success);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: "I'm here! Let me try that again — what would you like to know?", timestamp: new Date().toISOString() }]);
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, connection lost. Try WhatsApp at +260 761 404 555.", timestamp: new Date().toISOString() }]);
    }
  }, [input, isTyping, isStreaming, simulateStream]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="surface-raised rounded-2xl overflow-hidden shadow-2xl"
            style={{ width: '380px', maxWidth: 'calc(100vw - 48px)', height: '500px', display: 'flex', flexDirection: 'column' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: 'linear-gradient(135deg, rgba(233,30,99,0.12), rgba(212,175,55,0.08))', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold/30 shadow-lg shrink-0">
                  <img src={THERAPIST_TINA} alt="Taonga" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="heading-display text-[13px] text-white leading-tight">Serenity</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-[9px] text-gold/50 uppercase tracking-wider">{isConnected ? 'Online' : 'Connecting...'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition cursor-pointer" aria-label="Close chat">
                <X className="w-4 h-4 text-gold/50" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 scrollbar-hide">
              {messages.length === 0 && !isTyping && !isStreaming && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/20 mb-3">
                    <img src={THERAPIST_TINA} alt="Taonga" className="w-full h-full object-cover" />
                  </div>
                  <p className="heading-display text-[14px] text-white mb-1">Hi, I&apos;m Serenity</p>
                  <p className="body-serif text-[12px] text-pink-glow/40 leading-relaxed mb-4">Ask me about treatments, pricing, or book an appointment right here.</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {['Book a massage', 'Show prices', 'What\'s available?'].map((s) => (
                      <button key={s} onClick={() => { setInput(s); setTimeout(() => sendMessage(), 100); }}
                        className="text-[10px] px-2.5 py-1.5 rounded-full border border-gold/15 text-pink-glow/50 hover:text-white hover:border-gold/30 hover:bg-gold/5 transition cursor-pointer">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <div className="w-5 h-5 rounded-full overflow-hidden border border-gold/20 shrink-0 mt-1"><img src={THERAPIST_TINA} alt="" className="w-full h-full object-cover" /></div>}
                  <div className={`max-w-[82%] px-3 py-2 text-[12.5px] leading-relaxed ${msg.role === 'user' ? 'bg-pink-brand/20 border border-pink-brand/20 rounded-2xl rounded-br-md text-white/90' : 'surface-raised border border-gold/10 rounded-2xl rounded-bl-md text-pink-glow/70 body-serif'}`}>
                    {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                    {msg.isBookingConfirmation && (
                      <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-gold/10">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-medium">Booking confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && streamingText && (
                <div className="flex gap-2 justify-start">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-gold/20 shrink-0 mt-1"><img src={THERAPIST_TINA} alt="" className="w-full h-full object-cover" /></div>
                  <div className="max-w-[82%] px-3 py-2 text-[12.5px] leading-relaxed surface-raised border border-gold/10 rounded-2xl rounded-bl-md text-pink-glow/70 body-serif">
                    {formatContent(streamingText)}<span className="inline-block w-1 h-3.5 bg-pink-brand/60 animate-pulse ml-0.5" />
                  </div>
                </div>
              )}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-gold/20 shrink-0 mt-1"><img src={THERAPIST_TINA} alt="" className="w-full h-full object-cover" /></div>
                  <div className="surface-raised border border-gold/10 rounded-2xl rounded-bl-md px-3.5 py-2.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-pink-brand/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-pink-brand/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 rounded-full bg-pink-brand/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3.5 py-2.5 shrink-0" style={{ borderTop: '1px solid rgba(212,175,55,0.06)' }}>
              <div className="flex items-center gap-2">
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..." disabled={!isConnected || isStreaming}
                  className="input-dark flex-1 text-[13px] py-2.5 px-3.5 disabled:opacity-40" />
                <button onClick={sendMessage} disabled={!input.trim() || !isConnected || isTyping || isStreaming}
                  className="btn-pink w-9 h-9 rounded-xl p-0 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" aria-label="Send">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB with Tina avatar */}
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full shadow-lg shadow-pink-brand/30 animate-pulse-glow flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #E91E63, #AD1457)' }}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="tina" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }} className="w-full h-full">
              <img src={THERAPIST_TINA} alt="Chat with Serenity" className="w-full h-full object-cover" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-2.5 h-2.5 text-black" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}