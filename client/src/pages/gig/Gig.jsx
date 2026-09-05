import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../lib/apiClient';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const Gig = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await apiClient.get(`/gigs/${id}`);
        setGig(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Gig not found');
        } else {
          setError(err.response?.data?.error || 'Failed to load gig');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setOrdering(true);
    setOrderError('');
    try {
      await apiClient.post('/orders', { gig_id: gig.id });
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  const imageUrl = gig?.cover_image
    ? `${API_BASE.replace('/api', '')}${gig.cover_image}`
    : null;

  const isOwnGig = isAuthenticated && user && gig && user.id === gig.freelancer_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] pt-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030712] pt-32 text-center px-4">
        <h1 className="text-4xl font-black italic text-red-400 uppercase">Error</h1>
        <p className="text-gray-500 mt-4 font-bold tracking-widest uppercase text-xs">{error}</p>
        <Link to="/gigs" className="inline-block mt-8 px-6 py-3 bg-cyan-400/10 border border-cyan-400/20 rounded-xl text-cyan-400 font-black uppercase tracking-widest text-xs hover:bg-cyan-400 hover:text-black transition-all">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] pt-24 sm:pt-28 md:pt-32 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/gigs" className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors mb-6 sm:mb-8 font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>

        {imageUrl && (
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8">
            <img src={imageUrl} alt={gig.title} className="w-full h-64 sm:h-80 md:h-96 object-cover" />
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-white uppercase mb-4">{gig.title}</h1>
          <p className="text-cyan-400 font-black text-xl sm:text-2xl mb-6">₹{gig.price}</p>

          {gig.description && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Description</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{gig.description}</p>
            </div>
          )}

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <User size={18} className="text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Seller</p>
                <p className="text-sm font-semibold text-white">Seller #{gig.freelancer_id}</p>
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="border-t border-white/10 mt-6 pt-6">
            {orderSuccess ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <CheckCircle size={20} className="text-green-400" />
                <div>
                  <p className="text-green-400 font-bold text-sm">Order placed successfully!</p>
                  <Link to="/orders" className="text-cyan-400 text-xs font-bold uppercase tracking-wider hover:underline">
                    View My Orders →
                  </Link>
                </div>
              </div>
            ) : isOwnGig ? (
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                <p className="text-gray-400 text-sm font-bold">This is your gig</p>
              </div>
            ) : (
              <>
                {orderError && (
                  <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                    {orderError}
                  </div>
                )}
                <button
                  onClick={handleOrder}
                  disabled={ordering}
                  className="w-full py-4 rounded-xl bg-cyan-400 text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ordering ? (
                    <><Loader2 size={16} className="animate-spin" /> Placing Order...</>
                  ) : (
                    <><ShoppingCart size={16} /> {!isAuthenticated ? 'Login to Order' : 'Place Order'}</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gig;
