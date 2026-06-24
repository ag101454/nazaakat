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

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(file.name + ' is not an image file');
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

    if (!form.title.trim()) {
      setError('Please enter a product title');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    if (!form.stock || parseInt(form.stock) < 0) {
      setError('Please enter valid stock quantity');
      return;
    }
    if (imageFiles.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        category: form.category,
        stock: parseInt(form.stock),
        featured: form.featured,
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      await createProduct(productData, imageFiles);

      setSuccess(true);

      setForm({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'bags',
        stock: '',
        featured: false,
        sizes: '',
      });
      setImageFiles([]);
      setImagePreviews([]);

      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-gray-500 hover:text-gold-500 mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif text-black">Add New Product</h1>
        {success && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm"
          >
            <CheckCircle size={16} /> Product Added!
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-serif mb-6">Product Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g., Elegant Leather Bag"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your product..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR) *</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="5000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                <input
                  name="originalPrice"
                  type="number"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="7500"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="bags">Bags</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                <input
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="Small, Medium, Large"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-sm text-gray-700">Featured product (shown on homepage)</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-serif mb-2">Product Images *</h2>
          <p className="text-sm text-gray-500 mb-4">Upload clear product photos</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagePreviews.map((preview, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden group border-2 border-gray-100"
              >
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}

            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors bg-gray-50">
              <Upload className="w-8 h-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gold-500 text-white rounded-full text-lg font-medium hover:bg-gold-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving Product...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}