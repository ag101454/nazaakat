import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJiStXeYSkV2ZDWp-_mjuGmk_B1bZ7nS4",
  authDomain: "nazakkat-store.firebaseapp.com",
  projectId: "nazakkat-store",
  storageBucket: "nazakkat-store.firebasestorage.app",
  messagingSenderId: "837371637067",
  appId: "1:837371637067:web:26f49153c5b1acfb970cce",
  measurementId: "G-0BVXMZR49D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);