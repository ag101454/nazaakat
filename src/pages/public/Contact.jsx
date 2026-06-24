import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Sparkles, ArrowRight, CheckCircle, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMsg = `Hello NAZAAKAT!%0A%0A*Name:* ${form.name}%0A*Email:* ${form.email}%0A*Phone:* ${form.phone}%0A*Subject:* ${form.subject}%0A*Message:* ${form.message}`;
    window.open(`https://wa.me/923001234567?text=${whatsappMsg}`, '_blank');
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactCards = [
    { icon: Phone, label: 'Call Us', value: '+92 300 1234567', link: 'tel:+923001234567', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+92 300 1234567', link: 'https://wa.me/923001234567', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Mail, label: 'Email', value: 'hello@nazaakat.com', link: 'mailto:hello@nazaakat.com', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: MapPin, label: 'Address', value: 'Gulberg III, Lahore', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[45vh] bg-black flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500 rounded-full blur-[100px]" 
          />
        </div>
        
        <div className="container-custom relative z-10 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-center"
          >
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-xs tracking-[0.2em] uppercase"
            >
              <Sparkles size={14} /> Get in Touch
            </motion.span>
            <h1 className="text-5xl md:text-7xl text-white font-serif mt-6 mb-4">Contact Us</h1>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              We'd love to hear from you. Reach out and we'll respond promptly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon size={24} className={card.color} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{card.label}</h3>
                {card.link ? (
                  <a 
                    href={card.link} 
                    target={card.link.startsWith('http') ? '_blank' : ''} 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gold-500 transition-colors font-medium text-sm"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="text-gray-600 font-medium text-sm">{card.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Info */}
      <section className="pb-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-2xl font-serif text-black mb-2">Send a Message</h2>
              <p className="text-gray-500 text-sm mb-6">Fill the form and we'll get back to you via WhatsApp</p>

              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700 text-sm">Message sent! Redirecting to WhatsApp...</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      required 
                      type="tel"
                      placeholder="03XX-XXXXXXX"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input 
                    name="subject" 
                    value={form.subject} 
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea 
                    name="message" 
                    value={form.message} 
                    onChange={handleChange} 
                    required 
                    rows={4}
                    placeholder="Tell us about your inquiry..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none transition-all text-sm" 
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.01 }} 
                  whileTap={{ scale: 0.99 }} 
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <Send size={18} />
                  Send via WhatsApp
                </motion.button>
              </form>
            </motion.div>

            {/* Side Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-serif text-black mb-4">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600 text-sm">Monday - Saturday</span>
                    <span className="font-medium text-black text-sm">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Sunday</span>
                    <span className="font-medium text-black text-sm">12:00 PM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-serif text-black mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/products" className="flex items-center justify-between text-gray-600 hover:text-gold-500 transition-colors text-sm py-1">
                    Shop Products <ArrowRight size={14} />
                  </Link>
                  <Link to="/about" className="flex items-center justify-between text-gray-600 hover:text-gold-500 transition-colors text-sm py-1">
                    About Us <ArrowRight size={14} />
                  </Link>
                  <Link to="/track-order" className="flex items-center justify-between text-gray-600 hover:text-gold-500 transition-colors text-sm py-1">
                    Track Order <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <h3 className="font-medium text-green-800 mb-1">Quick Chat</h3>
                <p className="text-green-600 text-xs mb-4">Prefer instant messaging?</p>
                <a 
                  href="https://wa.me/923001234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}