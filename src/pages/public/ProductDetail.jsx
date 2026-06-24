import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { getProductById } from '../../services/productService';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const data = await getProductById(id);
    console.log('Product detail loaded:', data?.title);
    setProduct(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 text-center py-20">
        <h1 className="text-3xl font-serif text-gray-400 mb-4">Product Not Found</h1>
        <Link to="/products" className="text-gold-500 hover:text-gold-600">← Back to Products</Link>
      </div>
    );
  }

  const images = product.images || (product.image ? [product.image] : ['https://via.placeholder.com/600x800/F5E6D3/D4940D?text=NAZAKKAT']);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gold-500">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gold-500">Products</Link>
          <span>/</span>
          <span className="text-gold-500">{product.title}</span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              <img src={images[selectedImage]} alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800/F5E6D3/D4940D?text=NAZAKKAT'; }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-gold-500' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
            <div>
              <span className="text-gold-500 text-sm uppercase tracking-widest">{product.category}</span>
              <h1 className="text-4xl font-serif mt-2">{product.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-gold-500 fill-gold-500" />)}
              <span className="text-sm text-gray-500">(Reviews)</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-3xl text-gold-500 font-bold">PKR {product.price?.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-xl text-gray-400 line-through">PKR {product.originalPrice?.toLocaleString()}</p>
              )}
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full">−</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full">+</button>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-4 bg-gold-500 text-white rounded-full text-lg font-medium hover:bg-gold-600 disabled:bg-gray-300 flex items-center justify-center gap-2 shadow-lg">
              <ShoppingBag size={20} />
              {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </motion.button>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center"><Truck size={24} className="text-gold-500 mx-auto mb-2" /><p className="text-xs text-gray-500">Free Delivery</p></div>
              <div className="text-center"><Shield size={24} className="text-gold-500 mx-auto mb-2" /><p className="text-xs text-gray-500">Authentic</p></div>
              <div className="text-center"><RotateCcw size={24} className="text-gold-500 mx-auto mb-2" /><p className="text-xs text-gray-500">7-Day Returns</p></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}