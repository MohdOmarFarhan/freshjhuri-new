import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import fieldSupport from "@/assets/field-support.jpg";

const benefits = [
  "On-site water quality analysis",
  "Custom feed formulation advice",
  "Disease diagnosis & treatment plans",
  "Farm productivity optimization",
];

const ServiceSection = () => {
  return (
    <section id="services" className="py-20 lg:py-28 bg-accent/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden">
              <img
                src={fieldSupport}
                alt="Aquaculture field consultant providing support at pond"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-5 hidden lg:block">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">
              Our Services
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Field-Level Technical Support
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our team of experienced aquaculture specialists provides hands-on support 
              right at your farm. We help you maximize yield, maintain fish health, and 
              optimize your operations for long-term profitability.
            </p>
            <div className="space-y-4 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary shrink-0" size={22} />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:brightness-110 transition-all"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
