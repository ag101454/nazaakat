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

// Compress image heavily to fit Firestore limits
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max dimension 400px
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Very low quality to reduce size
        const dataUrl = canvas.toDataURL('image/jpeg', 0.3);
        console.log(`Compressed: ${(file.size / 1024).toFixed(1)}KB → ${(dataUrl.length / 1024).toFixed(1)}KB`);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Create product
export const createProduct = async (productData, imageFiles = []) => {
  try {
    console.log('Starting product creation...');
    console.log('Images to process:', imageFiles.length);

    const imageUrls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      console.log(`Processing image ${i + 1}/${imageFiles.length}: ${imageFiles[i].name} (${(imageFiles[i].size / 1024).toFixed(1)}KB)`);
      const base64 = await compressImage(imageFiles[i]);
      imageUrls.push(base64);
    }

    // Check total size
    const totalSize = imageUrls.reduce((sum, img) => sum + img.length, 0);
    console.log(`Total images size: ${(totalSize / 1024).toFixed(1)}KB`);

    if (totalSize > 900000) {
      throw new Error('Images still too large. Please use smaller images.');
    }

    console.log('Saving to Firestore...');
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...productData,
      images: imageUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Product created successfully! ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(error.message || 'Failed to create product');
  }
};

// Update product
export const updateProduct = async (id, productData, newImageFiles = []) => {
  try {
    let imageUrls = productData.images || [];
    for (const file of newImageFiles) {
      const base64 = await compressImage(file);
      imageUrls.push(base64);
    }
    await updateDoc(doc(db, COLLECTION, id), {
      ...productData,
      images: imageUrls,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};