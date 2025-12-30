import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Message = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Bhai project kab tak deliver hoga?", own: false },
    { id: 2, text: "Bas testing chal rahi hai, sham tak pakka!", own: true },
  ]);
  
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SEND MESSAGE LOGIC (Fixed)
  const handleSend = (e) => {
    e.preventDefault(); // Form reload rokne ke liye
    if (input.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      own: true,
    };

    setMessages([...messages, newMessage]);
    setInput(""); // Clear box after send
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto px-2 sm:px-6">
      
      {/* 1. Header - Compact for 250px */}
      <div className="flex items-center justify-between p-3 sm:p-5 bg-white/5 border border-white/10 rounded-2xl mb-4 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-400/20 rounded-full flex items-center justify-center border border-cyan-400/30">
            <User size={16} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Client1</h2>
            <p className="text-[8px] sm:text-[9px] text-green-500 font-bold uppercase tracking-tighter">Online</p>
          </div>
        </div>
      </div>

      {/* 2. Chat Area - Responsive text size */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.own ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-2xl text-[10px] sm:text-xs font-medium leading-relaxed
              ${m.own 
                ? "bg-cyan-400 text-black rounded-tr-none shadow-[0_10px_30px_rgba(34,211,238,0.2)]" 
                : "bg-white/5 border border-white/10 text-gray-300 rounded-tl-none"}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Box - Moved UP & Responsive for 250px */}
      <div className="py-4 sm:py-6">
        <form 
          onSubmit={handleSend}
          className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 sm:p-2 backdrop-blur-xl focus-within:border-cyan-400/50 transition-all"
        >
          <textarea
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(e)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none outline-none px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-white placeholder:text-gray-600 resize-none overflow-hidden"
          />
          <button 
            type="submit"
            className="p-3 sm:p-4 bg-cyan-400 text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-center text-[8px] text-gray-700 mt-3 uppercase tracking-[0.3em] font-black">
          Encrypted Connection Secure
        </p>
      </div>
    </div>
  );
};

export default Message;