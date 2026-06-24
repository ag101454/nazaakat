import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Sparkles, ShoppingBag, Truck, CreditCard, 
  RotateCcw, Phone, HelpCircle, Star, Heart, Package 
} from 'lucide-react';

// Detailed AI Knowledge Base
const aiKnowledge = {
  greetings: {
    keywords: ['hi', 'hello', 'hey', 'assalam', 'salam', 'aoa', 'good morning', 'good evening'],
    responses: [
      "✨ *Assalam-o-Alaikum!* Welcome to NAZAAKAT – where elegance meets tradition. I'm your personal shopping assistant. How may I help you today?\n\nYou can ask me about:\n👜 Our Collections\n💰 Prices & Payment\n📦 Delivery & Shipping\n🔄 Returns & Exchange",
      "🌹 *Welcome to NAZAAKAT!* I'm delighted to assist you. Whether you're looking for the perfect handbag, exquisite jewelry, or elegant accessories – I'm here to help!\n\nWhat brings you to our luxury boutique today?",
      "💎 *Hello Beautiful!* Welcome to NAZAAKAT – your destination for premium Pakistani fashion. I can help you find the perfect piece for any occasion.\n\nHow can I make your shopping experience special today?"
    ]
  },
  collections: {
    keywords: ['collection', 'products', 'categories', 'what do you have', 'what you sell', 'items'],
    responses: [
      "🌸 *Our Luxurious Collections:*\n\n👜 *BAGS*\n• Elegant Leather Handbags – PKR 8,500\n• Designer Clutches – PKR 6,500\n• Leather Tote Bags – PKR 9,500\n\n💎 *JEWELRY*\n• Gold Necklace Sets – PKR 4,500\n• Crystal Earrings – PKR 2,800\n• Pearl Bracelets – PKR 1,800\n• Bangle Sets – PKR 3,500\n\n✨ *ACCESSORIES*\n• Pure Silk Scarves – PKR 3,200\n\nWhich collection would you like to explore?",
      "🌟 *Discover NAZAAKAT Collections:*\n\n👜 *Luxury Bags* – Handcrafted leather pieces\n💎 *Fine Jewelry* – Gold-plated & crystal designs\n✨ *Silk Accessories* – Hand-painted scarves\n\nEach piece is crafted with passion by skilled Pakistani artisans. Which category interests you? 💫"
    ]
  },
  bags: {
    keywords: ['bag', 'bags', 'handbag', 'purse', 'clutch', 'tote', 'leather'],
    responses: [
      "👜 *NAZAAKAT Luxury Bags Collection*\n\n✨ *Elegant Leather Bag* – PKR 8,500 (Was PKR 12,000)\n   Premium genuine leather with gold accents\n   Perfect for evening events\n\n✨ *Designer Clutch* – PKR 6,500\n   Embroidered with detachable chain\n   Ideal for weddings & parties\n\n✨ *Leather Tote Bag* – PKR 9,500\n   Spacious & elegant for everyday luxury\n\n🌟 All bags come with free delivery across Pakistan!\n\nWould you like to order one? 💫"
    ]
  },
  jewelry: {
    keywords: ['jewelry', 'necklace', 'earrings', 'bracelet', 'bangle', 'gold', 'crystal', 'pearl'],
    responses: [
      "💎 *NAZAAKAT Fine Jewelry Collection*\n\n✨ *Gold Necklace Set* – PKR 4,500\n   Exquisite gold-plated with matching earrings\n   Traditional Pakistani craftsmanship\n\n✨ *Crystal Earrings* – PKR 2,800\n   Stunning crystal drops with silver plating\n   Lightweight & elegant\n\n✨ *Pearl Bracelet* – PKR 1,800\n   Freshwater pearls with adjustable clasp\n\n✨ *Bangle Set* – PKR 3,500 (Was PKR 5,000)\n   Traditional gold bangles, set of 4\n\n🌟 Each piece is authentic & comes with a guarantee!\n\nWhich one caught your eye? ✨"
    ]
  },
  accessories: {
    keywords: ['accessory', 'scarf', 'silk', 'wrap'],
    responses: [
      "✨ *NAZAAKAT Silk Accessories*\n\n🌸 *Pure Silk Scarf* – PKR 3,200 (Was PKR 4,500)\n   Hand-painted designs\n   Lightweight & breathable\n   Perfect for any outfit\n\n🌟 Made from 100% pure silk with traditional artistry. A timeless piece for your wardrobe!\n\nWould you like to order this elegant scarf? 🎀"
    ]
  },
  pricing: {
    keywords: ['price', 'cost', 'expensive', 'cheap', 'affordable', 'budget', 'discount', 'sale'],
    responses: [
      "💰 *NAZAAKAT Price Range*\n\nOur luxury collection is surprisingly affordable:\n\n👜 Bags: PKR 6,500 – 9,500\n💎 Jewelry: PKR 1,800 – 4,500\n✨ Accessories: PKR 3,200\n\n🌟 *Special Offers:*\n• Up to 30% off on selected items\n• Free delivery on orders above PKR 5,000\n• Bundle deals available\n\nWe believe luxury should be accessible! ✨"
    ]
  },
  payment: {
    keywords: ['payment', 'pay', 'cash', 'delivery', 'cod', 'easypaisa', 'jazzcash', 'bank', 'transfer', 'card'],
    responses: [
      "💳 *Payment Options at NAZAAKAT*\n\nWe offer convenient payment methods:\n\n💰 *Cash on Delivery* (Most Popular)\n   Pay when you receive your order\n   Available across Pakistan\n\n🏦 *Bank Transfer*\n   • Meezan Bank\n   • HBL\n   • Bank Alfalah\n\n📱 *Mobile Wallets*\n   • EasyPaisa\n   • JazzCash\n\n🔒 All payments are secure & confirmed via WhatsApp!\n\nWhich method do you prefer?"
    ]
  },
  shipping: {
    keywords: ['shipping', 'delivery', 'ship', 'deliver', 'receive', 'arrive', 'time', 'how long'],
    responses: [
      "📦 *Delivery Information*\n\n🚚 *Shipping Time:*\n• Lahore: 1-2 working days\n• Other major cities: 3-5 working days\n• Rural areas: 5-7 working days\n\n💰 *Shipping Cost:*\n• FREE on orders above PKR 5,000\n• PKR 250 for orders below PKR 5,000\n\n📦 *Tracking:*\nTrack your order anytime at /track-order\n\n✅ All orders are confirmed via WhatsApp with tracking details!",
      "📦 *Fast & Reliable Delivery*\n\n• Processing: Same day for orders before 3 PM\n• Delivery: 3-5 working days nationwide\n• Free shipping on orders over PKR 5,000\n\n📱 You'll receive WhatsApp updates at every step!\n\nWant to place an order now? 🛍️"
    ]
  },
  returns: {
    keywords: ['return', 'exchange', 'refund', 'damage', 'broken', 'wrong', 'size', 'change'],
    responses: [
      "🔄 *Easy Returns & Exchange Policy*\n\n✅ *7-Day Return Window*\n• Item must be unused & in original packaging\n• Contact us via WhatsApp to initiate\n\n🔄 *Exchange Process:*\n1. WhatsApp us your order details\n2. We'll arrange pickup\n3. Receive replacement within 5 days\n\n💰 *Refund:*\nFull refund within 7 days of return receipt\n\n🙏 Your satisfaction is our priority! We ensure every piece meets our quality standards before shipping."
    ]
  },
  order: {
    keywords: ['order', 'buy', 'purchase', 'get', 'how to order', 'place order'],
    responses: [
      "🛍️ *How to Order from NAZAAKAT*\n\n1️⃣ Browse our collections\n2️⃣ Click 'Add to Cart' on items you love\n3️⃣ Go to Cart → Checkout\n4️⃣ Fill your details\n5️⃣ Choose payment method\n6️⃣ Confirm via WhatsApp\n\n📱 You'll receive instant WhatsApp confirmation!\n\n🌟 It's that simple! Would you like to start shopping now?"
    ]
  },
  gift: {
    keywords: ['gift', 'present', 'surprise', 'someone', 'wedding', 'birthday', 'eid', 'occasion'],
    responses: [
      "🎁 *Perfect Gifts from NAZAAKAT*\n\n💎 *For Weddings:*\nGold Necklace Set + Designer Clutch = PKR 11,000\n\n🌸 *For Birthdays:*\nPearl Bracelet + Silk Scarf = PKR 5,000\n\n🌟 *For Eid:*\nBangle Set + Crystal Earrings = PKR 6,300\n\n✨ All items come in luxury gift packaging!\n\nWould you like me to suggest more gift ideas? 🎀"
    ]
  },
  contact: {
    keywords: ['contact', 'whatsapp', 'phone', 'email', 'number', 'address', 'location', 'store'],
    responses: [
      "📞 *Contact NAZAAKAT*\n\n💬 *WhatsApp:* +92 340 7146871\n   (Fastest response – within minutes!)\n\n📧 *Email:* nazaakatofficial384@gmail.com\n\n📍 *Location:* Gulgasht Colony, Multan, Pakistan\n\n🕐 *Hours:*\n   Mon-Sat: 10 AM – 8 PM\n   Sunday: 12 PM – 6 PM\n\n🌟 We're always here to help! Reach out anytime on WhatsApp."
    ]
  },
  fallback: [
    "🌸 I'd love to help you with that! Could you tell me more specifically what you're looking for?\n\nI can assist with:\n👜 Product recommendations\n💰 Pricing & payment\n📦 Delivery information\n🔄 Returns & exchange\n\nJust let me know! ✨",
    "💫 Thank you for your interest! For the most personalized assistance, I recommend chatting with our team on WhatsApp at +92 340 7146871.\n\nThey can show you product photos and help you place your order instantly! 📱",
    "🌟 That's a great question! While I can help with most inquiries, for detailed assistance our team is available on WhatsApp.\n\n📱 Message us: +92 340 7146871\n📧 Email: nazaakatofficial384@gmail.com\n\nWe'll respond within minutes! 💕"
  ]
};

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: "✨ *Assalam-o-Alaikum!* Welcome to NAZAAKAT.\n\nI'm your personal shopping assistant. How can I help you today?\n\n💬 Ask me about our collections, prices, or anything else!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userInput) => {
    const lower = userInput.toLowerCase();
    
    for (const [category, data] of Object.entries(aiKnowledge)) {
      if (category === 'fallback') continue;
      if (data.keywords.some(keyword => lower.includes(keyword))) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    return aiKnowledge.fallback[Math.floor(Math.random() * aiKnowledge.fallback.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = getBotResponse(userMessage);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const quickReplies = [
    { icon: '👜', text: 'Bags Collection' },
    { icon: '💎', text: 'Jewelry' },
    { icon: '💰', text: 'Prices' },
    { icon: '📦', text: 'Delivery Info' },
    { icon: '💳', text: 'Payment' },
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 group"
      >
        <div className="w-14 h-14 bg-black border-2 border-gold-500 rounded-full shadow-xl flex items-center justify-center">
          <Sparkles size={22} className="text-gold-500 group-hover:scale-110 transition-transform" />
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Need help? 💬
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-40 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden border border-gold-500/20"
          >
            {/* Header */}
            <div className="bg-black p-4 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-serif text-base">NAZAAKAT Assistant</h3>
                  <p className="text-gold-500 text-xs">Elegance in Every Detail ✨</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-gray-400 text-xs">Online</span>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-ivory-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.type === 'bot' && (
                    <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <Sparkles size={12} className="text-gold-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.type === 'user'
                        ? 'bg-black text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.text.split('\n').map((line, j) => (
                      <span key={j}>
                        {line.replace(/\*(.*?)\*/g, '**$1**')}
                        {j < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-4"
                >
                  <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
                    <Sparkles size={12} className="text-gold-500" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.text}
                    onClick={() => {
                      setMessages(prev => [...prev, { type: 'user', text: reply.text }]);
                      setIsTyping(true);
                      setTimeout(() => {
                        const response = getBotResponse(reply.text);
                        setMessages(prev => [...prev, { type: 'bot', text: response }]);
                        setIsTyping(false);
                      }, 1000);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-ivory-50 hover:bg-gold-50 rounded-full text-xs whitespace-nowrap transition-colors border border-gray-100"
                  >
                    <span>{reply.icon}</span>
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-ivory-50 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="w-10 h-10 bg-black text-gold-500 rounded-full flex items-center justify-center border border-gold-500/30 hover:bg-gold-500 hover:text-white transition-all"
                >
                  <Send size={16} />
                </motion.button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                ✨ Premium support • We respond within minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}