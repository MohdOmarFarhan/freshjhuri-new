import { motion } from "framer-motion";
import { Target, Eye, Heart, Users } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TrustSection from "@/components/TrustSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const values = [
  { icon: Target, title: "Our Mission", description: "To empower fish farmers with the highest quality feeds and medicines, ensuring sustainable and profitable aquaculture across Bangladesh." },
  { icon: Eye, title: "Our Vision", description: "To become South Asia's most trusted aquaculture solutions provider, setting the gold standard in product quality and farmer support." },
  { icon: Heart, title: "Our Values", description: "Integrity, innovation, and farmer-first thinking drive everything we do. Every product is 100% quality tested before reaching your farm." },
  { icon: Users, title: "Our Team", description: "A dedicated team of aquaculture scientists, field consultants, and supply chain experts working together to serve over 5000+ farmers." },
];

const milestones = [
  { year: "2015", event: "Founded with a mission to revolutionize fish farming in Bangladesh" },
  { year: "2017", event: "Launched our first lab-tested premium fish feed line" },
  { year: "2019", event: "Expanded to serve 2000+ farmers across 20 districts" },
  { year: "2021", event: "Opened state-of-the-art quality testing laboratory" },
  { year: "2023", event: "Introduced advanced medicine line for disease prevention" },
  { year: "2026", event: "Serving 5000+ farmers with 150+ products nationwide" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-forest to-forest/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">About Us</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mt-3">
              The Story Behind <span className="text-primary">AquaPure</span>
            </h1>
            <p className="text-primary-foreground/70 mt-4 max-w-2xl text-lg">
              A decade of dedication to quality, innovation, and empowering fish farmers across Bangladesh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-8 hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="text-primary" size={26} />
                </div>
                <h3 className="font-bold text-foreground text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-accent/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">Our Journey</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mt-3">Milestones</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start pb-8 relative"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                </div>
                <div className="glass rounded-2xl p-5 flex-1">
                  <p className="text-foreground font-medium">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
