import { motion } from "framer-motion";
import { Play, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "Complete Guide to Pangas Fish Farming in 2026",
    category: "Guide",
    date: "Mar 5, 2026",
    readTime: "8 min read",
    isVideo: false,
  },
  {
    title: "How to Diagnose Common Fish Diseases Early",
    category: "Health",
    date: "Mar 2, 2026",
    readTime: "6 min read",
    isVideo: false,
  },
  {
    title: "Feed Management for Maximum Growth Rate",
    category: "Tutorial",
    date: "Feb 28, 2026",
    readTime: "12 min",
    isVideo: true,
  },
];

const LearningSection = () => {
  return (
    <section id="learning" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12"
        >
          <div>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">
              Knowledge Hub
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mt-3">
              Learning Corner
            </h2>
          </div>
          <Link
            to="/learning"
            className="inline-flex items-center gap-2 text-primary font-semibold mt-4 sm:mt-0 hover:gap-3 transition-all"
          >
            View All <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-3xl overflow-hidden hover-lift cursor-pointer"
            >
              <div className="aspect-video bg-accent relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-primary/10" />
                {post.isVideo ? (
                  <div className="relative z-10 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={24} className="ml-1" />
                  </div>
                ) : (
                  <span className="relative z-10 text-6xl font-bold text-primary/20">
                    {post.category[0]}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
