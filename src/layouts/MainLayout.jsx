import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import AIChatBot from '../components/chat/AIChatBot';
import CartDrawer from '../components/cart/CartDrawer';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.3 } 
  }
};

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      <AIChatBot />
    </div>
  );
}