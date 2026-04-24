import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Phone, User, Truck, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/contexts/CartContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const Checkout = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    notes: "",
  });

  const shippingCost = totalPrice >= 2000 ? 0 : 120;
  const grandTotal = totalPrice + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.district.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^01\d{9}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX).");
      return;
    }
    setIsSubmitted(true);
    clearCart();
  };

  if (items.length === 0 && !isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-28 pb-3 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
              <ChevronRight size={14} />
              <span className="text-foreground font-medium">Checkout</span>
            </nav>
          </div>
        </div>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all">
              Browse Products
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="container mx-auto px-4 max-w-lg text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={44} className="text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-3">Order Placed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you, <span className="font-semibold text-foreground">{form.name}</span>. Your order has been received.
            </p>
            <p className="text-muted-foreground mb-8">
              We'll contact you at <span className="font-semibold text-foreground">{form.phone}</span> to confirm delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-all"
              >
                Go Home
              </Link>
            </div>
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-28 pb-3 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <section className="py-8 lg:py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold text-foreground mb-10"
          >
            Checkout
          </motion.h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left — Form */}
              <div className="lg:col-span-3 space-y-8">
                {/* Shipping Info */}
                <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Truck size={20} className="text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Shipping Information</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-1.5">
                        <User size={14} className="text-muted-foreground" /> Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input id="name" name="name" placeholder="আপনার নাম" value={form.name} onChange={handleChange} maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1.5">
                        <Phone size={14} className="text-muted-foreground" /> Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input id="phone" name="phone" placeholder="01XXXXXXXXX" value={form.phone} onChange={handleChange} maxLength={11} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-muted-foreground" /> Full Address <span className="text-destructive">*</span>
                      </Label>
                      <Input id="address" name="address" placeholder="গ্রাম, পোস্ট অফিস, উপজেলা" value={form.address} onChange={handleChange} maxLength={300} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                      <Input id="district" name="district" placeholder="জেলা" value={form.district} onChange={handleChange} maxLength={50} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Order Notes (optional)</Label>
                      <Input id="notes" name="notes" placeholder="বিশেষ নির্দেশনা" value={form.notes} onChange={handleChange} maxLength={500} />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard size={20} className="text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Payment Method</h2>
                  </div>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <label htmlFor="cod" className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
                      <RadioGroupItem value="cod" id="cod" />
                      <div>
                        <p className="font-semibold text-foreground">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</p>
                      </div>
                    </label>
                    <label htmlFor="bkash" className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "bkash" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
                      <RadioGroupItem value="bkash" id="bkash" />
                      <div>
                        <p className="font-semibold text-foreground">bKash / Nagad</p>
                        <p className="text-xs text-muted-foreground">মোবাইল ব্যাংকিং এর মাধ্যমে পেমেন্ট করুন</p>
                      </div>
                    </label>
                  </RadioGroup>
                </motion.div>
              </div>

              {/* Right — Summary */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-28">
                  <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl border border-border bg-card p-6 space-y-5">
                    <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-3">
                          <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">{item.product.weight} × {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-foreground whitespace-nowrap">৳{item.product.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal ({totalItems} items)</span>
                        <span className="font-medium text-foreground">৳{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span className={`font-medium ${shippingCost === 0 ? "text-primary" : "text-foreground"}`}>
                          {shippingCost === 0 ? "Free" : `৳${shippingCost}`}
                        </span>
                      </div>
                      {shippingCost > 0 && (
                        <p className="text-xs text-primary">Free shipping on orders above ৳2,000!</p>
                      )}
                    </div>

                    <div className="h-px bg-border" />

                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-foreground">Total</span>
                      <span className="text-2xl font-extrabold text-primary">৳{grandTotal}</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <ShieldCheck size={18} /> Place Order
                    </button>

                    <p className="text-xs text-center text-muted-foreground">
                      By placing your order you agree to our terms & conditions.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Checkout;
