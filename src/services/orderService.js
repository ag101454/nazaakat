import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'orders';

// Create order
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
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

// Update order status (accept/reject)
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