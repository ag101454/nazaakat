import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, ArrowRight, Truck, Shield, CreditCard, Banknote, Building2, Copy, CheckCircle, Smartphone } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { createOrder } from '../../services/orderService';

function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    payment: 'cod',
    notes: '',
  });

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 5000 ? 0 : 250;
  const grandTotal = totalPrice + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        customerInfo: {
          name: form.name,
          phone: form.phone,
          whatsapp: form.whatsapp || form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
        },
        items: items.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || item.image || '',
        })),
        totalPrice: grandTotal,
        shipping,
        paymentMethod: form.payment,
        notes: form.notes,
      };

      const result = await createOrder(orderData);
      const orderId = result.orderId || result;

      let message = `🛍️ *New Order - NAZAAKAT*%0A%0A`;
      message += `👤 *Customer:* ${form.name}%0A`;
      message += `📱 *Phone:* ${form.phone}%0A`;
      message += `📍 *Address:* ${form.address}, ${form.city}%0A%0A`;
      message += `📦 *Order Items:*%0A`;
      items.forEach((item, i) => {
        message += `${i + 1}. ${item.title} x${item.quantity} - PKR ${(item.price * item.quantity).toLocaleString()}%0A`;
      });
      message += `%0A💰 *Total:* PKR ${grandTotal.toLocaleString()}%0A`;
      message += `🚚 *Shipping:* ${shipping === 0 ? 'FREE' : 'PKR ' + shipping}%0A`;
      message += `💳 *Payment:* ${form.payment === 'cod' ? 'Cash on Delivery' : form.payment === 'bank' ? 'Bank Transfer' : form.payment === 'sadapay' ? 'SadaPay' : 'JazzCash'}%0A`;
      message += `%0A🆔 *Order ID:* ${typeof orderId === 'string' ? orderId.slice(0, 8) : 'PENDING'}%0A%0A`;
      message += `🙏 *Thank you for shopping!*`;

      window.open(`https://wa.me/923407146871?text=${message}`, '_blank');
      
      clearCart();
      navigate(`/order-confirmation/${typeof orderId === 'string' ? orderId : 'pending'}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 text-center min-h-screen flex items-center justify-center bg-gray-50">
        <div>
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-serif text-gray-400 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some beautiful items to get started</p>
          <Link to="/products">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gold-500 text-white rounded-full font-medium">
              Browse Collection
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gold-500 text-xs tracking-[0.3em] uppercase font-medium"
          >
            Complete Your Order
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-serif text-black mt-3">Checkout</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center">
                    <Truck className="text-gold-500" size={20} />
                  </div>
                  <h2 className="text-xl font-serif">Shipping Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required type="tel"
                        placeholder="03XX-XXXXXXX"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} type="tel"
                        placeholder="Same as phone if empty"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                    <input name="email" value={form.email} onChange={handleChange} type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
                    <textarea name="address" value={form.address} onChange={handleChange} required rows={2}
                      placeholder="House No, Street, Area"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <select name="city" value={form.city} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all bg-white">
                      <option value="">Select your city</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="text-gold-500" size={20} />
                  </div>
                  <h2 className="text-xl font-serif">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    form.payment === 'cod' ? 'border-gold-500 bg-gold-50 shadow-md' : 'border-gray-200 hover:border-gold-200'
                  }`}>
                    <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={handleChange}
                      className="mt-0.5 text-gold-500 focus:ring-gold-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote size={20} className="text-green-600" />
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Pay cash when your order arrives at your doorstep</p>
                    </div>
                  </label>

                  {/* SadaPay */}
                  <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    form.payment === 'sadapay' ? 'border-gold-500 bg-gold-50 shadow-md' : 'border-gray-200 hover:border-gold-200'
                  }`}>
                    <input type="radio" name="payment" value="sadapay" checked={form.payment === 'sadapay'} onChange={handleChange}
                      className="mt-0.5 text-gold-500 focus:ring-gold-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone size={20} className="text-purple-600" />
                        <p className="font-semibold text-gray-900">SadaPay</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Instant transfer via SadaPay mobile wallet</p>
                      
                      {form.payment === 'sadapay' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Smartphone size={18} className="text-purple-600" />
                              <p className="font-semibold text-purple-800">SadaPay Account Details</p>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-purple-700">Account Title:</span>
                                <span className="font-semibold text-purple-900">Abdul Ghani</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-purple-700">Phone Number:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-semibold text-purple-900">0340 7146871</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard('03407146871', 'sadapay')}
                                    className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors"
                                  >
                                    {copied === 'sadapay' ? (
                                      <CheckCircle size={16} className="text-green-500" />
                                    ) : (
                                      <Copy size={16} className="text-purple-500" />
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-purple-500 mt-3">
                              💡 Send payment to this SadaPay account and share screenshot on WhatsApp
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    form.payment === 'jazzcash' ? 'border-gold-500 bg-gold-50 shadow-md' : 'border-gray-200 hover:border-gold-200'
                  }`}>
                    <input type="radio" name="payment" value="jazzcash" checked={form.payment === 'jazzcash'} onChange={handleChange}
                      className="mt-0.5 text-gold-500 focus:ring-gold-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone size={20} className="text-red-600" />
                        <p className="font-semibold text-gray-900">JazzCash</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Instant transfer via JazzCash mobile wallet</p>
                      
                      {form.payment === 'jazzcash' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Smartphone size={18} className="text-red-600" />
                              <p className="font-semibold text-red-800">JazzCash Account Details</p>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-red-700">Account Title:</span>
                                <span className="font-semibold text-red-900">Abdul Ghani</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-red-700">Phone Number:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-semibold text-red-900">0340 7146871</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard('03407146871', 'jazzcash')}
                                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    {copied === 'jazzcash' ? (
                                      <CheckCircle size={16} className="text-green-500" />
                                    ) : (
                                      <Copy size={16} className="text-red-500" />
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-red-500 mt-3">
                              💡 Send payment to this JazzCash account and share screenshot on WhatsApp
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    form.payment === 'bank' ? 'border-gold-500 bg-gold-50 shadow-md' : 'border-gray-200 hover:border-gold-200'
                  }`}>
                    <input type="radio" name="payment" value="bank" checked={form.payment === 'bank'} onChange={handleChange}
                      className="mt-0.5 text-gold-500 focus:ring-gold-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 size={20} className="text-blue-600" />
                        <p className="font-semibold text-gray-900">Bank Transfer</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Transfer directly to our bank account</p>
                      
                      {form.payment === 'bank' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Building2 size={18} className="text-blue-600" />
                              <p className="font-semibold text-blue-800">Bank Account Details</p>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-700">Bank:</span>
                                <span className="font-semibold text-blue-900">Meezan Bank</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-700">Account Title:</span>
                                <span className="font-semibold text-blue-900">Abdul Ghani</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-700">Account Number:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-semibold text-blue-900">1234567890123456</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard('1234567890123456', 'bank')}
                                    className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                                  >
                                    {copied === 'bank' ? (
                                      <CheckCircle size={16} className="text-green-500" />
                                    ) : (
                                      <Copy size={16} className="text-blue-500" />
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-blue-500 mt-3">
                              💡 Transfer amount and share receipt screenshot on WhatsApp
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </label>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                  placeholder="Any special instructions for your order..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none transition-all" />
              </motion.div>

              {/* WhatsApp Info Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Your order will be confirmed via WhatsApp</p>
                  <p className="text-sm text-green-600">You'll receive order updates and delivery confirmation</p>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg font-semibold hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-3 shadow-xl shadow-green-500/25 transition-all">
                <MessageCircle size={22} />
                Place Order via WhatsApp
                <ArrowRight size={20} />
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24"
            >
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="text-gold-500" size={20} />
                <h2 className="text-xl font-serif">Order Summary</h2>
              </div>
              
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/50'} alt="" 
                      className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gold-500 font-semibold">PKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? '🎉 FREE' : `PKR ${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Free shipping on orders above PKR 5,000</p>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <motion.span 
                    key={grandTotal}
                    initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                    className="text-gold-500"
                  >
                    PKR {grandTotal.toLocaleString()}
                  </motion.span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Truck size={14} className="text-gold-500" />
                  Free shipping over PKR 5,000
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield size={14} className="text-green-500" />
                  Secure ordering via WhatsApp
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Smartphone size={14} className="text-purple-500" />
                  SadaPay & JazzCash accepted
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;