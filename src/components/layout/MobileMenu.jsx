// src/components/layout/MobileMenu.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, MessageCircle, ShoppingBag, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'Home', path: '/', icon: Home },
  { 
    label: 'Shop by Category', 
    children: [
      { label: '👜 Bags', path: '/products?category=bags' },
      { label: '💎 Jewelry', path: '/products?category=jewelry' },
      { label: '✨ Accessories', path: '/products?category=accessories' },
      { label: '🔥 New Arrivals', path: '/products?sort=newest' },
    ]
  },
  { label: 'All Products', path: '/products' },
  { label: 'About NAZAAKAT', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Track Order', path: '/track-order' },
];

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleMobileMenu', handleToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleToggle);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-80 bg-brand-black-rich z-50 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <h2 className="font-serif text-2xl text-white tracking-wider">NAZAAKAT</h2>
                <p className="text-brand-gold-500 text-xs tracking-[0.2em] mt-1">
                  Elegance in Every Detail
                </p>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setExpandedItem(
                            expandedItem === item.label ? null : item.label
                          )}
                          className="w-full flex items-center justify-between px-4 py-3 
                                   text-gray-300 hover:text-white hover:bg-white/5 
                                   rounded-xl transition-all duration-300"
                        >
                          <span className="text-base">{item.label}</span>
                          <motion.span
                            animate={{ rotate: expandedItem === item.label ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {expandedItem === item.label && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-4 space-y-1 mt-1"
                            >
                              {item.children.map((child) => (
                                <li key={child.label}>
                                  <Link
                                    to={child.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-gray-400 hover:text-brand-gold-500 
                                             hover:bg-white/5 rounded-lg transition-all duration-300 text-sm"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white 
                                 hover:bg-white/5 rounded-xl transition-all duration-300 text-base"
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-white/10 space-y-3">
              <a
                href="https://wa.me/923001234567?text=I'm%20interested%20in%20NAZAKKAT%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 
                         bg-green-500 hover:bg-green-600 text-white rounded-xl 
                         font-medium transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </a>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 
                         bg-brand-gold-500 hover:bg-brand-gold-600 text-white rounded-xl 
                         font-medium transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                View Cart
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;