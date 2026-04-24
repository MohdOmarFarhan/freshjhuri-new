import { motion } from "framer-motion";
import { Droplets, Microscope, LineChart, BookOpen, Phone, Truck } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServiceSection from "@/components/ServiceSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const services = [
  { icon: Droplets, title: "Water Quality Management", description: "Comprehensive water testing and treatment solutions to maintain optimal pond conditions for healthy fish growth." },
  { icon: Microscope, title: "Disease Diagnosis", description: "Advanced diagnostic services to identify fish diseases early and provide targeted treatment plans." },
  { icon: LineChart, title: "Farm Productivity Audit", description: "Detailed analysis of your farm operations with actionable recommendations to boost yield and profitability." },
  { icon: BookOpen, title: "Training & Workshops", description: "Regular training programs and hands-on workshops for farmers on modern aquaculture best practices." },
  { icon: Phone, title: "24/7 Helpline", description: "Round-the-clock expert support via phone and WhatsApp for urgent farm issues and consultations." },
  { icon: Truck, title: "Doorstep Delivery", description: "Fast and reliable delivery of products directly to your farm, ensuring freshness and quality." },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-forest to-forest/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">Our Services</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mt-3">
              Expert <span className="text-primary">Aquaculture</span> Services
            </h1>
            <p className="text-primary-foreground/70 mt-4 max-w-2xl text-lg">
              From field-level support to laboratory diagnostics, we provide end-to-end services for your farm's success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-3xl p-8 hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <service.icon className="text-primary" size={26} />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Services;
