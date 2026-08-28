import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { Clock, Tag, IndianRupee, Image as ImageIcon, Type, AlignLeft, UploadCloud } from 'lucide-react';

function AddGig() {
  // Removed cover_image from formData as we handle it with a separate 'file' state
  const [formData, setFormData] = useState({
    title: '', category: 'Tech', price: '', desc: '', deliveryTime: ''
  });
  const [file, setFile] = useState(null); // New state for the file
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // New function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Create FormData object
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("description", formData.desc); // Backend expects 'description'
    data.append("deliveryTime", formData.deliveryTime);
    
    // 2. Append the file if it exists
    if (file) {
      data.append("coverImage", file); // Key must match backend: upload.single("coverImage")
    }

    try {
      // 3. Send with multipart/form-data header (JWT auto-attached by apiClient interceptor)
      await apiClient.post('/gigs', data, { 
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
      alert('Service Published! 🚀');
      navigate('/gigs');
    } catch (err) {
      console.error(err);
      alert('Login required or error posting gig');
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-16 md:py-32 px-3 sm:px-4 md:px-6 flex justify-center items-start bg-[#030712] text-white">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full bg-white/[0.02] p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[48px] border border-white/10 backdrop-blur-3xl shadow-2xl">
        
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 italic tracking-tighter uppercase">Create Your <span className="text-white">Gig</span></h1>
          <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase mt-2">Monetize your campus skills</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Service Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
              <Type size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Title
            </label>
            <input 
              name="title" 
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 transition-all text-sm" 
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
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 appearance-none text-gray-400 text-sm"
            >
              <option value="Tech">Tech / Coding</option>
              <option value="Design">Graphic Design</option>
              <option value="Writing">Assignments</option>
            </select>
          </div>
        </div>

        {/* NEW: Cover Image Upload Field */}
        <div className="mt-4 sm:mt-6 md:mt-8 space-y-1.5 sm:space-y-2">
           <label className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest text-gray-400 ml-1 sm:ml-2">
              <ImageIcon size={12} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px] text-cyan-400" /> Cover Image
           </label>
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
                   <span className="text-xs uppercase tracking-widest font-bold">Click to Upload Cover</span>
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
            onChange={handleChange}
            rows="3" 
            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-5 outline-none focus:border-cyan-400 transition-all text-sm" 
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
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 text-sm" 
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
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 outline-none focus:border-cyan-400 text-sm" 
              placeholder="1" 
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-cyan-400 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-[24px] text-black font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs mt-6 sm:mt-8 md:mt-12 hover:bg-white hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all active:scale-95"
        >
          Publish My Service
        </button>
      </form>
    </div>
  );
}

export default AddGig;