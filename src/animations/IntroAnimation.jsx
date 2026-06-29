import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroAnimation({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Initial white screen
    const timer1 = setTimeout(() => setStage(1), 300);
    
    // Stage 1: NAZAAKAT appears
    const timer2 = setTimeout(() => setStage(2), 1800);
    
    // Stage 2: Glow effect
    const timer3 = setTimeout(() => setStage(3), 3000);
    
    // Stage 3: Unlock particles
    const timer4 = setTimeout(() => {
      setStage(4);
      if (onComplete) {
        setTimeout(() => onComplete(), 500);
      }
    }, 4000);

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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Stage 1: Brand Name Appears */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={stage >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center relative z-10"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-black tracking-[0.1em] md:tracking-[0.15em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              N A Z A A K A T
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-gold-500 text-xs sm:text-sm md:text-base tracking-[0.3em] md:tracking-[0.4em] uppercase mt-4 md:mt-6"
            >
              Elegance in Every Detail
            </motion.p>
          </motion.div>

          {/* Stage 2: Glow effect */}
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: '400px',
                  height: '400px',
                  background: 'radial-gradient(circle, rgba(212,148,13,0.25) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.8, 2.5],
                  opacity: [0.25, 0.4, 0],
                }}
                transition={{ duration: 1.5 }}
              />
            </motion.div>
          )}

          {/* Stage 3: Unlock effect */}
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Horizontal gold line */}
              <motion.div
                className="absolute top-1/2 left-[10%] right-[10%] h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, #D4940D, transparent)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Vertical gold line */}
              <motion.div
                className="absolute left-1/2 top-[10%] bottom-[10%] w-[1px]"
                style={{ background: 'linear-gradient(0deg, transparent, #D4940D, transparent)' }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Burst particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-gold-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 500,
                    y: (Math.random() - 0.5) * 500,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Stage 4: Fade out overlay */}
          {stage >= 3 && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}