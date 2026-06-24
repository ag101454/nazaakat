import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, ArrowRight, Truck, Shield, CreditCard, Banknote, Building2, Copy, CheckCircle } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { createOrder } from '../../services/orderService';

function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

      const orderId = await createOrder(orderData);

      // WhatsApp message
      let message = `🛍️ *New Order - NAZAKKAT*%0A%0A`;
      message += `👤 *Customer:* ${form.name}%0A`;
      message += `📱 *Phone:* ${form.phone}%0A`;
      message += `📍 *Address:* ${form.address}, ${form.city}%0A%0A`;
      message += `📦 *Order:*%0A`;
      items.forEach((item, i) => {
        message += `${i + 1}. ${item.title} x${item.quantity} - PKR ${(item.price * item.quantity).toLocaleString()}%0A`;
      });
      message += `%0A💰 *Total:* PKR ${grandTotal.toLocaleString()}%0A`;
      message += `💳 *Payment:* ${form.payment === 'cod' ? 'Cash on Delivery' : form.payment === 'bank' ? 'Bank Transfer' : form.payment === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}%0A`;
      message += `%0A🆔 *Order ID:* ${orderId.slice(0, 8)}`;

      window.open(`https://wa.me/923001234567?text=${message}`, '_blank');
      
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-3xl font-serif text-gray-400 mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-gold-500 hover:text-gold-600">Continue Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-serif text-black">Checkout</h1>
          <div className="flex justify-center gap-4 mt-4">
            {['Shipping', 'Payment', 'Confirmation'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step > i ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-gold-500 text-white' : 'bg-gray-200'}`}>
                  {step > i ? '✓' : i + 1}
                </div>
                <span className="text-sm text-gray-500">{s}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                  <Truck className="text-gold-500" size={20} /> Shipping Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required type="tel"
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} type="tel"
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                    <input name="email" value={form.email} onChange={handleChange} type="email"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea name="address" value={form.address} onChange={handleChange} required rows={2}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <select name="city" value={form.city} onChange={handleChange} required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none">
                      <option value="">Select City</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                  <CreditCard className="text-gold-500" size={20} /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive your order' },
                    { value: 'bank', label: 'Bank Transfer', icon: Building2, desc: 'Transfer to our bank account' },
                    { value: 'easypaisa', label: 'EasyPaisa', icon: CreditCard, desc: 'Send via EasyPaisa' },
                    { value: 'jazzcash', label: 'JazzCash', icon: CreditCard, desc: 'Send via JazzCash' },
                  ].map((method) => (
                    <label key={method.value} className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form.payment === method.value ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gold-300'
                    }`}>
                      <input type="radio" name="payment" value={method.value} checked={form.payment === method.value} onChange={handleChange} />
                      <div>
                        <div className="flex items-center gap-2">
                          <method.icon size={18} className="text-gold-500" />
                          <p className="font-medium">{method.label}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Bank Details */}
                {form.payment === 'bank' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <p className="font-medium text-blue-800 mb-2">Bank Account Details</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Meezan Bank</span>
                        <button onClick={() => copyToClipboard('1234567890123456', 'bank')} className="text-blue-600">
                          {copied === 'bank' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <p className="font-mono">Account: 1234567890123456</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Notes */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none" />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-green-600 text-white rounded-full text-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                <MessageCircle size={20} />
                Place Order via WhatsApp
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                <ShoppingBag className="text-gold-500" size={20} /> Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gold-500 font-medium">PKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-gold-500">PKR {grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2"><Truck size={14} className="text-gold-500" /> Free shipping over PKR 5,000</div>
                <div className="flex items-center gap-2"><Shield size={14} className="text-green-500" /> Secure ordering via WhatsApp</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;