// src/components/animations/ParallaxSection.jsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const ParallaxSection = ({ 
  children, 
  className = '',
  speed = 0.5,
  direction = 'up'
}) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? ['0%', `${-speed * 100}%`] : ['0%', `${speed * 100}%`]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.6, 1, 0.6]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;