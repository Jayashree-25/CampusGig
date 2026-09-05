import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowRight, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../lib/apiClient';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: ArrowRight },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
};

const Orders = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('buyer');
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBuyerOrders = useCallback(async () => {
    try {
      const res = await apiClient.get('/orders');
      setBuyerOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders');
    }
  }, []);

  const fetchSellerOrders = useCallback(async () => {
    try {
      const res = await apiClient.get('/orders/seller');
      setSellerOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders');
    }
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      await Promise.all([fetchBuyerOrders(), fetchSellerOrders()]);
      setLoading(false);
    };
    loadOrders();
  }, [fetchBuyerOrders, fetchSellerOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setSellerOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const renderStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${config.color} ${config.bg} ${config.border}`}>
        <Icon size={10} /> {config.label}
      </span>
    );
  };

  const renderBuyerOrders = () => {
    if (buyerOrders.length === 0) {
      return (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">You haven't placed any orders yet</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5">
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <th className="p-6">Service</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Seller ID</th>
              <th className="p-6">Date</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {buyerOrders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                <td className="p-6">{order.gig_title}</td>
                <td className="p-6 font-bold">₹{order.amount}</td>
                <td className="p-6 text-gray-400">#{order.freelancer_id}</td>
                <td className="p-6 text-gray-400 text-xs">{formatDate(order.created_at)}</td>
                <td className="p-6">{renderStatusBadge(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSellerOrders = () => {
    if (sellerOrders.length === 0) {
      return (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No orders for your gigs yet</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5">
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <th className="p-6">Service</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Buyer</th>
              <th className="p-6">Date</th>
              <th className="p-6">Status</th>
              <th className="p-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {sellerOrders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                <td className="p-6">{order.gig_title}</td>
                <td className="p-6 font-bold">₹{order.amount}</td>
                <td className="p-6 text-gray-400">{order.buyer_username}</td>
                <td className="p-6 text-gray-400 text-xs">{formatDate(order.created_at)}</td>
                <td className="p-6">{renderStatusBadge(order.status)}</td>
                <td className="p-6">
                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'in_progress')}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase rounded-lg hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-50"
                      >
                        {updatingId === order.id ? <Loader2 size={12} className="animate-spin" /> : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {order.status === 'in_progress' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase rounded-lg hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {updatingId === order.id ? <Loader2 size={12} className="animate-spin" /> : 'Complete'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {(order.status === 'completed' || order.status === 'cancelled') && (
                    <span className="text-gray-600 text-[10px] font-bold uppercase">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] pt-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-8">
          My <span className="text-cyan-400">Orders</span>
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'buyer'
                ? 'bg-cyan-400 text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'seller'
                ? 'bg-cyan-400 text-black'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            Incoming Orders
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-2xl"
        >
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === 'buyer' ? (
            renderBuyerOrders()
          ) : (
            renderSellerOrders()
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;
