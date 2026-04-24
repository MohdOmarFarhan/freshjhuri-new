import { Facebook, Twitter, Youtube, Instagram, Send } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const productLinks = [
  { label: "Fish Feed", href: "/products" },
  { label: "Fish Medicine", href: "/products" },
  { label: "Raw Materials", href: "/products" },
  { label: "Probiotics", href: "/products" },
  { label: "Water Treatment", href: "/products" },
];

const Footer = () => {
  return (
    <footer className="bg-forest text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-secondary-foreground">AquaPure</span>
            </Link>
            <p className="text-secondary-foreground/60 text-sm leading-relaxed mb-6">
              Bangladesh's trusted aquaculture partner. 100% quality guaranteed through rigorous testing.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors text-secondary-foreground/60 hover:text-primary-foreground"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-secondary-foreground/60 text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">Products</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-secondary-foreground/60 text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">Get Expert Farming Tips</h4>
            <p className="text-secondary-foreground/60 text-sm mb-4">
              Subscribe to receive the latest aquaculture insights and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-xl bg-secondary-foreground/10 border border-secondary-foreground/10 text-secondary-foreground placeholder:text-secondary-foreground/30 text-sm focus:outline-none focus:border-primary"
              />
              <button className="p-3 bg-primary text-primary-foreground rounded-xl hover:brightness-110 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 text-center">
          <p className="text-secondary-foreground/40 text-sm">
            © 2026 AquaPure. All rights reserved. 100% Quality Guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
