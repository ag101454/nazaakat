import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className = '',
  mobile = true 
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const directions = {
    up: { y: isMobile ? 30 : 60, opacity: 0 },
    down: { y: isMobile ? -30 : -60, opacity: 0 },
    left: { x: isMobile ? -30 : -60, opacity: 0 },
    right: { x: isMobile ? 30 : 60, opacity: 0 },
    fade: { opacity: 0 },
    scale: { scale: 0.9, opacity: 0 },
  };

  // On mobile, reduce animation or skip if performance is critical
  if (!mobile && isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={directions[direction] || directions.up}
      whileInView={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: isMobile ? '-20px' : '-50px' }}
      transition={{ 
        duration: isMobile ? 0.4 : 0.7, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}