// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, MessageCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../../store/cartStore';
import CartDrawer from '../cart/CartDrawer';

// Custom SVG Social Icons
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Bags', path: '/products?category=bags' },
    { label: 'Jewelry', path: '/products?category=jewelry' },
    { label: 'Accessories', path: '/products?category=accessories' },
    { label: 'Visual Search', path: '/visual-search', icon: Camera },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-black'
        }`}
      >
        {/* Top Bar - Social Icons (Desktop) */}
        <div className="hidden md:block border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-end gap-4 py-1.5">
              <a href="https://www.instagram.com/nazaakatofficial1?igsh=MXdyMGhmeGJ3Ymh4cQ==" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-pink-400 transition-colors" title="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://www.facebook.com/share/193Su8v3qo/" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-blue-400 transition-colors" title="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://tiktok.com/@nazaakat" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors" title="TikTok">
                <TikTokIcon />
              </a>
              <span className="text-gray-600 text-xs mx-1">|</span>
              <a href="tel:+923407146871" className="text-gray-400 hover:text-gold-500 text-xs transition-colors">
                +92 340 7146871
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.h1 
                whileHover={{ scale: 1.02 }}
                className="text-xl md:text-2xl text-white font-serif tracking-wider"
              >
                NAZAAKAT
              </motion.h1>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="relative text-gray-300 hover:text-gold-500 transition-colors text-sm group py-1 flex items-center gap-1.5"
                >
                  {link.icon && <link.icon size={14} className="text-gray-300 group-hover:text-gold-500 transition-colors" />}
                  {link.label}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-300"
                    layoutId="underline"
                  />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Visual Search - Mobile Icon */}
              <Link to="/visual-search" className="md:hidden text-gray-300 hover:text-gold-500 transition-colors" title="Visual Search">
                <Camera size={20} />
              </Link>

              {/* WhatsApp CTA - Desktop */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/923407146871"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
              >
                <MessageCircle size={14} />
                WhatsApp
              </motion.a>

              {/* Wishlist */}
              <Link to="/products" className="text-gray-300 hover:text-gold-500 transition-colors">
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart} 
                className="text-gray-300 hover:text-gold-500 transition-colors relative"
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-medium"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-gray-300 hover:text-gold-500 transition-colors"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu with Smooth Animation */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden border-t border-gray-800"
              >
                {/* Navigation Links */}
                <div className="py-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 py-3 px-2 text-gray-300 hover:text-gold-500 text-base transition-colors"
                      >
                        {link.icon && <link.icon size={16} className="text-gray-300" />}
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* WhatsApp Mobile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <a
                    href="https://wa.me/923407146871"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-3 px-2 text-green-400 text-base"
                  >
                    <MessageCircle size={18} />
                    Order via WhatsApp
                  </a>
                </motion.div>

                {/* Mobile Social Links */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-5 py-4 px-2 border-t border-gray-800 mt-2"
                >
                  <a href="https://www.instagram.com/nazaakatofficial1?igsh=MXdyMGhmeGJ3Ymh4cQ==" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-400 hover:text-pink-400 transition-colors" title="Instagram">
                    <InstagramIcon />
                  </a>
                  <a href="https://www.facebook.com/share/193Su8v3qo/" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-400 hover:text-blue-400 transition-colors" title="Facebook">
                    <FacebookIcon />
                  </a>
                  <a href="https://tiktok.com/@nazaakat" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-400 hover:text-white transition-colors" title="TikTok">
                    <TikTokIcon />
                  </a>
                  <span className="text-gray-600 text-sm">|</span>
                  <a href="tel:+923407146871" className="text-gray-400 hover:text-gold-500 text-sm transition-colors">
                    +92 340 7146871
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <CartDrawer />
    </>
  );
}

export default Navbar;