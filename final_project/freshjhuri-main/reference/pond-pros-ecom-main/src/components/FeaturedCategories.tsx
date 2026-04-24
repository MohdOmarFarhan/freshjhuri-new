import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import fishFeed from "@/assets/fish-feed.jpg";
import fishMedicine from "@/assets/fish-medicine.jpg";
import rawMaterials from "@/assets/raw-materials.jpg";

const categories = [
  {
    title: "Premium Fish Feed",
    description: "High-protein, scientifically formulated feeds for maximum growth and health.",
    image: fishFeed,
    count: "45+ Products",
  },
  {
    title: "Advanced Medicines",
    description: "Lab-tested treatments and preventive solutions for all fish species.",
    image: fishMedicine,
    count: "60+ Products",
  },
  {
    title: "Essential Raw Materials",
    description: "Premium-grade ingredients for custom feed preparation.",
    image: rawMaterials,
    count: "35+ Products",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">
            Our Categories
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mt-3">
            Everything Your Farm Needs
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, i) => (
            <Link
              to="/products"
              key={cat.title}
              className="group relative rounded-3xl overflow-hidden hover-lift cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
              <div className="aspect-[4/5] relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-xs font-medium mb-3">
                    {cat.count}
                  </span>
                  <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore <ArrowRight size={16} />
                  </span>
                </div>
              </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
