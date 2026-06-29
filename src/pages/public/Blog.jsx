import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from '../../components/animations/ScrollReveal';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Pakistani Jewelry Trends for 2024',
    excerpt: 'Discover the latest jewelry trends taking Pakistan by storm. From traditional gold sets to modern minimalist pieces...',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=400&fit=crop',
    date: 'December 28, 2024',
    author: 'NAZAAKAT Team',
    category: 'Jewelry',
    slug: 'pakistani-jewelry-trends-2024',
    content: `Pakistani jewelry has always been a symbol of elegance and tradition. In 2024, we're seeing exciting new trends that blend traditional craftsmanship with modern aesthetics.

1. Minimalist Gold Sets
Gone are the days of heavy jewelry. Modern Pakistani women prefer lightweight, elegant pieces that can be worn daily. NAZAAKAT's gold necklace sets are perfect examples of this trend.

2. Pearl Revival
Freshwater pearls are making a massive comeback. Our pearl bracelets combine traditional elegance with contemporary design.

3. Mixed Metals
Combining gold with silver or rose gold creates stunning contrast pieces that work with any outfit.

4. Statement Earrings
Crystal drop earrings are the must-have accessory for weddings and parties this season.

5. Layered Necklaces
Multiple thin chains worn together create a bohemian yet elegant look.

6. Handcrafted Pieces
Customers are increasingly valuing artisanal craftsmanship over machine-made jewelry.

7. Personalized Jewelry
Custom name necklaces and initial pendants are trending among younger customers.

8. Colorful Gemstones
Beyond diamonds, colored stones like emeralds, rubies, and sapphires are gaining popularity.

9. Sustainable Materials
Eco-friendly and ethically sourced materials are becoming important to conscious consumers.

10. Fusion Designs
Blending Pakistani traditional designs with Western styles creates unique pieces that appeal globally.`
  },
  {
    id: 2,
    title: 'How to Style Luxury Bags for Pakistani Weddings',
    excerpt: 'Complete guide to matching your handbag with different wedding outfits. Tips from fashion experts...',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop',
    date: 'December 25, 2024',
    author: 'NAZAAKAT Team',
    category: 'Fashion',
    slug: 'style-bags-pakistani-weddings',
    content: `Pakistani weddings are grand affairs that require careful attention to every detail of your outfit. Your handbag is no exception.

Mehndi Function
For mehndi, choose colorful clutches that complement your vibrant outfit. NAZAAKAT's embroidered clutches work perfectly with yellow and green ensembles.

Baraat (Main Event)
The baraat calls for elegance. Our designer clutches in gold or silver tones match perfectly with heavy bridal wear or formal guest outfits.

Valima Reception
For the valima, opt for sophisticated leather handbags in neutral tones that complement pastel outfits.

Tips for Matching:
- Match metal hardware with your jewelry
- Consider the size - small clutches for formal, totes for casual events
- Coordinate colors with your outfit's embroidery
- Always choose quality over quantity`
  },
  {
    id: 3,
    title: 'Best Accessories for Eid 2024 - Complete Guide',
    excerpt: 'Get ready for Eid with our curated accessory collection. Scarves, jewelry, and bags for the perfect festive look...',
    image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=600&h=400&fit=crop',
    date: 'December 20, 2024',
    author: 'NAZAAKAT Team',
    category: 'Style Guide',
    slug: 'eid-accessories-guide-2024',
    content: `Eid is the perfect occasion to showcase your style. Here's how to accessorize for a memorable Eid celebration.

Essential Eid Accessories:
1. Statement Jewelry - Our gold necklace sets are perfect for Eid prayers and family gatherings
2. Elegant Scarves - Pure silk scarves add sophistication to any outfit
3. Designer Bags - A beautiful clutch completes your festive look
4. Bangles & Bracelets - Layer multiple pieces for a traditional touch

Styling Tips:
- Choose one statement piece and keep others minimal
- Match metals for a cohesive look
- Consider comfort for long family gatherings
- Invest in versatile pieces you can wear beyond Eid`
  },
  {
    id: 4,
    title: 'Why Handcrafted Jewelry is Better Than Machine Made',
    excerpt: 'Discover the value of artisanal craftsmanship. Why handmade Pakistani jewelry is worth the investment...',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop',
    date: 'December 15, 2024',
    author: 'NAZAAKAT Team',
    category: 'Craftsmanship',
    slug: 'handcrafted-vs-machine-jewelry',
    content: `In a world of mass production, handcrafted jewelry stands out for its unique beauty and superior quality.

Benefits of Handcrafted Jewelry:
1. Unique Designs - No two pieces are exactly alike
2. Superior Quality - Artisans inspect every detail
3. Supporting Local Communities - Your purchase supports Pakistani craftsmen
4. Customization - Handmade pieces can be personalized
5. Durability - Better materials and construction

NAZAAKAT's Commitment:
Every piece in our collection is handcrafted by skilled Pakistani artisans using traditional techniques passed down through generations.

The Difference You Can Feel:
When you hold a handcrafted piece, you can feel the difference - the weight, the finish, the attention to detail that machines simply cannot replicate.`
  }
];

export default function Blog() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[40vh] bg-black flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500 rounded-full blur-[100px]" />
        </div>
        <div className="container-custom relative z-10 py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-xs tracking-[0.2em] uppercase">
              <Sparkles size={14} /> Fashion Insights
            </motion.span>
            <h1 className="text-5xl md:text-7xl text-white font-serif mt-6 mb-4">Our Blog</h1>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Style guides, fashion tips, and insights into Pakistani luxury fashion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <motion.article whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-white text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                    </div>
                    <h2 className="font-serif text-xl text-black mb-3 group-hover:text-gold-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="text-gold-500 text-sm font-medium flex items-center gap-1 hover:text-gold-600">
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}