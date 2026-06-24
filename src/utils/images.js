// src/utils/images.js

// Use placeholder images or free image hosting URLs
export const PLACEHOLDER_IMAGES = {
    bags: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=500&fit=crop',
    ],
    jewelry: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop',
    ],
    accessories: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&h=500&fit=crop',
    ],
    hero: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop',
    about: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
    logo: '/logo.png',
  };
  
  // Default placeholder
  export const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/400x500/F5E6D3/D4940D?text=NAZAKKAT';
  
  // Get placeholder based on category
  export const getPlaceholderImage = (category) => {
    const images = PLACEHOLDER_IMAGES[category?.toLowerCase()];
    if (images && images.length > 0) {
      return images[Math.floor(Math.random() * images.length)];
    }
    return DEFAULT_PRODUCT_IMAGE;
  };