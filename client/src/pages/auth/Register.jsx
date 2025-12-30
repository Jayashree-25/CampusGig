import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-3 sm:px-4 md:px-6 pt-16 sm:pt-20 md:pt-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-cyan-500/5 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-5 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-2xl relative z-10"
      >
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-cyan-400/10 border border-cyan-400/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
            <UserPlus className="text-cyan-400 sm:w-6 sm:h-6 md:w-[28px] md:h-[28px]" size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Start From <span className="text-cyan-400">Now</span></h2>
          <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-widest mt-1 sm:mt-2">Start your campus career</p>
        </div>

        <form className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 ml-2 sm:ml-3 md:ml-4">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white" />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 ml-2 sm:ml-3 md:ml-4">College Email</label>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input type="email" placeholder="name@college.edu" className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white" />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 ml-2 sm:ml-3 md:ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white" />
            </div>
          </div>

          <button className="w-full py-2.5 sm:py-3 md:py-5 bg-cyan-400 text-black font-black uppercase tracking-tighter md:tracking-widest text-[8px] sm:text-[9px] md:text-xs rounded-lg sm:rounded-xl md:rounded-2xl hover:shadow-[0_10px_30px_rgba(34,211,238,0.3)] transition-all active:scale-95 mt-2 sm:mt-3 md:mt-4">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 sm:mt-7 md:mt-8 text-gray-500 text-[8px] sm:text-[9px] md:text-xs font-medium">
          Already a member? <Link to="/login" className="text-cyan-400 hover:underline font-bold">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;