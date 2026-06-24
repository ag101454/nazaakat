import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { getProducts } from '../../services/productService';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    console.log('Products page - Loaded:', data.length, 'products');
    data.forEach(p => console.log(`- ${p.title} (${p.category})`));
    setProducts(data);
    setLoading(false);
  };

  let filtered = category === 'all' 
    ? products 
    : products.filter(p => {
        const productCategory = (p.category || '').toLowerCase();
        return productCategory === category.toLowerCase();
      });

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return 'https://via.placeholder.com/500x625/F5E6D3/D4940D?text=NAZAKKAT';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black pt-24 pb-16">
        <div className="container-custom text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-gold-500 text-xs tracking-[0.3em] uppercase font-medium">
            Our Collection
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mt-4">
            {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4">
            {filtered.length} product(s) found
          </motion.p>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {['all', 'bags', 'jewelry', 'accessories'].map((cat) => (
                <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                    category === cat ? 'bg-gold-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {cat}
                </motion.button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full text-sm border border-gray-200 focus:ring-2 focus:ring-gold-500 outline-none">
              <option value="default">Featured</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}
                className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No products found in this category</p>
              <button onClick={() => setCategory('all')} className="text-gold-500 text-sm hover:text-gold-600">
                View all products →
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <motion.div key={product.id} layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group">
                    <Link to={`/product/${product.id}`}>
                      <motion.div whileHover={{ y: -5 }}
                        className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-gray-100 shadow-md">
                        <img src={getProductImage(product)} alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/500x625/F5E6D3/D4940D?text=NAZAKKAT'; }} />
                        {product.originalPrice && (
                          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                            Sale
                          </span>
                        )}
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
                          className="absolute bottom-4 right-4 w-12 h-12 bg-gold-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                          <ShoppingBag size={20} />
                        </motion.button>
                      </motion.div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, j) => <Star key={j} size={13} className="text-gold-500 fill-gold-500" />)}
                      </div>
                      <h3 className="font-serif text-lg group-hover:text-gold-500 transition-colors">{product.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{product.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-gold-500 font-bold text-lg">PKR {product.price?.toLocaleString()}</p>
                        {product.originalPrice && (
                          <p className="text-gray-400 line-through text-sm">PKR {product.originalPrice?.toLocaleString()}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}