import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, History, IndianRupee, AlertCircle } from 'lucide-react';

const Wallet = () => {
  // 🚧 MOCK DATA: We will connect this to 'GET /wallet' later
  const [balance, setBalance] = useState(2500); 
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = (e) => {
    e.preventDefault();
    alert(`Withdrawal request for ₹${withdrawAmount} sent!`);
    setWithdrawAmount('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">
            My <span className="text-cyan-400">Wallet</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Earnings & Withdrawals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: Balance Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-[32px] p-8 relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <WalletIcon size={120} className="text-cyan-400" />
            </div>

            <div className="relative z-10">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-2">Total Balance</p>
              <h2 className="text-5xl sm:text-6xl font-black text-white flex items-center gap-2">
                <IndianRupee size={40} className="text-gray-400" />
                {balance}
              </h2>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                  <AlertCircle size={16} />
                  <span>Payments are processed every Friday.</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Withdraw Form */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ArrowUpRight className="text-cyan-400" /> Withdraw Funds
            </h3>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount (INR)</label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-400/50 transition-all font-mono"
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                Request Payout
              </button>
            </form>
          </motion.div>

        </div>

        {/* BOTTOM: Transaction History (Mock) */}
        <div className="mt-12">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-300">
            <History size={20} /> Recent Activity
          </h3>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
             {/* Mock Transaction Item */}
             <div className="p-6 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                    <ArrowUpRight size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Project Completion: Logo Design</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <span className="text-green-400 font-mono font-bold">+ ₹800</span>
             </div>

             {/* Mock Withdrawal Item */}
             <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                    <ArrowUpRight size={20} className="rotate-45" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Withdrawal to Bank</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <span className="text-white font-mono font-bold">- ₹2,000</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Wallet;