// src/pages/user/Dashboard.jsx
import { motion } from 'framer-motion';
import { Package, Heart, User, Settings, LogOut, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../../animations/pageTransitions';
import useAuthStore from '../../store/authStore';
import { getUserOrders } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-brand-black-rich">
              Welcome, {user?.name || 'Beautiful'}
            </h1>
            <p className="text-gray-500 mt-1">Manage your orders and profile</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                        ${activeTab === tab.id
                          ? 'bg-brand-gold-50 text-brand-gold-500'
                          : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 
                             hover:bg-red-50 hover:text-red-500 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl text-brand-black-rich">My Orders</h2>
                  
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No orders yet</p>
                      <Link to="/products" className="text-brand-gold-500 hover:text-brand-gold-600">
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-mono text-sm">#{order.id.slice(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-semibold text-brand-gold-500">
                              {formatPrice(order.totalPrice)}
                            </p>
                          </div>
                          <div>
                            <span className={`
                              px-3 py-1 rounded-full text-xs font-medium
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'}
                            `}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {order.items?.map((item, i) => (
                            <img
                              key={i}
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="font-serif text-2xl text-brand-black-rich mb-6">My Wishlist</h2>
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-serif text-2xl text-brand-black-rich mb-6">Profile Settings</h2>
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Name</label>
                        <p className="text-lg">{user?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Email</label>
                        <p className="text-lg">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}