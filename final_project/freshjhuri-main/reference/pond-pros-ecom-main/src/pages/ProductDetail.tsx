import { motion } from "framer-motion";
import { Star, ShoppingCart, ChevronRight, Check, FlaskConical, BookOpen, Pill, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/cart");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-40 pb-20 text-center">
          <h1 className="text-3xl font-bold text-foreground">Product Not Found</h1>
          <Link to="/products" className="text-primary mt-4 inline-block hover:underline">
            ← Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const sections = [
    {
      icon: Check,
      title: "Features",
      items: product.features,
    },
    {
      icon: FlaskConical,
      title: "Composition",
      items: product.composition,
    },
    {
      icon: BookOpen,
      title: "Usages",
      items: product.usage.split('. ').filter(Boolean).map(s => s.endsWith('.') ? s : `${s}.`),
    },
    {
      icon: Pill,
      title: "Dosages",
      items: product.dosage.split('. ').filter(Boolean).map(s => s.endsWith('.') ? s : `${s}.`),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-28 pb-3 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Product Section */}
      <section className="py-6 lg:py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">

            {/* LEFT — Info Column */}
            <motion.div
              className="lg:col-span-7 order-2 lg:order-1"
              initial="hidden"
              animate="visible"
            >
              {/* Category pill */}
              <motion.span
                variants={fadeUp}
                custom={0}
                className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-4"
              >
                {product.category}
              </motion.span>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-3xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3"
              >
                {product.name}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-sm text-muted-foreground mb-5"
              >
                {product.weight} · {product.species}
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-muted-foreground leading-relaxed text-base lg:text-lg mb-10"
              >
                {product.description}
              </motion.p>

              {/* All Sections Inline */}
              {sections.map((section, sIdx) => (
                <motion.div
                  key={section.title}
                  variants={fadeUp}
                  custom={4 + sIdx}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <section.icon size={16} className="text-primary" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-primary tracking-tight">{section.title}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 pl-1">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 group-hover:bg-primary transition-colors" />
                        <span className="text-muted-foreground text-sm lg:text-base leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                  {sIdx < sections.length - 1 && (
                    <div className="mt-8 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* RIGHT — Sticky product card */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-28 space-y-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl overflow-hidden bg-card border border-border shadow-lg"
                >
                  {/* Main image */}
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.gallery[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {/* Subtle overlay gradient at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Thumbnails inside card */}
                  <div className="flex gap-2 px-4 py-3 bg-card">
                    {product.gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`rounded-xl overflow-hidden w-14 h-14 border-2 transition-all duration-200 ${
                          selectedImage === i
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-border opacity-50 hover:opacity-90"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Price & CTA Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-0.5">Price</p>
                      <p className="text-3xl font-extrabold text-foreground">৳{product.price}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/50 rounded-full px-3 py-1.5">
                      <Star size={14} className="fill-primary text-primary" />
                      <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Pack</p>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {product.weight}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quantity</p>
                    <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-foreground font-bold"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-foreground">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-foreground font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-14 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Related Products</h2>
              <Link to="/products" className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link to={`/products/${p.id}`} className="group rounded-2xl overflow-hidden bg-card border border-border hover-lift block">
                    <div className="relative aspect-square overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-3 lg:p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1 text-sm">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-primary">৳{p.price}</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-primary text-primary" />
                          <span className="text-xs text-muted-foreground">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
