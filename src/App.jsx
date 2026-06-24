import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import IntroAnimation from './animations/IntroAnimation';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <BrowserRouter>
      <AnimatePresence>
        {showIntro ? (
          <IntroAnimation onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <AppRoutes />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}