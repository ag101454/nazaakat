import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, CheckCircle, XCircle, MessageCircle, ShoppingBag, AlertTriangle, Zap, Send } from 'lucide-react';
import { getAllOrders, updateOrderStatus, getOrderAnalytics } from '../../services/orderService';
import { handleOrderNotification } from '../../services/whatsappService';

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
  const [notifying, setNotifying] = useState(null);

  useEffect(() => { loadData(); }, []);

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

  const handleStatus = async (id, newStatus) => {
    setNotifying(id);
    
    try {
      // Update order status
      await updateOrderStatus(id, newStatus);
      
      // Get the order
      const order = orders.find(o => o.id === id);
      
      if (order && order.customerInfo?.phone) {
        // Send notification
        const sent = handleOrderNotification(order, newStatus);
        
        if (sent) {
          console.log('Notification sent successfully');
        } else {
          alert('Could not send WhatsApp message. Check customer phone number.');
        }
      } else {
        alert('No phone number found for this customer!');
      }
      
      // Refresh
      await loadData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing order. Please try again.');
    } finally {
      setNotifying(null);
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerInfo?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

      {/* Auto Notification Info */}
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex items-center gap-3">
        <Send size={18} className="text-green-600" />
        <p className="text-sm text-green-700">
          <strong>Auto-Notify:</strong> Accepting or rejecting an order automatically sends a WhatsApp message to the customer!
        </p>
      </div>

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
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
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
                  <th className="p-4 text-sm text-gray-500">Status</th>
                  <th className="p-4 text-sm text-gray-500">Date</th>
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatus(order.id, 'accepted')}
                              disabled={notifying === order.id}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 disabled:opacity-50"
                              title="Accept & Send WhatsApp Confirmation">
                              {notifying === order.id ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                            <button 
                              onClick={() => handleStatus(order.id, 'rejected')}
                              disabled={notifying === order.id}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                              title="Reject & Send WhatsApp Notification">
                              {notifying === order.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>
                          </>
                        )}
                        <button onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100"
                          title="View Details">
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

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">{selectedOrder.customerInfo?.name}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">📱 {selectedOrder.customerInfo?.phone}</p>
                <p className="text-sm text-gray-500">📍 {selectedOrder.customerInfo?.address}</p>
                <p className="text-sm text-gray-500">🏙️ {selectedOrder.customerInfo?.city}</p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Order Items</p>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span className="font-medium">PKR {(item.price * item.quantity)?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-lg mb-4 bg-gray-50 p-3 rounded-xl">
                <span>Total</span>
                <span className="text-gold-500">PKR {selectedOrder.totalPrice?.toLocaleString()}</span>
              </div>

              {/* Payment Info */}
              <div className="mb-4 text-sm text-gray-500">
                <p>Payment: <strong className="capitalize">{selectedOrder.paymentMethod}</strong></p>
                {selectedOrder.notes && <p className="mt-1">Notes: {selectedOrder.notes}</p>}
              </div>

              {/* Action Buttons */}
              {selectedOrder.status === 'pending' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-center">
                    ⚡ WhatsApp notification will be sent automatically!
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatus(selectedOrder.id, 'accepted')}
                      disabled={notifying === selectedOrder.id}
                      className="flex-1 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2">
                      {notifying === selectedOrder.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                      Accept & Notify
                    </button>
                    <button 
                      onClick={() => handleStatus(selectedOrder.id, 'rejected')}
                      disabled={notifying === selectedOrder.id}
                      className="flex-1 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
                      {notifying === selectedOrder.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <XCircle size={18} />
                      )}
                      Reject & Notify
                    </button>
                  </div>
                </div>
              )}

              {/* Already processed */}
              {selectedOrder.status !== 'pending' && (
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm text-gray-500">
                    This order has been <strong className="capitalize">{selectedOrder.status}</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Customer was notified via WhatsApp
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}