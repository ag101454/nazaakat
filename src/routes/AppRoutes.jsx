import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/public/Home';
import Products from '../pages/public/Products';
import ProductDetail from '../pages/public/ProductDetail';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Checkout from '../pages/checkout/Checkout';
import OrderConfirmation from '../pages/checkout/OrderConfirmation';
import TrackOrder from '../pages/public/TrackOrder';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminAddProduct from '../pages/admin/AddProduct';
import AdminOrders from '../pages/admin/Orders';
import Blog from '../pages/public/Blog';
import BlogDetail from '../pages/public/BlogDetail';
import Reviews from '../pages/public/Reviews';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/reviews" element={<Reviews />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/track-order" element={<TrackOrder />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
}