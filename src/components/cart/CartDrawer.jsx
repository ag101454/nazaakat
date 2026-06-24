import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import useCartStore from '../../store/cartStore';

function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full w-full md:max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -20 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ShoppingBag className="w-6 h-6 text-gold-500" />
                </motion.div>
                <h2 className="text-xl font-serif">
                  Your Cart
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-sm text-gray-500 font-normal"
                    >
                      ({totalItems})
                    </motion.span>
                  )}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                  </motion.div>
                  <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mb-6">Add some items to get started</p>
                  <Link to="/products" onClick={toggleCart}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 border-2 border-gold-500 text-gold-500 rounded-full font-medium hover:bg-gold-500 hover:text-white transition-all"
                    >
                      Browse Products
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow group"
                      >
                        {/* Product Image */}
                        <div className="relative">
                          <img
                            src={item.images?.[0] || item.image || 'https://via.placeholder.com/100'}
                            alt={item.title}
                            className="w-20 h-24 object-cover rounded-lg"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100/F5E6D3/D4940D?text=NAZAAKAT'; }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">
                            {item.title}
                          </h4>
                          <p className="text-gold-500 font-semibold text-sm mt-1">
                            PKR {item.price?.toLocaleString()}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors"
                            >
                              <Minus size={12} />
                            </motion.button>
                            
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="w-8 text-center text-sm font-medium"
                            >
                              {item.quantity}
                            </motion.span>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors"
                            >
                              <Plus size={12} />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              className="ml-auto p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="border-t p-6 bg-white"
              >
                {/* Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>PKR {totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t">
                    <span>Total</span>
                    <motion.span
                      key={totalPrice}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold text-gold-500"
                    >
                      PKR {totalPrice?.toLocaleString()}
                    </motion.span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" onClick={toggleCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gold-500 text-white rounded-full font-medium 
                             hover:bg-gold-600 transition-all flex items-center justify-center gap-2
                             shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
                  >
                    Proceed to Checkout
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </motion.button>
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={toggleCart}
                  className="w-full text-center text-sm text-gray-500 hover:text-gold-500 transition-colors mt-3"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;