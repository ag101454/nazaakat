import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
          className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif text-black mb-2">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-500 mb-4">Thank you for shopping at NAZAKKAT</p>
          
          {orderId && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono text-lg font-semibold text-gold-500">#{orderId.slice(0, 8)}</p>
            </div>
          )}

          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <MessageCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="font-medium text-green-800 mb-2">Check your WhatsApp!</p>
            <p className="text-sm text-green-600">We've sent your order confirmation via WhatsApp</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/track-order" className="px-6 py-3 border-2 border-gold-500 text-gold-500 rounded-full hover:bg-gold-500 hover:text-white transition-all">
              Track Order
            </Link>
            <Link to="/products" className="px-6 py-3 bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-all">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderConfirmation;