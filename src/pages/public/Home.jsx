import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle, ShoppingBag, Star, Truck, Shield, Award } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { getProducts } from '../../services/productService';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    console.log('Home - Products loaded:', data.length);
    setProducts(data);
    setLoading(false);
  };

  const featuredProducts = products.filter(p => p.featured === true).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return 'https://via.placeholder.com/500x625/F5E6D3/D4940D?text=NAZAKKAT';
  };

  const categories = [
    { name: 'Luxury Bags', count: 'Shop Now', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkF39wWJU0sJfFcLWnHjZXmHB-Db-xev6jirZoKGV3ecdra91gAAgR8b49&s=10', path: '/products?category=bags' },
    { name: 'Fine Jewelry', count: 'Shop Now', image: 'https://img.magnific.com/free-photo/display-shiny-elegant-gold-chain_23-2149635331.jpg?semt=ais_hybrid&w=740&q=80', path: '/products?category=jewelry' },
    { name: 'Accessories', count: 'Shop Now', image: 'https://img.magnific.com/premium-photo/fashion-women-stylish-accessories-outfit-glamour-set-flat-lay-beige-pastel-vertical-background-table-with-copy-mock-up-space-female-clothing-shopping-sale-concept-top-view-overhead-close-up_203461-746.jpg?semt=ais_hybrid&w=740&q=80', path: '/products?category=accessories' },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen bg-black flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500 rounded-full blur-[120px]" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500 rounded-full blur-[100px]" />
        </div>

        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full">
                <Sparkles size={16} className="text-gold-500" />
                <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-medium">Luxury Pakistani Fashion</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl text-white font-serif leading-[1.1]">
                Elegance in <span className="text-gold-500 italic">Every</span> Detail
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg md:text-xl max-w-lg">
                Discover handcrafted bags, accessories, and jewelry that celebrate the modern woman's elegance.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4">
                <Link to="/products">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2 text-base">
                    Explore Collection <ArrowRight size={20} />
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-outline">Our Story</motion.button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.pexels.com/photos/29043373/pexels-photo-29043373.jpeg?cs=srgb&dl=pexels-vedat-29043373.jpg&fm=jpg" alt="NAZAKKAT" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">Curated Selection</span>
              <h2 className="section-title mt-4 text-black">Our Collections</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={i * 0.2}>
                <Link to={cat.path} className="group block">
                  <motion.div whileHover={{ y: -8 }} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <p className="text-gold-400 text-xs tracking-wider uppercase">{cat.count}</p>
                      <h3 className="text-3xl text-white font-serif">{cat.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">New Arrivals</span>
              <h2 className="section-title mt-4 text-black">Featured Pieces</h2>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="text-center py-10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}
                className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Products coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.1}>
                  <Link to={`/product/${product.id}`} className="group block">
                    <motion.div whileHover={{ y: -5 }} className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-gray-100 shadow-md">
                      <img src={getProductImage(product)} alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/500x625/F5E6D3/D4940D?text=NAZAKKAT'; }} />
                      <motion.button whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-gold-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                        <ShoppingBag size={20} />
                      </motion.button>
                      {product.originalPrice && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full">Sale</span>
                      )}
                    </motion.div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-gold-500 fill-gold-500" />)}
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
                </ScrollReveal>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <motion.button whileHover={{ scale: 1.03 }} className="btn-secondary">View All Products <ArrowRight size={18} className="inline ml-2" /></motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="section-padding bg-black text-white text-center">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
              <MessageCircle size={40} className="text-white" />
            </motion.div>
            <h2 className="section-title mb-4">Order via WhatsApp</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">Chat with us for personalized assistance</p>
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-green-600 text-white rounded-full text-lg font-medium hover:bg-green-700 inline-flex items-center gap-3">
                <MessageCircle size={22} /> Chat on WhatsApp
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}