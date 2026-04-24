import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import WhatsAppButton from "@/components/WhatsAppButton";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-forest to-forest/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">Our Products</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mt-3">
              Premium Aquaculture <span className="text-primary">Products</span>
            </h1>
            <p className="text-primary-foreground/70 mt-4 max-w-2xl text-lg">
              Browse our complete range of quality-tested fish feeds, medicines, and raw materials.
            </p>
          </motion.div>
        </div>
      </section>
      <ProductGrid />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Products;
