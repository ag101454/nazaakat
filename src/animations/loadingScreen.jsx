import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-[998] flex items-center justify-center">
      <motion.div className="text-center">
        <motion.h1
          className="text-4xl md:text-6xl text-black tracking-[0.15em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          NAZAAKAT
        </motion.h1>
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gold-500 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}