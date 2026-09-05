import React from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const GigCard = ({ gig }) => {
  const imageUrl = gig.cover_image
    ? `${API_BASE.replace('/api', '')}${gig.cover_image}`
    : null;

  return (
    <Link to={`/gig/${gig.id}`} className="block p-6 rounded-[32px] bg-white/5 border border-white/10 hover:border-cyan-400 transition-all">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={gig.title}
          className="h-40 w-full object-cover rounded-2xl mb-4"
        />
      ) : (
        <div className="h-40 bg-cyan-400/10 rounded-2xl mb-4 flex items-center justify-center">
          <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">No Image</span>
        </div>
      )}
      <h3 className="text-white font-black italic uppercase text-sm line-clamp-2">{gig.title}</h3>
      <p className="text-cyan-400 font-black mt-2">₹{gig.price}</p>
    </Link>
  );
};

export default GigCard;
