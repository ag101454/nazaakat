import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    setIsMobile(window.innerWidth < 768);
    
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 2000);
    const timer3 = setTimeout(() => setStage(3), 2800);
    const timer4 = setTimeout(() => {
      setStage(4);
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-white overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Stage 1: Brand Name Appears */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={stage >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ 
              duration: isMobile ? 0.8 : 1, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            className="text-center px-4"
          >
            <motion.h1
              className={`
                text-black tracking-[0.1em] md:tracking-[0.15em]
                ${isMobile ? 'text-4xl' : 'text-6xl md:text-8xl lg:text-9xl'}
              `}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isMobile ? (
                <>
                  N A Z A<br />A K A T
                </>
              ) : (
                'N A Z A A K A T'
              )}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={stage >= 1 ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`
                text-gold-500 tracking-[0.2em] md:tracking-[0.4em] uppercase mt-4 md:mt-6
                ${isMobile ? 'text-xs' : 'text-sm md:text-base'}
              `}
            >
              Elegance in Every Detail
            </motion.p>
          </motion.div>

          {/* Stage 2: Glow effect - smaller on mobile */}
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: isMobile ? '300px' : '500px',
                  height: isMobile ? '300px' : '500px',
                  background: 'radial-gradient(circle, rgba(212,148,13,0.3) 0%, transparent 70%)',
                }}
                animate={{
                  scale: isMobile ? [1, 1.3, 1.6] : [1, 1.5, 2],
                  opacity: [0.3, 0.5, 0],
                }}
                transition={{ duration: isMobile ? 1.2 : 1.5 }}
              />
            </motion.div>
          )}

          {/* Stage 3: Unlock effect - fewer particles on mobile */}
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              {/* Lines */}
              <motion.div
                className="absolute top-1/2 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, #D4940D, transparent)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />
              
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-[1px]"
                style={{ background: 'linear-gradient(0deg, transparent, #D4940D, transparent)' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Particles - fewer on mobile for performance */}
              {[...Array(isMobile ? 10 : 20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gold-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * (isMobile ? 300 : 600),
                    y: (Math.random() - 0.5) * (isMobile ? 300 : 600),
                    opacity: 0,
                  }}
                  transition={{
                    duration: isMobile ? 1 : 1.5,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}