import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { AIAgent } from './aiAgent';

const COLLECTION = 'orders';

// Create order with AI processing
export const createOrder = async (orderData) => {
  try {
    // Process through AI Agent
    const result = await AIAgent.processOrder(orderData);
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
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

// Update order status (Accept/Reject)
export const updateOrderStatus = async (id, status, notes = '') => {
  try {
    const timeline = [{
      status: status === 'accepted' ? 'Order Accepted' : 'Order Rejected',
      time: new Date().toISOString(),
      message: notes || `Order ${status} by admin`
    }];

    await updateDoc(doc(db, COLLECTION, id), {
      status,
      updatedAt: new Date().toISOString(),
      timeline
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
    
    const analytics = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
      autoAccepted: orders.filter(o => o.autoAccepted).length,
      revenue: orders
        .filter(o => o.status === 'accepted')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
      highRisk: orders.filter(o => o.aiAnalysis?.riskLevel === 'high').length,
      todayOrders: orders.filter(o => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today;
      }).length,
    };

    return analytics;
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
};