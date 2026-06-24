// Free storage using browser LocalStorage
// Data persists even after page refresh

const PRODUCTS_KEY = 'nazaakat_products';
const ORDERS_KEY = 'nazaakat_orders';

// Save products
export const saveProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Get products
export const getProducts = () => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// Add single product
export const addProduct = (product) => {
  const products = getProducts();
  product.id = Date.now().toString();
  product.createdAt = new Date().toISOString();
  products.unshift(product);
  saveProducts(products);
  return product;
};

// Delete product
export const deleteProduct = (id) => {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  return true;
};

// Save orders
export const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
};

// Get orders
export const getOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// Add order
export const addOrder = (order) => {
  const orders = getOrders();
  order.id = 'NZK-' + Date.now().toString(36).toUpperCase();
  order.createdAt = new Date().toISOString();
  order.status = 'pending';
  orders.unshift(order);
  saveOrders(orders);
  return order;
};

// Update order status
export const updateOrderStatus = (id, status) => {
  const orders = getOrders();
  const updated = orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
  saveOrders(updated);
  return true;
};