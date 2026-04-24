import { motion } from "framer-motion";
import { FlaskConical, ShieldCheck, Award, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: FlaskConical,
    title: "Lab Testing",
    description: "Every batch undergoes rigorous laboratory analysis before dispatch.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Ingredients",
    description: "Only premium-grade, certified raw materials in all our products.",
  },
  {
    icon: Award,
    title: "100% Quality Assurance",
    description: "Our multi-step QC process guarantees consistent product excellence.",
  },
  {
    icon: Headphones,
    title: "Field Support",
    description: "Expert consultants available for on-site technical guidance.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-accent/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">
            Why Choose Us
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mt-3">
            Our Quality Process
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From sourcing to delivery, every step is designed to ensure you receive only the best.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-8 text-center hover-lift"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <item.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
