import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin, Zap, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#030712] border-t border-white/10 pt-10 sm:pt-14 md:pt-20 pb-6 sm:pb-8 md:pb-10 px-3 sm:px-4 md:px-6 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] sm:h-[250px] md:h-[300px] bg-cyan-500/5 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-16 mb-10 md:mb-16">
          
          {/* Brand Identity */}
          <div className="col-span-1">
            <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6">
              <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
                <Zap size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-black fill-current" />
              </div>
              <span className="text-sm sm:text-base md:text-xl font-black italic tracking-tighter text-white uppercase font-sans">CampusGig</span>
            </div>
            <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-sm">
              The high-trust marketplace for professional campus services. Empowering student freelancers to build their future today.
            </p>
            <div className="flex gap-3 sm:gap-4 md:gap-5">
              <Instagram className="text-gray-600 hover:text-cyan-400 transition-colors cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
              <Twitter className="text-gray-600 hover:text-cyan-400 transition-colors cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
              <Linkedin className="text-gray-600 hover:text-cyan-400 transition-colors cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
              <Github className="text-gray-600 hover:text-cyan-400 transition-colors cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Platform Links */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 col-span-1 md:col-span-1">
            <div>
              <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-cyan-400 mb-4 sm:mb-6 md:mb-8 font-sans">Platform</h4>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                <li><Link to="/gigs" className="text-gray-500 hover:text-white text-[9px] sm:text-[10px] md:text-[11px] transition-colors font-bold uppercase tracking-tighter md:tracking-widest">Marketplace</Link></li>
                <li><Link to="/add-gig" className="text-gray-500 hover:text-white text-[9px] sm:text-[10px] md:text-[11px] transition-colors font-bold uppercase tracking-tighter md:tracking-widest">List Service</Link></li>
                <li><Link to="/messages" className="text-gray-500 hover:text-white text-[9px] sm:text-[10px] md:text-[11px] transition-colors font-bold uppercase tracking-tighter md:tracking-widest">Inbox</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-cyan-400 mb-4 sm:mb-6 md:mb-8 font-sans">Support</h4>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                <li className="text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-tighter md:tracking-widest cursor-pointer hover:text-white transition-colors">Help Center</li>
                <li className="text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-tighter md:tracking-widest cursor-pointer hover:text-white transition-colors">Safety</li>
                <li className="text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-tighter md:tracking-widest cursor-pointer hover:text-white transition-colors">Contact</li>
              </ul>
            </div>
          </div>

          {/* System Status */}
          <div className="col-span-1">
            <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-cyan-400 mb-4 sm:mb-6 md:mb-8 font-sans">Network Status</h4>
            <div className="p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-white text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] font-sans">Systems Active</span>
              </div>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-600 font-bold uppercase tracking-tighter mb-2 sm:mb-3 md:mb-4 leading-relaxed">Secure Node: 204.1.0.X8</p>
              <div className="flex items-center gap-1 sm:gap-2 text-cyan-400/60">
                <Globe size={10} className="sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-tighter md:tracking-widest font-sans underline cursor-pointer hover:text-cyan-400 transition-colors">Global Server Map</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 sm:pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-5 md:gap-6">
          <p className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] md:tracking-[0.4em] font-sans">
            © 2025 CampusGig. Decentralized Campus Economy.
          </p>
          <div className="flex gap-6 sm:gap-8 md:gap-10">
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-tighter md:tracking-widest cursor-pointer hover:text-white transition-all font-sans">Privacy</span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-tighter md:tracking-widest cursor-pointer hover:text-white transition-all font-sans">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;