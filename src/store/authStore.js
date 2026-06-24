// src/store/authStore.js
import { create } from 'zustand';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  init: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userData,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  loginWithEmail: async (email, password) => {
    try {
      set({ error: null });
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null });
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create user doc if not exists
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  register: async (email, password, name) => {
    try {
      set({ error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', result.user.uid), {
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;