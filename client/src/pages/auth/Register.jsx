import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-3 sm:px-4 md:px-6 pt-16 sm:pt-20 md:pt-20">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-purple-500/5 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-5 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
            <UserPlus className="text-white sm:w-6 sm:h-6 md:w-[28px] md:h-[28px]" size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
            Join <span className="text-cyan-400">Campus</span>
          </h2>
          <p className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 sm:mt-2 text-center">
            Student Freelance Network
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Username */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 ml-2 sm:ml-3 md:ml-4">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                required
                className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 ml-2 sm:ml-3 md:ml-4">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                required
                className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 ml-2 sm:ml-3 md:ml-4">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength="6"
                className="w-full bg-white/5 border border-white/5 rounded-lg sm:rounded-xl md:rounded-2xl py-2.5 sm:py-3 md:py-4 pl-10 sm:pl-11 md:pl-14 pr-3 sm:pr-4 md:pr-6 outline-none focus:border-cyan-400/50 transition-all text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 md:py-5 bg-cyan-400 text-black font-black uppercase tracking-tighter md:tracking-widest text-[8px] sm:text-[9px] md:text-xs rounded-lg sm:rounded-xl md:rounded-2xl hover:shadow-[0_10px_30px_rgba(34,211,238,0.3)] transition-all active:scale-95 mt-2 sm:mt-3 md:mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 sm:mt-7 md:mt-8 text-gray-500 text-[8px] sm:text-[9px] md:text-xs font-medium">
          Already a member?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline font-bold">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
