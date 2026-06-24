import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, CheckCircle, XCircle, MessageCircle, ShoppingBag, Bot, Shield, AlertTriangle, Zap } from 'lucide-react';
import { getAllOrders, updateOrderStatus, getOrderAnalytics } from '../../services/orderService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ordersData, analyticsData] = await Promise.all([
      getAllOrders(),
      getOrderAnalytics()
    ]);
    setOrders(ordersData);
    setAnalytics(analyticsData);
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    loadData(); // Refresh analytics
  };

  const filtered = orders.filter(o => {
    const matchesSearch = o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerInfo?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Send WhatsApp to customer
  const sendWhatsApp = (order) => {
    if (order.confirmationMessage) {
      const phone = order.customerInfo?.phone?.replace(/^0/, '92');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(order.confirmationMessage)}`, '_blank');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* AI Agent Status */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200 flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <p className="font-medium text-purple-800">AI Agent Active</p>
          <p className="text-sm text-purple-600">
            Auto-accepting low-risk orders • {analytics?.autoAccepted || 0} orders auto-processed
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-green-600 font-medium">Online</span>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Today', value: analytics.todayOrders, icon: Zap, color: 'bg-yellow-500' },
            { label: 'Pending', value: analytics.pending, icon: AlertTriangle, color: 'bg-orange-500' },
            { label: 'Accepted', value: analytics.accepted, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Revenue', value: `PKR ${analytics.revenue.toLocaleString()}`, icon: ShoppingBag, color: 'bg-blue-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className={`p-2 ${stat.color} rounded-lg w-fit mb-2`}>
                <stat.icon size={16} className="text-white" />
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search orders..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
          </div>
          {['all', 'pending', 'accepted', 'rejected'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                filter === f ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-4 text-sm text-gray-500">Order ID</th>
                  <th className="p-4 text-sm text-gray-500">Customer</th>
                  <th className="p-4 text-sm text-gray-500">Total</th>
                  <th className="p-4 text-sm text-gray-500">Risk</th>
                  <th className="p-4 text-sm text-gray-500">Status</th>
                  <th className="p-4 text-sm text-gray-500">AI</th>
                  <th className="p-4 text-sm text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">#{order.id?.slice(0, 8)}</td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{order.customerInfo?.name}</p>
                      <p className="text-xs text-gray-500">{order.customerInfo?.phone}</p>
                    </td>
                    <td className="p-4 text-sm font-medium">PKR {order.totalPrice?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.aiAnalysis?.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                        order.aiAnalysis?.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.aiAnalysis?.riskLevel || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.autoAccepted && (
                        <span className="flex items-center gap-1 text-xs text-purple-600">
                          <Bot size={12} /> Auto
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatus(order.id, 'accepted')}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => handleStatus(order.id, 'rejected')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button onClick={() => sendWhatsApp(order)}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                          <MessageCircle size={16} />
                        </button>
                        <button onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif">Order #{selectedOrder.id?.slice(0, 8)}</h3>
                <button onClick={() => setSelectedOrder(null)}><X size={20} /></button>
              </div>

              {/* AI Analysis */}
              {selectedOrder.aiAnalysis && (
                <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={18} className="text-purple-600" />
                    <span className="font-medium text-purple-800">AI Analysis</span>
                  </div>
                  <div className="space-y-1 text-sm text-purple-700">
                    <p>Risk Level: <strong className="uppercase">{selectedOrder.aiAnalysis.riskLevel}</strong></p>
                    <p>Action: {selectedOrder.aiAnalysis.recommendedAction}</p>
                    {selectedOrder.aiAnalysis.notes?.map((note, i) => (
                      <p key={i} className="text-xs">• {note}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="font-medium">{selectedOrder.customerInfo?.name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customerInfo?.phone}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customerInfo?.address}, {selectedOrder.customerInfo?.city}</p>
              </div>

              {/* Items */}
              <div className="mb-4">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span className="font-medium">PKR {(item.price * item.quantity)?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span className="text-gold-500">PKR {selectedOrder.totalPrice?.toLocaleString()}</span>
              </div>

              {/* Actions */}
              {selectedOrder.status === 'pending' && (
                <div className="flex gap-3 mb-3">
                  <button onClick={() => handleStatus(selectedOrder.id, 'accepted')}
                    className="flex-1 py-3 bg-green-500 text-white rounded-full font-medium">
                    Accept Order
                  </button>
                  <button onClick={() => handleStatus(selectedOrder.id, 'rejected')}
                    className="flex-1 py-3 bg-red-500 text-white rounded-full font-medium">
                    Reject Order
                  </button>
                </div>
              )}

              {/* WhatsApp */}
              <button onClick={() => sendWhatsApp(selectedOrder)}
                className="w-full py-3 bg-green-600 text-white rounded-full font-medium flex items-center justify-center gap-2">
                <MessageCircle size={18} /> Send WhatsApp Confirmation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}