import React from 'react';
import { Link } from 'react-router-dom';

const GigCard = () => {
  return (
    <Link to="/gig/123" className="block p-6 rounded-[32px] bg-white/5 border border-white/10 hover:border-cyan-400 transition-all">
      <div className="h-40 bg-cyan-400/10 rounded-2xl mb-4" />
      <h3 className="text-white font-black italic uppercase text-sm">Campus Service</h3>
      <p className="text-cyan-400 font-black mt-2">₹500</p>
    </Link>
  );
};

export default GigCard;