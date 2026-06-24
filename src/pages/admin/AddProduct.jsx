import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, X, Upload, Loader2, CheckCircle } from 'lucide-react';
import { createProduct } from '../../services/productService';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'bags',
    stock: '',
    featured: false,
    sizes: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Validate file types
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size: 10MB`);
        return;
      }
    }

    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.title || !form.price || !form.stock) {
      setError('Please fill in all required fields (Title, Price, Stock)');
      return;
    }

    if (imageFiles.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        category: form.category,
        stock: parseInt(form.stock),
        featured: form.featured,
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [],
      };

      await createProduct(productData, imageFiles);
      
      setSuccess(true);
      
      // Reset form
      setForm({
        title: '', description: '', price: '', originalPrice: '',
        category: 'bags', stock: '', featured: false, sizes: '',
      });
      setImageFiles([]);
      setImagePreviews([]);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
      <button onClick={() => navigate('/admin/products')} 
        className="flex items-center gap-2 text-gray-500 hover:text-gold-500 mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif text-black">Add New Product</h1>
        {success && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
            <CheckCircle size={18} /> Product Added!
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-serif mb-6">Product Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required
                placeholder="Elegant Leather Bag"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="Describe your product..."
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none transition-all" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required
                  placeholder="5000"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange}
                  placeholder="7500"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required
                  placeholder="10"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all">
                  <option value="bags">Bags</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                <input name="sizes" value={form.sizes} onChange={handleChange}
                  placeholder="Small, Medium, Large"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition-all" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm text-gray-700">Mark as featured product</span>
            </label>
          </div>
        </motion.div>

        {/* Image Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-serif mb-2">Product Images *</h2>
          <p className="text-sm text-gray-500 mb-6">Upload images from your device. They will be stored permanently.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagePreviews.map((preview, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden group border-2 border-gray-100">
                <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                <motion.button whileHover={{ scale: 1.1 }} type="button" onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </motion.button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 bg-gold-500 text-white text-xs px-2 py-1 rounded-full">Main</span>
                )}
              </motion.div>
            ))}
            
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors bg-gray-50">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 text-center px-2">Click to Upload</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</span>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            </label>
          </div>
          {imageFiles.length > 0 && (
            <p className="text-xs text-gray-400">{imageFiles.length} image(s) selected</p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gold-500 text-white rounded-full text-lg font-medium hover:bg-gold-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing images & saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Product
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}