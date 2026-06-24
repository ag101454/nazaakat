import { motion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.3 } 
  }
};

// Mobile variants - simpler for performance
const mobileVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.3 } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

export default function PageTransition({ children }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <motion.div 
      variants={isMobile ? mobileVariants : pageVariants} 
      initial="initial" 
      animate="animate" 
      exit="exit"
    >
      {children}
    </motion.div>
  );
}