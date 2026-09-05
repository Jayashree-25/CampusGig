import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';

import Home from './pages/Home'; 
import Gigs from './pages/gig/Gigs'; 
import Gig from './pages/gig/Gig';
import Orders from './pages/orders/Orders';
import Messages from './pages/message/Messages';
import Message from './pages/message/Message';
import AddGig from './pages/gig/AddGig';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';

function App() {
  const location = useLocation();

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-teal-500/30 overflow-x-hidden relative">
      
      {/* BACKGROUND LAYER (Clean — No Stars, No Comets) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]" />

      {/* CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/gigs" element={<Gigs />} />
              <Route path="/gig/:id" element={<Gig />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-gig" element={<AddGig />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/message/:id" element={<Message />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Home />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
