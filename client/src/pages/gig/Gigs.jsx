import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';
import GigCard from '../../Components/Cards/GigCard';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await apiClient.get('/gigs');
        setGigs(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load gigs');
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] pt-8 sm:pt-12 md:pt-32 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-white uppercase mb-6 sm:mb-8 md:mb-10">
          Campus <span className="text-cyan-400">Market</span>
        </h1>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && gigs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No gigs available yet</p>
          </div>
        )}

        {!loading && !error && gigs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
