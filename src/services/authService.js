// src/services/authService.js
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updateProfile
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, googleProvider, db } from './firebase';
  
  export const registerUser = async (email, password, name) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role: 'user',
      orders: [],
      createdAt: new Date().toISOString(),
      addresses: [],
    });
    return user;
  };
  
  export const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  
  export const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        role: 'user',
        orders: [],
        createdAt: new Date().toISOString(),
        addresses: [],
      });
    }
    return user;
  };
  
  export const logoutUser = () => signOut(auth);
  
  export const resetPassword = (email) => sendPasswordResetEmail(auth, email);