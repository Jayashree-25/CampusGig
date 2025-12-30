import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  // 🚧 MOCK DATA: We will replace this with real API data later
  const user = {
    name: "CampusUser",
    email: "student@university.edu",
    role: "Student Freelancer",
    joined: "December 2024"
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">
            My <span className="text-cyan-400">Profile</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Manage your account
          </p>
        </div>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[32px] p-8 sm:p-12 backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col items-center relative z-10">
            {/* Avatar Circle */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-cyan-400 to-teal-500 rounded-full p-[2px] mb-6 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
              <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center">
                <User size={48} className="text-cyan-400" />
              </div>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-wide">{user.name}</h2>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider mt-2">
              <Shield size={10} /> {user.role}
            </span>

            {/* Info Grid */}
            <div className="w-full grid gap-4 mt-10">
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-sm sm:text-base">{user.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Member Since</p>
                  <p className="font-semibold text-sm sm:text-base">{user.joined}</p>
                </div>
              </div>

            </div>

            {/* Logout Button (Visual Only for now) */}
            <button className="mt-8 w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;