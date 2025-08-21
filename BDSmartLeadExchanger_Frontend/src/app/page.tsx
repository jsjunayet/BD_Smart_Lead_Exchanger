import { FAQSection } from "@/components/home/FAQSection";
import FeaturesSection from "@/components/home/FeatureSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { StatsSection } from "@/components/home/StatsSection";
import { Footer } from "@/components/share/Footer";
import { Navbar } from "@/components/share/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      {/* <ServiceSection /> */}
      <StatsSection />
      <PartnersSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
