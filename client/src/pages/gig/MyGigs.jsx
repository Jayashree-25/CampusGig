import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import apiClient from '../../lib/apiClient';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const response = await apiClient.get('/gigs/mine');
        setGigs(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load your gigs');
      } finally {
        setLoading(false);
      }
    };
    fetchMyGigs();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/gigs/${id}`);
      setGigs((prev) => prev.filter((gig) => gig.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete gig');
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    return `${API_BASE.replace('/api', '')}${coverImage}`;
  };

  return (
    <div className="min-h-screen bg-[#030712] pt-8 sm:pt-12 md:pt-32 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-white uppercase">
            My <span className="text-cyan-400">Gigs</span>
          </h1>
          <button
            onClick={() => navigate('/add-gig')}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all font-black text-xs uppercase tracking-widest"
          >
            <Plus size={14} /> New Gig
          </button>
        </div>

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
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">You haven't created any gigs yet</p>
            <Link
              to="/add-gig"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all"
            >
              <Plus size={14} /> Create Your First Gig
            </Link>
          </div>
        )}

        {!loading && !error && gigs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {gigs.map((gig) => {
              const imageUrl = getImageUrl(gig.cover_image);
              return (
                <div key={gig.id} className="p-6 rounded-[32px] bg-white/5 border border-white/10">
                  {imageUrl ? (
                    <img src={imageUrl} alt={gig.title} className="h-40 w-full object-cover rounded-2xl mb-4" />
                  ) : (
                    <div className="h-40 bg-cyan-400/10 rounded-2xl mb-4 flex items-center justify-center">
                      <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  <h3 className="text-white font-black italic uppercase text-sm line-clamp-2 mb-2">{gig.title}</h3>
                  <p className="text-cyan-400 font-black mb-4">₹{gig.price}</p>

                  {confirmDeleteId === gig.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(gig.id)}
                        disabled={deletingId === gig.id}
                        className="flex-1 py-2 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                      >
                        {deletingId === gig.id ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 py-2 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/edit-gig/${gig.id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 text-gray-300 font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(gig.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 text-gray-300 font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition-all"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
