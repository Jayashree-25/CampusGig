import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Tag, IndianRupee, Image as ImageIcon, Type, AlignLeft, UploadCloud } from 'lucide-react';
import apiClient from '../../lib/apiClient';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    price: '',
    desc: '',
    deliveryTime: '',
  });
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await apiClient.get(`/gigs/${id}`);
        const gig = response.data;
        setFormData({
          title: gig.title || '',
          category: 'Tech',
          price: gig.price?.toString() || '',
          desc: gig.description || '',
          deliveryTime: '',
        });
        if (gig.cover_image) {
          setExistingImage(`${API_BASE.replace('/api', '')}${gig.cover_image}`);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Gig not found');
        } else if (err.response?.status === 403) {
          setError('Not authorized to edit this gig');
        } else {
          setError(err.response?.data?.error || 'Failed to load gig');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExistingImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.desc);
      data.append('price', formData.price);

      if (file) {
        data.append('coverImage', file);
      }

      await apiClient.put(`/gigs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/my-gigs');
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Not authorized to edit this gig');
      } else {
        setError(err.response?.data?.error || 'Failed to update gig');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] pt-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-[#030712] pt-32 text-center px-4">
        <p className="text-red-400 text-sm font-bold">{error}</p>
        <button
          onClick={() => navigate('/my-gigs')}
          className="mt-6 px-6 py-3 bg-cyan-400/10 border border-cyan-400/20 rounded-xl text-cyan-400 font-black uppercase tracking-widest text-xs hover:bg-cyan-400 hover:text-black transition-all"
        >
          Back to My Gigs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-16 md:py-32 px-3 sm:px-4 md:px-6 flex justify-center items-start bg-[#030712] text-white">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full bg-white/[0.02] p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[48px] border border-white/10 backdrop-blur-3xl shadow-2xl">
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 italic tracking-tighter uppercase">Edit <span className="text-white">Gig</span></h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Service Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
              <Type size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 transition-all text-sm text-white"
              placeholder="I will design your poster..."
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
              <Tag size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 appearance-none text-gray-400 text-sm"
            >
              <option value="Tech">Tech / Coding</option>
              <option value="Design">Graphic Design</option>
              <option value="Writing">Assignments</option>
            </select>
          </div>
        </div>

        {/* Cover Image */}
        <div className="mt-4 sm:mt-6 md:mt-8 space-y-1.5 sm:space-y-2">
          <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
            <ImageIcon size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Cover Image
          </label>
          {existingImage && !file && (
            <div className="mb-2">
              <img src={existingImage} alt="Current cover" className="h-32 rounded-lg object-cover" />
              <p className="text-gray-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Current image — upload new to replace</p>
            </div>
          )}
          <div className="relative w-full group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-lg sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-gray-400 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/5 transition-all">
              {file ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <ImageIcon size={20} />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              ) : (
                <>
                  <UploadCloud size={24} className="mb-2 text-gray-500" />
                  <span className="text-xs uppercase tracking-widest font-bold">Click to Change Cover</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 sm:mt-6 md:mt-8 space-y-1.5 sm:space-y-2">
          <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
            <AlignLeft size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Service Description
          </label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            rows="3"
            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-5 outline-none focus:border-cyan-400 transition-all text-sm text-white"
            placeholder="Describe your service in detail..."
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8">
          {/* Price */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
              <IndianRupee size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Price
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 text-sm text-white"
              placeholder="500"
              required
            />
          </div>

          {/* Delivery Time */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
              <Clock size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Delivery (Days)
            </label>
            <input
              name="deliveryTime"
              type="number"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 text-sm text-white"
              placeholder="1"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-cyan-400 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-[24px] text-black font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs mt-6 sm:mt-8 md:mt-12 hover:bg-white hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Updating...' : 'Update Gig'}
        </button>
      </form>
    </div>
  );
};

export default EditGig;
