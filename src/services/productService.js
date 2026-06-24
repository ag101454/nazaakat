import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'products';

// Get all products
export const getProducts = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get single product
export const getProductById = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION, id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Convert file to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Compress image before converting to Base64 (reduces size)
const compressImage = (file, maxWidth = 800) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });
};

// Create product with Base64 images
export const createProduct = async (productData, imageFiles = []) => {
  try {
    console.log('Starting product creation...');
    console.log('Image files to process:', imageFiles.length);

    const imageUrls = [];
    
    // Convert each image to Base64
    for (const file of imageFiles) {
      console.log(`Processing: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      
      // Compress then convert to Base64
      const base64 = await compressImage(file, 800);
      imageUrls.push(base64);
      console.log('Image converted to Base64 successfully');
    }

    console.log('All images processed. Saving to Firestore...');

    // Save to Firestore
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...productData,
      images: imageUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Product created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData, newImageFiles = []) => {
  try {
    let imageUrls = productData.images || [];
    
    for (const file of newImageFiles) {
      const base64 = await compressImage(file, 800);
      imageUrls.push(base64);
    }

    await updateDoc(doc(db, COLLECTION, id), {
      ...productData,
      images: imageUrls,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};