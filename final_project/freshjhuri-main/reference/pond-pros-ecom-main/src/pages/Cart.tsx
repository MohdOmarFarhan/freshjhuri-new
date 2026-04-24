import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-28 pb-3 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Cart</span>
          </nav>
        </div>
      </div>

      <section className="py-8 lg:py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold text-foreground mb-8"
          >
            Your Cart {totalItems > 0 && <span className="text-primary">({totalItems})</span>}
          </motion.h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Browse our products and add items to your cart.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all"
              >
                Browse Products <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
                    >
                      {/* Image */}
                      <Link to={`/products/${item.product.id}`} className="shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-xl"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.id}`}>
                          <h3 className="font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.product.category} · {item.product.weight}</p>
                        <p className="text-lg font-extrabold text-primary mt-2">৳{item.product.price}</p>

                        {/* Quantity + Remove */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-foreground"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-foreground"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors mt-2"
                >
                  Clear all items
                </button>
              </div>

              {/* Order Summary */}
              <div>
                <div className="lg:sticky lg:top-28">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-border bg-card p-6 space-y-4"
                  >
                    <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

                    <div className="space-y-2 text-sm">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-muted-foreground">
                          <span className="line-clamp-1 flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                          <span className="font-medium text-foreground">৳{item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-border" />

                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-foreground">Total</span>
                      <span className="text-2xl font-extrabold text-primary">৳{totalPrice}</span>
                    </div>

                    <Link
                      to="/checkout"
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      Proceed to Checkout
                    </Link>

                    <Link
                      to="/products"
                      className="w-full py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-accent transition-all flex items-center justify-center gap-2"
                    >
                      Continue Shopping
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cart;
