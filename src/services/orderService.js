import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'orders';
let isCreatingOrder = false;

// Create order
export const createOrder = async (orderData) => {
  if (isCreatingOrder) {
    throw new Error('Order is already being processed');
  }
  
  isCreatingOrder = true;
  
  try {
    // Check for duplicate within 10 seconds
    const allOrders = await getAllOrders();
    const duplicate = allOrders.find(o => {
      const timeDiff = Date.now() - new Date(o.createdAt).getTime();
      return timeDiff < 10000 &&
        o.customerInfo?.phone === orderData.customerInfo?.phone &&
        o.totalPrice === orderData.totalPrice;
    });
    
    if (duplicate) {
      return { orderId: duplicate.id, isDuplicate: true };
    }

    const docRef = await addDoc(collection(db, COLLECTION), {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return { orderId: docRef.id, isDuplicate: false };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  } finally {
    isCreatingOrder = false;
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION, id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      status,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
};

// Get order analytics
export const getOrderAnalytics = async () => {
  try {
    const orders = await getAllOrders();
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
      revenue: orders.filter(o => o.status === 'accepted').reduce((sum, o) => sum + (o.totalPrice || 0), 0),
      todayOrders: orders.filter(o => {
        return new Date(o.createdAt).toDateString() === new Date().toDateString();
      }).length,
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return { total: 0, pending: 0, accepted: 0, rejected: 0, revenue: 0, todayOrders: 0 };
  }
};