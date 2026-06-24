import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, CheckCircle, XCircle, MessageCircle, ShoppingBag } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
  };

  const filtered = orders.filter(o => {
    const matchesSearch = o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerInfo?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-black">Orders</h1>
          <p className="text-gray-500 mt-1">
            {orders.length} total · {pendingCount} pending
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by Order ID or Customer..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
          </div>
          {['all', 'pending', 'accepted', 'rejected'].map((f) => (
            <motion.button key={f} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-gold-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}
            className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full mx-auto" />
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
                  <th className="p-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Phone</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Payment</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="p-4 text-sm font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((order) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm">#{order.id?.slice(0, 8)}</td>
                    <td className="p-4 text-sm font-medium">{order.customerInfo?.name || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-500">{order.customerInfo?.phone || 'N/A'}</td>
                    <td className="p-4 text-sm font-medium">PKR {order.totalPrice?.toLocaleString()}</td>
                    <td className="p-4 text-sm capitalize">{order.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' && (
                          <>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatus(order.id, 'accepted')}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Accept">
                              <CheckCircle size={16} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatus(order.id, 'rejected')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Reject">
                              <XCircle size={16} />
                            </motion.button>
                          </>
                        )}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">
                          <Eye size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif">Order #{selectedOrder.id?.slice(0, 8)}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Customer Details</p>
                  <p className="font-medium">{selectedOrder.customerInfo?.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customerInfo?.phone}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customerInfo?.address}, {selectedOrder.customerInfo?.city}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Order Items</p>
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <img src={item.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">PKR {(item.price * item.quantity)?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-gold-500 text-lg">PKR {selectedOrder.totalPrice?.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusColors[selectedOrder.status] || ''}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {selectedOrder.status === 'pending' && (
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatus(selectedOrder.id, 'accepted')}
                      className="flex-1 py-3 bg-green-500 text-white rounded-full font-medium flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Accept Order
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatus(selectedOrder.id, 'rejected')}
                      className="flex-1 py-3 bg-red-500 text-white rounded-full font-medium flex items-center justify-center gap-2">
                      <XCircle size={18} /> Reject Order
                    </motion.button>
                  </div>
                )}

                {selectedOrder.customerInfo?.phone && (
                  <a href={`https://wa.me/92${selectedOrder.customerInfo.phone?.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-green-600 text-white rounded-full font-medium flex items-center justify-center gap-2">
                      <MessageCircle size={18} /> Contact Customer on WhatsApp
                    </motion.button>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}