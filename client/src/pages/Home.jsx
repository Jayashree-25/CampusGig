import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, MousePointer2, Sparkles } from 'lucide-react';
import Background3D from '../Components/Background3D';
import MagneticButton from '../Components/MagneticButton';
import imgAsset from '../assets/img.jpeg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white relative">
      
      <Background3D />

      {/* HERO SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-8 sm:pt-12 md:pt-20 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 md:mb-10 px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2 rounded-full border border-teal-500/20 bg-teal-500/5 backdrop-blur-3xl flex items-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(20,184,166,0.1)]"
        >
          <Sparkles size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-teal-400 animate-pulse" />
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-teal-400/80">CampusGig</span>
        </motion.div>

        <div className="text-center max-w-5xl">

          <div className="overflow-hidden mb-6 sm:mb-8 md:mb-10">
            <motion.span
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-9xl font-black italic uppercase leading-[0.9]"
            >
              CAMPUS
            </motion.span>

            <motion.span
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-9xl font-black italic uppercase text-teal-400 drop-shadow-[0_0_40px_rgba(20,184,166,0.4)] leading-[0.9]"
            >
              GIG.
            </motion.span>

            <motion.span
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-9xl font-black italic uppercase leading-[0.9]"
            >
              UNLOCKED.
            </motion.span>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-xs sm:text-sm md:text-lg lg:text-2xl font-medium max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 leading-relaxed tracking-tight px-2"
          >
            The high-trust marketplace for peer-to-peer services. Find and book 
            <span className="text-white"> expert student talent</span> for your next big project.
          </motion.p>


          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center w-full px-2">

            <MagneticButton
              onClick={() => navigate('/login')}
              className="group relative w-full sm:w-auto px-6 sm:px-10 md:px-14 py-3 sm:py-4 md:py-6 bg-teal-500 text-black font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-[11px] rounded-lg sm:rounded-xl md:rounded-2xl hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] transition-all"
            >
              Get Started
              <MousePointer2 className="hidden md:block absolute -right-4 -bottom-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </MagneticButton>

            <button 
              onClick={() => navigate('/add-gig')}
              className="w-full sm:w-auto px-6 sm:px-10 md:px-14 py-3 sm:py-4 md:py-6 border border-teal-500/30 bg-teal-500/5 backdrop-blur-xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-[11px] rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-teal-500/10 transition-all text-teal-400 hover:border-teal-400"
            >
              Create Gig
            </button>

          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="relative z-10 py-12 sm:py-20 md:py-32 px-3 sm:px-4 md:px-6 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center justify-center">
          
          {/* TEXT SECTION */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 flex flex-col items-start justify-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">
              The Campus Marketplace
            </div>

            <p className="text-gray-400 text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed font-medium max-w-md">
              CampusGig is the dedicated platform for student freelancers. We connect talent with need, right here on campus.
              <br/><br/>
              Whether you need a logo for your club or help with a complex coding assignment, find talented students instantly on your campus.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-teal-400 font-black text-[8px] sm:text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em]">
              <div className="flex items-center gap-1 sm:gap-2"><Zap size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" /> Direct Student2Student</div>
              <div className="flex items-center gap-1 sm:gap-2"><ShieldCheck size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" /> Secure Services</div>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-auto flex justify-center items-center"
          >
            <div className="relative max-w-xl w-full rounded-2xl sm:rounded-3xl md:rounded-[40px] overflow-hidden border-2 border-cyan-400/60 backdrop-blur-xl shadow-2xl group hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-cyan-500/30 rounded-2xl sm:rounded-3xl md:rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <img 
                src={imgAsset} 
                alt="CampusGig Marketplace" 
                className="relative w-full h-auto object-cover rounded-2xl sm:rounded-3xl md:rounded-[40px] group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl sm:rounded-3xl md:rounded-[40px]" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;