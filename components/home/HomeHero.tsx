'use client';

import React from 'react';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import HeroChakraWheel from './HeroChakraWheel';
import HeroTricolorRibbons from './HeroTricolorRibbons';
import HeroEmbers from './HeroEmbers';

interface HomeHeroProps {
  onViewForum: () => void;
}

export default function HomeHero({ onViewForum }: HomeHeroProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#040A1A] pt-24 pb-16 px-4 select-none"
    >
      {/* ================= LAYER 0: BG.PNG BACKGROUND LAYER ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/Bg.png"
          alt="Bharat-Ganrajya Nationalists Front Hero"
          className="w-full h-full object-cover object-center scale-[1.01] transform transition-transform duration-1000"
        />
        {/* Subtle Vignette & Atmospheric Gradients to Blend Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040A1A]/90 via-transparent to-[#040A1A]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040A1A]/35 via-transparent to-[#040A1A]/35" />
      </div>


      {/* ================= LAYER 2: ANIMATED ASHOKA CHAKRA WHEEL (SPINNING + GLOW) ================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10">
        <HeroChakraWheel />
      </div>



      {/* ================= LAYER 4: FLOATING EMBERS & PARTICLES ================= */}
      <HeroEmbers />

      {/* ================= LAYER 5: FOREGROUND HERO CONTENT & ACTIONS ================= */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center justify-center mt-6 sm:mt-10 px-4">

        {/* Soft Radial Scrim behind Text for flawless readability and 3D depth */}
        <div
          className="absolute inset-0 -m-8 rounded-3xl pointer-events-none opacity-65 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(3, 7, 18, 0.8) 0%, rgba(4, 10, 26, 0.45) 55%, transparent 85%)',
          }}
        />

        {/* Main Title Header */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="leading-[1.12] text-center drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            {/* Line 1: Bharat-Ganrajya in Golden Amber */}
            <span
              className="block text-[#FFB020] font-bold tracking-tight"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.6rem, 6.2vw, 5.0rem)',
                textShadow: '0 2px 28px rgba(255, 176, 32, 0.65), 0 4px 45px rgba(0, 0, 0, 0.9)',
                letterSpacing: '-0.01em',
              }}
            >
              Bharat-Ganrajya
            </span>

            {/* Line 2: Nationalists Front in Crisp Bold White */}
            <span
              className="block text-white font-bold tracking-normal mt-1 sm:mt-2"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.8rem, 7.2vw, 5.8rem)',
                textShadow: '0 4px 35px rgba(0, 0, 0, 0.95), 0 2px 12px rgba(255, 255, 255, 0.25)',
                letterSpacing: '-0.02em',
              }}
            >
              Nationalists Front
            </span>
          </h1>

          {/* Subtitle / Mission Statement */}
          <p
            className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-5 sm:mt-6 leading-relaxed font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            style={{
              fontFamily: "'Spectral', Georgia, serif",
            }}
          >
            Uniting for our nation&apos;s mission of civilizational renewal, unity, and progress across five millennia of living heritage.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-10 w-full max-w-md mx-auto">
            {/* 1. Primary Button: JOIN THE FRONT */}
            <button
              onClick={onViewForum}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md font-bold text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#E5A93C',
                color: '#0A1224',
              }}
            >
              <span>JOIN THE FRONT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 2. Secondary Button: OUR MISSION */}
            <button
              onClick={() => scrollToSection('about')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md font-bold text-sm tracking-wider uppercase text-white transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer border border-[#E5A93C]/80 bg-[#060D1E]/60 hover:bg-[#E5A93C]/15 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:border-[#E5A93C] flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E5A93C]" />
              <span>OUR MISSION</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= LAYER 6: BOTTOM SCROLL INDICATOR ================= */}
      <div className="relative z-20 mt-10 sm:mt-14 animate-bounce opacity-50 hover:opacity-100 transition-opacity">
        <button
          onClick={() => scrollToSection('awakening')}
          className="text-white/70 p-2 hover:text-[#E5A93C] transition-colors cursor-pointer"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}