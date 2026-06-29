import { motion } from 'framer-motion';
import { Star, MessageCircle, Sparkles } from 'lucide-react';
import ScrollReveal from '../../components/animations/ScrollReveal';

const reviews = [
  {
    id: 1,
    name: 'Ayesha K.',
    city: 'Lahore',
    rating: 5,
    date: 'December 25, 2024',
    text: 'Absolutely stunning jewelry! The gold necklace set I ordered exceeded my expectations. The craftsmanship is incredible and delivery was super fast. Highly recommend NAZAAKAT! 💎',
    product: 'Gold Necklace Set',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Fatima R.',
    city: 'Karachi',
    rating: 5,
    date: 'December 22, 2024',
    text: 'The leather bag I ordered is exactly what I was looking for. Premium quality, beautiful design, and the packaging was so luxurious. Will definitely order again! 👜✨',
    product: 'Elegant Leather Bag',
    verified: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Sara M.',
    city: 'Islamabad',
    rating: 5,
    date: 'December 18, 2024',
    text: 'I ordered the silk scarf and crystal earrings for a wedding. Received so many compliments! The quality is exceptional and customer service on WhatsApp was amazing. 🌸',
    product: 'Silk Scarf & Crystal Earrings',
    verified: true,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Zainab H.',
    city: 'Rawalpindi',
    rating: 5,
    date: 'December 15, 2024',
    text: 'Best online shopping experience! The pearl bracelet is beautiful and exactly as shown. Cash on delivery made it so convenient. NAZAAKAT is now my go-to for accessories! 💫',
    product: 'Pearl Bracelet',
    verified: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face'
  },
  {
    id: 5,
    name: 'Mariam A.',
    city: 'Faisalabad',
    rating: 5,
    date: 'December 10, 2024',
    text: 'Ordered the designer clutch for my sister\'s wedding. It arrived in 2 days and was even more beautiful in person. The embroidery work is exceptional! 🎉',
    product: 'Designer Clutch',
    verified: true,
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=80&h=80&fit=crop&crop=face'
  },
  {
    id: 6,
    name: 'Hira S.',
    city: 'Multan',
    rating: 5,
    date: 'December 5, 2024',
    text: 'The bangle set is gorgeous! Perfect for everyday wear and special occasions. Love that NAZAAKAT supports Pakistani craftsmanship. Will shop again! ✨',
    product: 'Bangle Set',
    verified: true,
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face'
  }
];

export default function Reviews() {
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[40vh] bg-black flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500 rounded-full blur-[100px]" />
        </div>
        <div className="container-custom relative z-10 py-16 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-xs tracking-[0.2em] uppercase">
            <Sparkles size={14} /> Customer Love
          </motion.span>
          <h1 className="text-5xl md:text-7xl text-white font-serif mt-6 mb-4">Reviews</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="text-gold-500 fill-gold-500" />
            ))}
            <span className="text-white text-2xl font-bold ml-2">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-gray-400">{reviews.length}+ happy customers</p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <ScrollReveal key={review.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-black">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.city} • {review.date}</p>
                    </div>
                    {review.verified && (
                      <span className="ml-auto px-2 py-0.5 bg-green-50 text-green-600 text-[10px] rounded-full">Verified</span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.text}</p>
                  <p className="text-xs text-gold-500">Product: {review.product}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-black text-white text-center">
        <div className="container-custom">
          <h2 className="text-3xl font-serif mb-4">Share Your Experience</h2>
          <p className="text-gray-400 mb-6">We'd love to hear your feedback!</p>
          <a href="https://wa.me/923407146871?text=I%20want%20to%20share%20my%20NAZAAKAT%20review!" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700">
            <MessageCircle size={20} /> Leave a Review
          </a>
        </div>
      </section>
    </div>
  );
}