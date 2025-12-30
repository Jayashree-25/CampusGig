import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, LogOut, Mail, Settings } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
      <div className="max-w-7xl mx-auto bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[12px] sm:rounded-[16px] md:rounded-[24px] px-3 sm:px-4 md:px-8 py-2 sm:py-2.5 md:py-3 flex items-center justify-between shadow-2xl gap-2 sm:gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 sm:gap-2 group flex-shrink-0">
          <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 bg-cyan-400 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Zap size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-black fill-current" />
          </div>
          <span className="text-sm sm:text-base md:text-xl font-black italic tracking-tighter text-white uppercase font-sans whitespace-nowrap">
            Campus<span className="text-cyan-400">Gig</span>
          </span>
        </Link>

        {/* Navigation - Show only when logged in */}
        {isLoggedIn && (
          <div className="hidden lg:flex items-center gap-4 xl:gap-10">
            <Link to="/gigs" className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 hover:text-cyan-400 transition-colors">Marketplace</Link>
            <Link to="/orders" className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 hover:text-cyan-400 transition-colors">Orders</Link>
            <Link to="/messages" className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 hover:text-cyan-400 transition-colors">Messages</Link>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => navigate('/add-gig')}
                className="hidden sm:flex px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-cyan-400/10 border border-cyan-400/20 rounded-lg sm:rounded-xl text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-tighter md:tracking-widest"
              >
                Create Gig
              </button>

              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2 sm:p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:border-cyan-400/50 transition-all text-gray-400 hover:text-cyan-400"
                >
                  <User size={16} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-44 md:w-48 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10">
                      <p className="text-[8px] sm:text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-400">Account</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:bg-cyan-400/10 hover:text-cyan-400 transition-all text-xs sm:text-sm font-semibold"
                    >
                      <Settings size={14} className="sm:w-4 sm:h-4 md:w-[16px] md:h-[16px]" />
                      <span className="truncate">Account Info</span>
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs sm:text-sm font-semibold border-t border-white/10"
                    >
                      <LogOut size={14} className="sm:w-4 sm:h-4 md:w-[16px] md:h-[16px]" />
                      <span className="truncate">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="p-2 sm:p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:border-cyan-400/50 transition-all text-gray-400 hover:text-cyan-400"
            >
              <User size={16} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;