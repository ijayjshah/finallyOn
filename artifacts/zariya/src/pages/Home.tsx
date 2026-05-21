import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import PortfolioEngine from "@/components/sections/PortfolioEngine";
import Commerce from "@/components/sections/Commerce";
import HowItWorks from "@/components/sections/HowItWorks";
import CityFirst from "@/components/sections/CityFirst";
import WhoItsFor from "@/components/sections/WhoItsFor";
import BusinessModel from "@/components/sections/BusinessModel";
import Positioning from "@/components/sections/Positioning";
import ProductShowcase from "@/components/sections/ProductShowcase";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <Solution />
        <PortfolioEngine />
        <Commerce />
        <HowItWorks />
        <CityFirst />
        <WhoItsFor />
        <BusinessModel />
        <Positioning />
        <ProductShowcase />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
