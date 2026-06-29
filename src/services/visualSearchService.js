import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

// Product category keywords for matching
const categoryKeywords = {
  bags: ['handbag', 'bag', 'purse', 'clutch', 'tote', 'backpack', 'luggage', 'briefcase', 'wallet'],
  jewelry: ['necklace', 'earrings', 'bracelet', 'bangle', 'ring', 'jewelry', 'chain', 'pendant', 'gem', 'crystal', 'pearl'],
  accessories: ['scarf', 'wrap', 'belt', 'hair', 'accessory', 'shawl', 'textile', 'fabric', 'silk'],
};

// Color detection keywords
const colorKeywords = {
  black: ['black', 'dark', 'ebony'],
  white: ['white', 'ivory', 'cream', 'pearl'],
  gold: ['gold', 'golden', 'yellow', 'brass'],
  silver: ['silver', 'grey', 'gray', 'chrome'],
  red: ['red', 'crimson', 'maroon', 'ruby'],
  pink: ['pink', 'rose', 'blush'],
  blue: ['blue', 'navy', 'sapphire', 'azure'],
  brown: ['brown', 'leather', 'tan', 'wood', 'chocolate'],
  purple: ['purple', 'violet', 'lavender', 'amethyst'],
  green: ['green', 'emerald', 'jade', 'olive'],
};

// Style keywords
const styleKeywords = {
  elegant: ['elegant', 'luxury', 'formal', 'sophisticated', 'classy'],
  casual: ['casual', 'everyday', 'daily', 'simple', 'basic'],
  traditional: ['traditional', 'ethnic', 'cultural', 'vintage', 'classic'],
  modern: ['modern', 'contemporary', 'trendy', 'fashion', 'stylish'],
};

let model = null;

// Load MobileNet model (runs in browser)
const loadModel = async () => {
  if (!model) {
    console.log('Loading AI model...');
    model = await mobilenet.load();
    console.log('AI model ready!');
  }
  return model;
};

// Analyze image
export const analyzeImage = async (imageElement) => {
  try {
    const net = await loadModel();
    
    // Classify image
    const predictions = await net.classify(imageElement);
    
    console.log('AI Predictions:', predictions);

    // Extract meaningful data
    const concepts = predictions.map(p => ({
      name: p.className,
      probability: p.probability,
    }));

    return {
      concepts: concepts.slice(0, 10),
      primaryCategory: detectCategory(concepts),
      colors: detectColors(concepts),
      style: detectStyle(concepts),
      tags: extractTags(concepts),
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

// Detect category
const detectCategory = (concepts) => {
  const scores = { bags: 0, jewelry: 0, accessories: 0 };
  
  concepts.forEach(concept => {
    const name = concept.name.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(k => name.includes(k))) {
        scores[category] += concept.probability;
      }
    }
  });

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'all';
};

// Detect colors
const detectColors = (concepts) => {
  const scores = {};
  
  concepts.forEach(concept => {
    const name = concept.name.toLowerCase();
    for (const [color, keywords] of Object.entries(colorKeywords)) {
      if (keywords.some(k => name.includes(k))) {
        scores[color] = (scores[color] || 0) + concept.probability;
      }
    }
  });

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color]) => color);
};

// Detect style
const detectStyle = (concepts) => {
  const scores = {};
  
  concepts.forEach(concept => {
    const name = concept.name.toLowerCase();
    for (const [style, keywords] of Object.entries(styleKeywords)) {
      if (keywords.some(k => name.includes(k))) {
        scores[style] = (scores[style] || 0) + concept.probability;
      }
    }
  });

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : 'elegant';
};

// Extract search tags
const extractTags = (concepts) => {
  return concepts
    .filter(c => c.probability > 0.05)
    .map(c => c.name.split(',')[0].trim());
};

// Find similar products
export const findSimilarProducts = async (imageFile, allProducts) => {
  try {
    // Create image element
    const img = await createImageElement(imageFile);
    
    // Analyze with AI
    const analysis = await analyzeImage(img);
    
    console.log('Analysis:', analysis);

    // Score and match products
    let scoredProducts = allProducts.map(product => {
      let score = 0;
      const title = (product.title || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      const productText = title + ' ' + desc;

      // Category match (highest weight)
      if (product.category === analysis.primaryCategory) {
        score += 10;
      }

      // Color match
      analysis.colors.forEach(color => {
        if (productText.includes(color)) score += 3;
      });

      // Style match
      if (productText.includes(analysis.style)) score += 2;

      // Tag match
      analysis.tags.forEach(tag => {
        if (productText.includes(tag)) score += 1;
      });

      return {
        ...product,
        score,
        matchReason: getMatchReason(product, analysis),
      };
    });

    // Sort and return top results
    return scoredProducts
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Create image element from file
const createImageElement = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Generate human-readable match reason
const getMatchReason = (product, analysis) => {
  const reasons = [];
  
  if (product.category === analysis.primaryCategory) {
    reasons.push(`Matches your ${analysis.primaryCategory} search`);
  }
  
  analysis.colors.forEach(color => {
    const title = (product.title || '').toLowerCase();
    if (title.includes(color)) {
      reasons.push(`Similar ${color} tones`);
    }
  });

  if (reasons.length === 0) {
    reasons.push('Style match based on AI');
  }

  return reasons[0];
};