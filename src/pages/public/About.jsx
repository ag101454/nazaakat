import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Heart, Gem, Sparkles, Star, Users, Shield, Truck, ArrowRight, MessageCircle } from 'lucide-react';
import ScrollReveal from '../../components/animations/ScrollReveal';

const values = [
  {
    icon: Gem,
    title: 'Premium Quality',
    description: 'Every piece is crafted with the finest materials, ensuring lasting beauty and durability that stands the test of time.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each creation is a labor of love, handcrafted by skilled Pakistani artisans who pour their passion into every detail.',
  },
  {
    icon: Award,
    title: 'Authentic Design',
    description: 'Our designs blend traditional Pakistani craftsmanship with contemporary elegance for the modern woman.',
  },
  {
    icon: Sparkles,
    title: 'Timeless Beauty',
    description: 'Pieces that transcend trends, designed to be cherished for generations and passed down as heirlooms.',
  },
];

const stats = [
  { number: '500+', label: 'Happy Customers' },
  { number: '200+', label: 'Unique Designs' },
  { number: '50+', label: 'Skilled Artisans' },
  { number: '15+', label: 'Cities in Pakistan' },
];

const team = [
  { name: 'Ayesha Khan', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
  { name: 'Fatima Ali', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' },
  { name: 'Zara Hassan', role: 'Master Artisan', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face' },
];

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-black flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500 rounded-full blur-[100px]" 
          />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212,148,13,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full"
              >
                <Sparkles size={16} className="text-gold-500" />
                <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-medium">Our Story</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl text-white font-serif leading-[1.1]"
              >
                Crafted with <span className="text-gold-500 italic">Passion</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg leading-relaxed max-w-lg"
              >
                NAZAAKAT was born from a vision to celebrate the modern Pakistani woman. 
                We blend centuries-old craftsmanship with contemporary design to create 
                accessories that tell your story of elegance.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }}
                className="flex gap-8 pt-4"
              >
                {stats.slice(0, 3).map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-serif text-gold-500">{stat.number}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe2aQCeeZqD-d2mnk3IWb9h4H2Ok0FZ553TAILaknNYw&s=10" 
                  alt="NAZAAKAT Craftsmanship" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/700x900/F5E6D3/D4940D?text=NAZAAKAT'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl px-5 py-3 shadow-xl"
              >
                <p className="font-serif text-sm text-black">Est. 2020</p>
                <p className="text-gold-500 text-xs font-medium">Lahore, Pakistan</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-medium">What We Stand For</span>
              <h2 className="section-title mt-4 text-black">Our Values</h2>
              <p className="text-gray-500 mt-4 max-w-md mx-auto">The principles that guide every creation at NAZAAKAT</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.15}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gold-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500 transition-colors"
                  >
                    <value.icon className="w-8 h-8 text-gold-500 group-hover:text-white transition-colors" />
                  </motion.div>
                  <h3 className="font-serif text-xl text-black mb-3">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.p 
                  className="text-4xl md:text-5xl font-serif text-gold-500 mb-2"
                  whileInView={{ scale: [0.5, 1] }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-ivory-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-medium">Our Team</span>
              <h2 className="section-title mt-4 text-black">Meet the Makers</h2>
              <p className="text-gray-500 mt-4 max-w-md mx-auto">The passionate people behind every NAZAAKAT creation</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.15}>
                <motion.div whileHover={{ y: -8 }} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200/F5E6D3/D4940D?text=NAZAAKAT'; }} />
                  </div>
                  <h3 className="font-serif text-xl text-black">{member.name}</h3>
                  <p className="text-gold-500 text-sm">{member.role}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-20 bg-black text-white text-center">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/20"
            >
              <MessageCircle size={32} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-serif mb-4">Want to Know More?</h2>
            <p className="text-gray-400 mb-8">Chat with us on WhatsApp for any questions</p>
            <a href="https://wa.me/923407146871" target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 inline-flex items-center gap-2">
                <MessageCircle size={20} /> Chat with Us
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}