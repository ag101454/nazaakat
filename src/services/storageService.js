// src/services/storageService.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (file, path = 'products') => {
  const timestamp = Date.now();
  const fileName = `${path}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, fileName);
  
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const uploadMultipleImages = async (files, path = 'products') => {
  return await Promise.all(
    files.map(file => uploadImage(file, path))
  );
};

export const deleteImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};