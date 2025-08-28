import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';

interface Message {
  role: string;
  content: string;
  timestamp: Date;
}

export default function ModernChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    // Simulate API call
    setTimeout(() => {
      const responses = [
        'I understand your question. Let me help you with that.',
        "That's an interesting point. Here's what I think...",
        'Great question! Based on my knowledge, I can tell you that...',
        "I'd be happy to assist you with that. Let me provide some information...",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: randomResponse,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    simulateTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex flex-col items-center p-4 min-h-screen">
        {/* Header */}
        <div className="w-full max-w-4xl mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Converso AI
              </h1>
            </div>
            <p className="text-slate-400 text-sm">
              Your intelligent conversation partner
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="w-full max-w-4xl flex-1 flex flex-col">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[70vh]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex flex-col max-w-[80%] ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 px-2">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-3xl">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                      <span className="text-sm text-white/70">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Press Enter to send)"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 pr-12 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
                    rows={1}
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || isTyping}
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Powered by AI • Built with React
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thumb-white\\/20::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thumb-white\\/20::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
