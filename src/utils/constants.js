// src/utils/constants.js
export const BRAND = {
    name: 'NAZAKKAT',
    tagline: 'Elegance in Every Detail',
    description: 'Premium Pakistani luxury fashion - bags, jewelry, and accessories',
    email: 'hello@nazakkat.com',
    phone: '+92 300 1234567',
    address: 'Gulberg III, Lahore, Pakistan',
    social: {
      instagram: 'https://instagram.com/nazakkat',
      facebook: 'https://facebook.com/nazakkat',
      twitter: 'https://twitter.com/nazakkat',
    },
  };
  
  export const CATEGORIES = [
    { id: 'bags', label: 'Bags', icon: '👜' },
    { id: 'jewelry', label: 'Jewelry', icon: '💎' },
    { id: 'accessories', label: 'Accessories', icon: '✨' },
  ];
  
  export const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Popular', value: 'popular' },
  ];
  
  export const PAYMENT_METHODS = {
    cod: 'Cash on Delivery',
    card: 'Credit/Debit Card',
  };
  
  export const ORDER_STATUS = {
    pending: { label: 'Pending', color: 'yellow' },
    processing: { label: 'Processing', color: 'purple' },
    shipped: { label: 'Shipped', color: 'blue' },
    delivered: { label: 'Delivered', color: 'green' },
  };
  
  export const FREE_SHIPPING_THRESHOLD = 5000;
  export const SHIPPING_COST = 250;
  export const TAX_RATE = 0; // Pakistan typically includes tax in price