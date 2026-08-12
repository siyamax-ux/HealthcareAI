import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'नमस्ते! मैं GramSwasthya AI सहायक हूँ। स्वास्थ्य सम्बन्धी सवाल पूछें।' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'bot', 
          text: 'आपके लक्षणों की जांच की जा रही है। अधिक जानकारी के लिए कृपया हमारे Virtual Clinic या Voice Doctor सेक्शन का उपयोग करें।' 
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white shadow-2xl shadow-cyan-500/40 hover:scale-110 transition-transform flex items-center gap-2"
        >
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="hidden sm:inline font-bold text-xs">AI Assistant</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">GramSwasthya Companion</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Multilingual AI Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-950/80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI health question..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
