import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, X, Plus, Loader2, CheckCircle, Image } from 'lucide-react';
import { createProduct } from '../../services/productService';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageUrls, setImageUrls] = useState(['']);
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

  const addImageField = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageField = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
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
      setError('Please enter valid stock');
      return;
    }

    const validImages = imageUrls.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      setError('Please add at least one image URL');
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
        images: validImages,
      };

      await createProduct(productData);

      setSuccess(true);
      setForm({
        title: '', description: '', price: '', originalPrice: '',
        category: 'bags', stock: '', featured: false, sizes: '',
      });
      setImageUrls(['']);

      setTimeout(() => {
        setSuccess(false);
        navigate('/admin/products');
      }, 1500);

    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 hover:text-gold-500 mb-6">
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif text-black">Add New Product</h1>
        {success && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
            <CheckCircle size={16} /> Product Added!
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
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-serif mb-6">Product Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g., Elegant Leather Bag"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="Describe your product..."
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required
                  placeholder="5000"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange}
                  placeholder="7500"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required
                  placeholder="10"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                  <option value="bags">Bags</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                <input name="sizes" value={form.sizes} onChange={handleChange}
                  placeholder="Small, Medium, Large"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
              </div>
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                className="w-5 h-5 rounded text-gold-500" />
              <span className="text-sm">Featured product (shown on homepage)</span>
            </label>
          </div>
        </div>

        {/* Image URLs */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif">Product Images *</h2>
            <button type="button" onClick={addImageField}
              className="flex items-center gap-1 text-gold-500 text-sm hover:text-gold-600">
              <Plus size={16} /> Add Image
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Paste image URLs from any image hosting site (Imgur, ImgBB, PostImages, etc.)
          </p>

          <div className="space-y-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-1 relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImageUrl(i, e.target.value)}
                    placeholder="https://i.imgur.com/example.jpg"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                  />
                </div>
                {url && (
                  <img src={url} alt="" className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => removeImageField(i)}
                    className="text-red-400 hover:text-red-500">
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">How to get image URLs:</p>
            <ol className="text-xs text-blue-600 space-y-1">
              <li>1. Go to <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline">imgbb.com</a> (free)</li>
              <li>2. Upload your product image</li>
              <li>3. Copy the "Direct Link" URL</li>
              <li>4. Paste it here</li>
            </ol>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 bg-gold-500 text-white rounded-full text-lg font-medium hover:bg-gold-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : (
            <><Save size={20} /> Save Product</>
          )}
        </button>
      </form>
    </motion.div>
  );
}