'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBanner from "@/components/StatsBanner";
import Mission from "@/components/Mission";
import Ideology from "@/components/Ideology";
import Pillars from "@/components/Pillars";
import Heritage from "@/components/Heritage";
import Programs from "@/components/Programs";
import QuoteRotator from "@/components/QuoteRotator";
import Join from "@/components/Join";
import Footer from "@/components/Footer";

export default function App() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
    >
      <Navbar onNavigate={scrollTo} />
      <Hero onNavigate={scrollTo} />
      <StatsBanner />
      <Mission />
      <Ideology />
      <Pillars />
      <Heritage />
      <Programs />
      <QuoteRotator />
      <Join />
      <Footer />
    </div>
  );
}