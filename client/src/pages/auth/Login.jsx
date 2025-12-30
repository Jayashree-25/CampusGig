import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-3 sm:px-4 md:px-6 pt-16 sm:pt-20 md:pt-20">
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-blue-500/5 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-5 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-2xl relative z-10"
      >
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
            <LogIn className="text-white sm:w-6 sm:h-6 md:w-[28px] md:h-[28px]" size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Welcome <span className="text-cyan-400">Back</span></h2>
          <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 sm:mt-2 text-center">Authentication Required</p>
        </div>

        <form className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 ml-2 sm:ml-3 md:ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input type="email" placeholder="your@email.com" className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white" />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center ml-2 sm:ml-3 md:ml-4 mr-1 sm:mr-2">
              <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400">Password</label>
              <button type="button" className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase text-cyan-400/60 hover:text-cyan-400">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white" />
            </div>
          </div>

          <button className="w-full py-2.5 sm:py-3 md:py-5 bg-white text-black font-black uppercase tracking-tighter md:tracking-widest text-[8px] sm:text-[9px] md:text-xs rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-xl mt-3 sm:mt-4 md:mt-4">
            Secure Login
          </button>
        </form>

        <div className="mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 md:pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-xs font-medium">
            New to the campus network? <br/>
            <Link to="/register" className="text-cyan-400 hover:underline inline-block mt-1 sm:mt-2 font-bold uppercase tracking-tighter md:tracking-widest text-[8px] sm:text-[9px] md:text-[10px]">Create an Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;