import { getProducts } from '../services/productService';
import { getAllOrders } from '../services/orderService';

export const exportProducts = async () => {
  try {
    const products = await getProducts();
    const data = JSON.stringify(products, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nazaakat-products-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ Products exported');
  } catch (error) {
    console.error('Export error:', error);
  }
};

export const exportOrders = async () => {
  try {
    const orders = await getAllOrders();
    const data = JSON.stringify(orders, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nazaakat-orders-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ Orders exported');
  } catch (error) {
    console.error('Export error:', error);
  }
};