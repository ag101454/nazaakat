import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, DollarSign, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0, accepted: 0, rejected: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [products, orders] = await Promise.all([getProducts(), getAllOrders()]);
    setStats({
      products: products.length,
      orders: orders.length,
      revenue: orders.reduce((sum, o) => o.status === 'accepted' ? sum + (o.totalPrice || 0) : sum, 0),
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
    });
    setRecentOrders(orders.slice(0, 5));
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    loadData();
  };

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
    { label: 'Revenue', value: `PKR ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif text-black mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your store overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} w-fit mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-black">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-green-700 font-bold text-2xl">{stats.accepted}</p>
            <p className="text-green-600 text-sm">Accepted Orders</p>
          </div>
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-red-700 font-bold text-2xl">{stats.rejected}</p>
            <p className="text-red-600 text-sm">Rejected Orders</p>
          </div>
          <XCircle className="w-10 h-10 text-red-500" />
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-serif mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 text-sm text-gray-500">Order ID</th>
                <th className="pb-3 text-sm text-gray-500">Customer</th>
                <th className="pb-3 text-sm text-gray-500">Total</th>
                <th className="pb-3 text-sm text-gray-500">Status</th>
                <th className="pb-3 text-sm text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-mono text-sm">#{order.id?.slice(0, 8)}</td>
                  <td className="py-3 text-sm">{order.customerInfo?.name || 'N/A'}</td>
                  <td className="py-3 text-sm font-medium">PKR {order.totalPrice?.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{order.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    {order.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatus(order.id, 'accepted')}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-medium">
                          Accept
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatus(order.id, 'rejected')}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium">
                          Reject
                        </motion.button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}