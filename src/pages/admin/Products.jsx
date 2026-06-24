import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-black">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products in store</p>
        </div>
        <Link to="/admin/products/add">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600 transition-colors shadow-lg shadow-gold-500/20"
          >
            <Plus size={18} />
            Add New Product
          </motion.button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}
            className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No products yet</p>
          <Link to="/admin/products/add">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-full font-medium hover:bg-gold-600 transition-colors"
            >
              <Plus size={18} />
              Add Your First Product
            </motion.button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="p-4 text-sm font-medium text-gray-500">Stock</th>
                  <th className="p-4 text-sm font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <AnimatePresence>
                  {filtered.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/40'}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{product.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-gold-50 text-gold-600 rounded-full text-xs capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium">PKR {product.price?.toLocaleString()}</td>
                      <td className="p-4 text-sm">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit2 size={16} className="text-gray-500" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} className="text-red-500" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}