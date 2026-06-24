// src/components/layout/SearchOverlay.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl">Search Products</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for bags, jewelry, accessories..."
                    className="w-full pl-12 pr-20 py-4 border border-gray-200 rounded-xl 
                             focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent 
                             outline-none text-lg transition-all duration-300"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 
                             bg-brand-gold-500 text-white rounded-lg hover:bg-brand-gold-600 
                             transition-colors text-sm font-medium"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['Bags', 'Jewelry', 'Accessories', 'New Arrivals', 'Sale'].map((link) => (
                  <button
                    key={link}
                    onClick={() => {
                      navigate(`/products?search=${link.toLowerCase()}`);
                      onClose();
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-brand-gold-50 hover:text-brand-gold-500 
                             rounded-full text-sm transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}