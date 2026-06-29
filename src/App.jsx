import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import IntroAnimation from './animations/IntroAnimation';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroAnimation key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <AppRoutes />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}