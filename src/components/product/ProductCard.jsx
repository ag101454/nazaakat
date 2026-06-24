// src/components/product/ProductCard.jsx
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-ivory-100 rounded-lg">
          <motion.img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.45, 0.45, 0.95] }}
          />

          {/* Gold Overlay on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-brand-gold-500/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Quick Actions */}
          <motion.div
            className="absolute bottom-4 right-4 flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                backdrop-blur-sm transition-colors duration-300
                ${isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:text-red-500'}
              `}
            >
              <Heart 
                className="w-5 h-5" 
                fill={isWishlisted ? 'currentColor' : 'none'} 
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center
                       bg-brand-gold-500 text-white hover:bg-brand-gold-600
                       transition-colors duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-brand-gold-500 text-brand-gold-500" />
            <span className="text-sm text-gray-600">4.9</span>
          </div>
          
          <h3 className="font-serif text-lg text-brand-black-rich group-hover:text-brand-gold-500 
                       transition-colors duration-300">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-500 line-clamp-1">
            {product.description}
          </p>
          
          <p className="font-sans font-semibold text-brand-black-rich">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}