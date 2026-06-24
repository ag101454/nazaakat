// src/utils/seedProducts.js
import { createProduct } from '../services/productService';

const sampleProducts = [
  {
    title: 'Elegant Leather Handbag',
    description: 'Premium genuine leather handbag with gold accents. Perfect for evening events and formal occasions.',
    price: 8500,
    originalPrice: 12000,
    category: 'bags',
    stock: 15,
    featured: true,
    sizes: ['Regular'],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop',
    ],
  },
  {
    title: 'Gold Plated Necklace Set',
    description: 'Exquisite gold plated necklace with matching earrings. Traditional Pakistani craftsmanship.',
    price: 4500,
    category: 'jewelry',
    stock: 20,
    featured: true,
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=500&fit=crop',
    ],
  },
  {
    title: 'Silk Scarf Collection',
    description: 'Pure silk scarf with hand-painted designs. A timeless accessory for every wardrobe.',
    price: 3200,
    originalPrice: 4500,
    category: 'accessories',
    stock: 30,
    featured: true,
    sizes: ['Regular'],
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&h=500&fit=crop',
    ],
  },
  {
    title: 'Crystal Earrings',
    description: 'Stunning crystal drop earrings with silver plating. Lightweight and elegant.',
    price: 2800,
    category: 'jewelry',
    stock: 25,
    featured: false,
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop',
    ],
  },
  {
    title: 'Designer Clutch Bag',
    description: 'Embroidered clutch bag with detachable chain strap. Perfect for weddings and parties.',
    price: 6500,
    category: 'bags',
    stock: 10,
    featured: true,
    sizes: ['Regular'],
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=500&fit=crop',
    ],
  },
  {
    title: 'Pearl Bracelet',
    description: 'Freshwater pearl bracelet with gold clasp. A classic piece for everyday elegance.',
    price: 1800,
    category: 'jewelry',
    stock: 40,
    featured: false,
    sizes: ['Adjustable'],
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop',
    ],
  },
];

// Run this once to seed products
export const seedProducts = async () => {
  for (const product of sampleProducts) {
    try {
      await createProduct(product);
      console.log(`✅ Added: ${product.title}`);
    } catch (error) {
      console.error(`❌ Failed to add ${product.title}:`, error);
    }
  }
  console.log('🎉 Seeding complete!');
};