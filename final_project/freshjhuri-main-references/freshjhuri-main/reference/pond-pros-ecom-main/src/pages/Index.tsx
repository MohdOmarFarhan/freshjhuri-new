import FeaturedCategories from "@/components/FeaturedCategories";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LearningSection from "@/components/LearningSection";
import ProductGrid from "@/components/ProductGrid";
import ServiceSection from "@/components/ServiceSection";
import TrustSection from "@/components/TrustSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedCategories />
      <TrustSection />
      <ProductGrid />
      <ServiceSection />
      <LearningSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
