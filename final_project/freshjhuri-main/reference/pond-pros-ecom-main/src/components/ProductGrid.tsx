import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye, Package, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

const filters = ["All", "Pangas", "Tilapia", "Shrimp", "Catfish"];
const typeFilters = ["All Types", "Fish Feed", "Medicine", "Raw Materials"];

const categoryGradients: Record<string, string> = {
  "Fish Feed": "from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/20",
  "Medicine": "from-sky-50 via-cyan-50 to-teal-50 dark:from-sky-950/40 dark:via-cyan-950/30 dark:to-teal-950/20",
  "Raw Materials": "from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-lime-950/20",
};

const categoryAccents: Record<string, string> = {
  "Fish Feed": "bg-amber-500",
  "Medicine": "bg-sky-500",
  "Raw Materials": "bg-emerald-500",
};

const ProductGrid = () => {
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const { addToCart } = useCart();

  const filtered = products.filter((p) => {
    const speciesMatch = speciesFilter === "All" || p.species === speciesFilter || p.species === "All";
    const typeMatch = typeFilter === "All Types" || p.category === typeFilter;
    return speciesMatch && typeMatch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section id="products" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Shop</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mt-3">Best Selling Products</h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setSpeciesFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  speciesFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-primary/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {typeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  typeFilter === f
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-secondary/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-3xl overflow-hidden border border-border/60 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all duration-500 hover:-translate-y-1"
            >
              <Link to={`/products/${product.id}`} className="block">
                {/* Image Area */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-20 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 px-5 py-2.5 bg-card/90 backdrop-blur-md rounded-full text-foreground text-sm font-medium flex items-center gap-2 shadow-lg">
                      <Eye size={16} /> View Details
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${categoryAccents[product.category]}`} />
                    <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur-md text-foreground text-xs font-semibold tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  {/* Weight badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-md text-muted-foreground text-xs font-medium">
                      <Package size={12} /> {product.weight}
                    </span>
                  </div>

                  {/* Bottom gradient fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent z-10" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Species tag */}
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-primary/70">
                    {product.species === "All" ? "All Species" : `For ${product.species}`}
                  </span>

                  <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={13}
                          className={idx < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price + Cart */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div>
                      <span className="text-2xl font-extrabold text-foreground">৳{product.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground ml-1">/{product.weight}</span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-3 rounded-2xl bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
