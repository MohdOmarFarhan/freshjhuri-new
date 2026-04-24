import { motion } from "framer-motion";
import { Play, Calendar, Clock, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

const articles = [
  { title: "Complete Guide to Pangas Fish Farming in 2026", category: "Guide", date: "Mar 5, 2026", readTime: "8 min read", isVideo: false },
  { title: "How to Diagnose Common Fish Diseases Early", category: "Health", date: "Mar 2, 2026", readTime: "6 min read", isVideo: false },
  { title: "Feed Management for Maximum Growth Rate", category: "Tutorial", date: "Feb 28, 2026", readTime: "12 min", isVideo: true },
  { title: "Water Quality Parameters Every Farmer Must Know", category: "Science", date: "Feb 20, 2026", readTime: "5 min read", isVideo: false },
  { title: "Tilapia vs Pangas: Which is More Profitable?", category: "Analysis", date: "Feb 15, 2026", readTime: "10 min read", isVideo: false },
  { title: "Seasonal Fish Farming Calendar for Bangladesh", category: "Guide", date: "Feb 10, 2026", readTime: "15 min", isVideo: true },
  { title: "Organic Fish Farming: A Beginner's Guide", category: "Guide", date: "Feb 5, 2026", readTime: "7 min read", isVideo: false },
  { title: "How to Set Up a Profitable Shrimp Farm", category: "Tutorial", date: "Jan 28, 2026", readTime: "20 min", isVideo: true },
  { title: "Common Mistakes in Pond Preparation", category: "Tips", date: "Jan 20, 2026", readTime: "4 min read", isVideo: false },
];

const Learning = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-forest to-forest/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">Knowledge Hub</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mt-3">
              Learning <span className="text-primary">Center</span>
            </h1>
            <p className="text-primary-foreground/70 mt-4 max-w-2xl text-lg">
              Expert articles, video tutorials, and farming tips to help you maximize your harvest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group glass rounded-3xl overflow-hidden hover-lift cursor-pointer"
              >
                <div className="aspect-video bg-accent relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-primary/10" />
                  {post.isVideo ? (
                    <div className="relative z-10 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={24} className="ml-1" />
                    </div>
                  ) : (
                    <span className="relative z-10 text-6xl font-bold text-primary/20">{post.category[0]}</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Learning;
