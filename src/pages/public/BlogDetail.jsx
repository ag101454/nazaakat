import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, MessageCircle } from 'lucide-react';

const blogPosts = {
  'pakistani-jewelry-trends-2024': {
    id: 1,
    title: 'Top 10 Pakistani Jewelry Trends for 2024',
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
Blending Pakistani traditional designs with Western styles creates unique pieces that appeal globally.`,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&h=600&fit=crop',
    date: 'December 28, 2024',
    author: 'NAZAAKAT Team',
    category: 'Jewelry'
  },
  'style-bags-pakistani-weddings': {
    id: 2,
    title: 'How to Style Luxury Bags for Pakistani Weddings',
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
- Always choose quality over quantity`,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&h=600&fit=crop',
    date: 'December 25, 2024',
    author: 'NAZAAKAT Team',
    category: 'Fashion'
  },
  'eid-accessories-guide-2024': {
    id: 3,
    title: 'Best Accessories for Eid 2024 - Complete Guide',
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
- Invest in versatile pieces you can wear beyond Eid`,
    image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=1200&h=600&fit=crop',
    date: 'December 20, 2024',
    author: 'NAZAAKAT Team',
    category: 'Style Guide'
  },
  'handcrafted-vs-machine-jewelry': {
    id: 4,
    title: 'Why Handcrafted Jewelry is Better Than Machine Made',
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
When you hold a handcrafted piece, you can feel the difference - the weight, the finish, the attention to detail that machines simply cannot replicate.`,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=600&fit=crop',
    date: 'December 15, 2024',
    author: 'NAZAAKAT Team',
    category: 'Craftsmanship'
  }
};

export default function BlogDetail() {
  const { slug } = useParams();
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="pt-24 text-center py-20">
        <h1 className="text-3xl font-serif text-gray-400">Post not found</h1>
        <Link to="/blog" className="text-gold-500 mt-4 inline-block">← Back to Blog</Link>
      </div>
    );
  }

  const shareOnWhatsApp = () => {
    const text = `📖 ${post.title}%0A%0ARead more at NAZAAKAT Blog!%0Ahttps://nazaakat-beige.vercel.app/blog/${slug}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/blog" className="flex items-center gap-2 text-gray-500 hover:text-gold-500 mb-8">
          <ArrowLeft size={18} /> Back to Blog
        </Link>

        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="px-3 py-1 bg-gold-50 text-gold-600 rounded-full text-xs">{post.category}</span>
          <h1 className="text-4xl md:text-5xl font-serif text-black mt-4 mb-6">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
            <button onClick={shareOnWhatsApp} className="flex items-center gap-1 text-green-600 hover:text-green-700">
              <Share2 size={14} /> Share
            </button>
          </div>

          <img src={post.image} alt={post.title} className="w-full rounded-2xl mb-8" />

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gold-50 rounded-2xl border border-gold-200 text-center">
            <h3 className="font-serif text-xl text-black mb-2">Loved this article?</h3>
            <p className="text-gray-600 mb-4">Share it with your friends on WhatsApp!</p>
            <button onClick={shareOnWhatsApp}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700">
              <MessageCircle size={18} /> Share on WhatsApp
            </button>
          </div>
        </motion.article>
      </div>
    </div>
  );
}