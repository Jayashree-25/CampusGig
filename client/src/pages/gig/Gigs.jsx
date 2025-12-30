import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GigCard from '../../Components/Cards/GigCard'; // <--- Path updated as per your sidebar
import { Search } from 'lucide-react';

const Gigs = () => {
  return (
    <div className="min-h-screen bg-[#030712] pt-8 sm:pt-12 md:pt-32 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-white uppercase mb-6 sm:mb-8 md:mb-10">
          Campus <span className="text-cyan-400">Market</span>
        </h1>
        {/* Simple grid for testing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
           <GigCard /> 
        </div>
      </div>
    </div>
  );
};

export default Gigs;