import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Messages = () => {
  const chats = [
    { id: "1", name: "Client1", last: "Assingment done?", time: "2m ago" },
    { id: "2", name: "Utkarsh", last: "Payment done!", time: "1h ago" }
  ];

  return (
    <div className="min-h-screen bg-[#030712] pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-10">
          Messages <span className="text-cyan-400">({chats.length})</span>
        </h1>
        <div className="space-y-4">
          {chats.map(chat => (
            <Link to={`/message/${chat.id}`} key={chat.id} className="flex items-center justify-between p-6 rounded-[32px] bg-white/5 border border-white/10 hover:border-cyan-400 transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-black italic text-xl">
                  {chat.name[0]}
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-sm italic">{chat.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">{chat.last}</p>
                </div>
              </div>
              <ArrowRight className="text-gray-700 group-hover:text-cyan-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;