import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, Camera, Search, Sparkles, ArrowRight, X, Image, Loader2, ShoppingBag, Star, AlertCircle } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { findSimilarProducts } from '../../services/visualSearchService';
import ScrollReveal from '../../components/animations/ScrollReveal';
import useCartStore from '../../store/cartStore';

export default function VisualSearch() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const products = await getProducts();
    setAllProducts(products);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large. Please use an image under 10MB');
      return;
    }

    setError('');
    setImage(file);
    setResults([]);
    setSearched(false);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    if (!image) return;
    if (allProducts.length === 0) {
      setError('No products available in store. Please add products first.');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const similarProducts = await findSimilarProducts(image, allProducts);
      setResults(similarProducts);
      
      if (similarProducts.length === 0) {
        setError('no_match');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('search_failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setResults([]);
    setError('');
    setSearched(false);
  };

  // Product not found - realistic message
  const showNoResults = searched && !loading && results.length === 0 && error === 'no_match';

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[40vh] bg-gradient-to-br from-purple-900 via-black to-black flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative z-10 py-16 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs tracking-[0.2em] uppercase">
            <Sparkles size={14} /> AI Powered
          </motion.span>
          <h1 className="text-4xl md:text-6xl text-white font-serif mt-6 mb-4">Visual Search</h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Upload a photo and our AI will find similar products from our collection
          </p>
        </div>
      </section>

      {/* Search Area */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
          >
            {!preview ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-500 transition-colors">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Product Photo</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Upload a photo of any bag, jewelry, or accessory
                  </p>
                  <span className="px-6 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium inline-flex items-center gap-2">
                    <Upload size={16} /> Choose Image
                  </span>
                  <p className="text-xs text-gray-400 mt-3">JPG, PNG, or WebP • Max 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Your Image</h3>
                  <button onClick={handleClear} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-6">
                  <img src={preview} alt="Uploaded" className="w-full h-full object-contain" />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-lg shadow-purple-500/25"
                >
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> AI Analyzing Image...</>
                  ) : (
                    <><Search size={20} /> Find Similar Products</>
                  )}
                </button>
              </div>
            )}

            {error && error !== 'no_match' && error !== 'search_failed' && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-500 text-sm text-center">{error}</motion.p>
            )}
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600 font-medium">AI is analyzing your image...</p>
              <p className="text-gray-400 text-sm mt-1">Detecting style, colors, and product type</p>
            </div>
          )}

          {/* NO PRODUCTS FOUND - REALISTIC MESSAGE */}
          {showNoResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-orange-500" />
              </div>
              <h2 className="text-2xl font-serif text-black mb-3">No Matching Products Found</h2>
              <p className="text-gray-500 mb-2">
                Our AI analyzed your image but couldn't find a close match in our current collection.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                This could be because the product in your photo is different from what we currently offer.
              </p>
              
              <div className="bg-ivory-50 rounded-2xl p-6 max-w-md mx-auto mb-8">
                <h3 className="font-medium text-black mb-3">What you can do:</h3>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    Try uploading a clearer or different angle photo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    Browse our collections manually
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    Send the photo to us on WhatsApp for personalized help
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-0.5">•</span>
                    We may have similar items not yet listed
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/products" className="px-6 py-3 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600 transition-colors">
                  Browse All Products
                </Link>
                <a 
                  href="https://wa.me/923407146871?text=Hi!%20I%20uploaded%20a%20photo%20for%20visual%20search%20but%20no%20match%20was%20found.%20Can%20you%20help%20me%20find%20this%20product%3F" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Ask on WhatsApp
                </a>
                <button onClick={handleClear} className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-medium hover:border-purple-300 transition-colors">
                  Try Another Photo
                </button>
              </div>
            </motion.div>
          )}

          {/* Search Failed */}
          {error === 'search_failed' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-12">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-serif text-black mb-3">Search Failed</h2>
              <p className="text-gray-500 mb-6">Something went wrong while analyzing your image.</p>
              <button onClick={handleClear} className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium">
                Try Again
              </button>
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm">
                    <Sparkles size={16} />
                    AI found {results.length} similar product{results.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <Link to={`/product/${product.id}`}>
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-md">
                          <img
                            src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x500'}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">
                              {Math.min(product.score * 20, 95)}% Match
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
                            className="absolute bottom-3 right-3 w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                          >
                            <ShoppingBag size={18} />
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1">
                          {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-gold-500 fill-gold-500" />)}
                        </div>
                        <h3 className="font-serif text-base group-hover:text-gold-500 transition-colors">{product.title}</h3>
                        <p className="text-xs text-purple-500 mb-1">{product.matchReason}</p>
                        <p className="text-gold-500 font-bold">PKR {product.price?.toLocaleString()}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Not what you're looking for? */}
                <div className="text-center mt-8 p-6 bg-gray-50 rounded-2xl">
                  <p className="text-gray-500 text-sm mb-3">Not what you're looking for?</p>
                  <button onClick={handleClear} className="text-purple-600 text-sm font-medium hover:text-purple-700">
                    Try Another Photo →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-ivory-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">How It Works</span>
              <h2 className="text-3xl font-serif mt-4 text-black">Find Products Instantly</h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: '1', title: 'Upload Photo', desc: 'Take a photo or screenshot of any product you like', icon: Camera },
              { step: '2', title: 'AI Analysis', desc: 'Our AI detects style, colors, and product type', icon: Sparkles },
              { step: '3', title: 'Get Matches', desc: 'See similar products or get help via WhatsApp', icon: Search },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.2}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon size={28} className="text-purple-500" />
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-medium text-black mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}