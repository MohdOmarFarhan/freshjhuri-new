import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Products",
      href: "/products",
      children: [
        { label: "Fish Feed", href: "/products" },
        { label: "Fish Medicine", href: "/products" },
        { label: "Raw Materials", href: "/products" },
      ],
    },
    { label: "Services", href: "/services" },
    { label: "Learning Center", href: "/learning" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isHome = location.pathname === "/";
  const showTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showTransparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span
              className={`font-bold text-xl tracking-tight transition-colors ${
                showTransparent ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              AquaPure
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <Link
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    showTransparent
                      ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10"
                      : "text-foreground hover:bg-accent"
                  } ${location.pathname === link.href ? "!text-primary" : ""}`}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                </Link>
                {link.children && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="glass rounded-xl p-2 min-w-[200px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button
              className={`p-2.5 rounded-xl transition-all ${
                showTransparent ? "hover:bg-white/10 text-primary-foreground" : "hover:bg-accent text-foreground"
              }`}
            >
              <Search size={20} />
            </button>
            <Link
              to="/cart"
              className={`p-2.5 rounded-xl transition-all relative ${
                showTransparent ? "hover:bg-white/10 text-primary-foreground" : "hover:bg-accent text-foreground"
              }`}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/contact"
              className="hidden lg:inline-flex px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              Request Quote
            </Link>
            <button
              className={`lg:hidden p-2.5 rounded-xl ${
                showTransparent ? "text-primary-foreground" : "text-foreground"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <button
                      className="block w-full text-left px-4 py-3 text-foreground font-medium rounded-xl hover:bg-accent transition-colors"
                      onClick={() => setProductsOpen(!productsOpen)}
                    >
                      <span className="flex items-center justify-between">
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${productsOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 text-foreground font-medium rounded-xl hover:bg-accent transition-colors ${
                        location.pathname === link.href ? "text-primary" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                  {link.children && productsOpen && (
                    <div className="pl-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-muted-foreground rounded-xl hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/contact"
                className="block text-center px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl mt-2"
              >
                Request Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
