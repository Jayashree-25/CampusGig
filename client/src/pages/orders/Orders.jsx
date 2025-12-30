import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const Orders = () => {
  return (
    <div className="min-h-screen bg-[#030712] pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12">My <span className="text-cyan-400">Orders</span></h1>
        
        <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <th className="p-8">Service</th>
                <th className="p-8">Price</th>
                <th className="p-8">Contact</th>
                <th className="p-8">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                <td className="p-8">Logo Design for Fest</td>
                <td className="p-8 font-bold">₹800</td>
                <td className="p-8">
                  <button className="w-10 h-10 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-full flex items-center justify-center hover:bg-cyan-400 hover:text-black transition-all">
                    <MessageSquare size={16} />
                  </button>
                </td>
                <td className="p-8">
                  <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase border border-green-500/20">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;