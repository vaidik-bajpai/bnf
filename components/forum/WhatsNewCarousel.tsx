'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';

export interface SpotlightSlide {
  id: string;
  badge: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  date: string;
  metrics: string;
  actionText: string;
  targetId?: string;
  targetType?: 'megathread' | 'discussion';
}

const defaultSlides: SpotlightSlide[] = [
  {
    id: 'slide-1',
    badge: "WHAT'S NEW",
    tag: 'FLAGSHIP INQUIRY',
    title: 'National Assembly Forums Launch',
    subtitle: 'Civilizational Renewal: The Living Continuity of Bharat',
    description: 'Explore our rigorous, verified discussion platforms and historical archives. Engage with scholars and contribute your perspectives across five millennia of heritage.',
    mediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: 'Sep 2026',
    metrics: '34,512 Contributions',
    actionText: 'Explore Forum',
    targetId: 'mega-history',
    targetType: 'megathread',
  },
  {
    id: 'slide-2',
    badge: 'NEW ARCHIVE',
    tag: 'MARITIME HISTORY',
    title: 'Saraswati-Sindhu Maritime Networks',
    subtitle: 'From Lothal Tidal Docks to Mesopotamian Trade',
    description: 'Uncovering the world’s oldest known tidal dockyards, standardized weights, and maritime exchange routes that linked ancient Bharat with the Persian Gulf.',
    mediaUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: 'Aug 2026',
    metrics: '28,190 Inquiries',
    actionText: 'Read Archive',
    targetId: 'mega-history',
    targetType: 'megathread',
  },
  {
    id: 'slide-3',
    badge: 'MEGATHREAD',
    tag: 'INDIC EPISTEMOLOGY',
    title: 'Nyaya Epistemology & Dialectics',
    subtitle: 'The Pramanas & The Civilizational Tradition of Vada',
    description: 'Explore the 16 categories of logic, perception, inference, and the rules of intellectual debate that governed intellectual discourse across ancient universities.',
    mediaUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: 'Sep 2026',
    metrics: '19,840 Scholars',
    actionText: 'Join Debate',
    targetId: 'mega-philosophy',
    targetType: 'megathread',
  },
  {
    id: 'slide-4',
    badge: 'FRONTIER',
    tag: 'INDIGENOUS SCIENCE',
    title: 'The Kerala School Calculus Lineage',
    subtitle: 'Infinite Series & Astronomy from Madhava to Jyesthadeva',
    description: 'Tracing the Yuktibhasa proofs, power series approximations of trigonometric functions, and how astronomical calculations anticipated European calculus by 250 years.',
    mediaUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: 'Sep 2026',
    metrics: '22,410 Inquiries',
    actionText: 'Explore Science',
    targetId: 'mega-science',
    targetType: 'megathread',
  },
];

interface WhatsNewCarouselProps {
  onViewMegaThread?: (id: string) => void;
  onViewThread?: (id: string) => void;
  slides?: SpotlightSlide[];
}

export default function WhatsNewCarousel({
  onViewMegaThread,
  onViewThread,
  slides = defaultSlides,
}: WhatsNewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance slides every 6.5 seconds unless user is hovering
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    if (deltaX > 50) {
      handleNext();
    } else if (deltaX < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[currentIndex];

  const handleActionClick = () => {
    if (currentSlide.targetType === 'megathread' && currentSlide.targetId && onViewMegaThread) {
      onViewMegaThread(currentSlide.targetId);
    } else if (currentSlide.targetType === 'discussion' && currentSlide.targetId && onViewThread) {
      onViewThread(currentSlide.targetId);
    } else if (onViewMegaThread && defaultSlides[0].targetId) {
      onViewMegaThread(defaultSlides[0].targetId);
    }
  };

  return (
    <div
      className="bg-[#0A1633]/85 hover:bg-[#0C1A3D] border border-white/10 hover:border-[#E5A93C]/40 rounded-xl p-3.5 sm:p-4 backdrop-blur-md shadow-2xl transition-all duration-300 relative group flex flex-col select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Top Header: Badge & Tag (Clean, single-line, non-wrapping) */}
      <div className="flex items-center justify-between mb-2.5 h-5 shrink-0 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-[#E5A93C] uppercase flex items-center gap-1 bg-[#E5A93C]/10 border border-[#E5A93C]/25 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-[#E5A93C]" /> {currentSlide.badge}
          </span>
          <span className="text-[10px] text-white/50 tracking-wider uppercase font-semibold truncate whitespace-nowrap">
            {currentSlide.tag}
          </span>
        </div>

        {/* Slide Counter on Right */}
        <span className="text-[10px] font-mono text-white/40 shrink-0 ml-2 whitespace-nowrap">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Main Slide Card Media (Fixed 16:9 Aspect Ratio) */}
      <div className="relative overflow-hidden rounded-lg shrink-0">
        <div
          onClick={handleActionClick}
          className="relative aspect-video max-h-[160px] sm:max-h-[175px] rounded-lg overflow-hidden cursor-pointer group/media shadow-md"
        >
          <img
            key={currentSlide.id}
            src={currentSlide.mediaUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-700 animate-fadeIn"
          />

          {/* Dark Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1E]/95 via-[#060D1E]/40 to-transparent" />

          {/* Center Circular Play / Explore Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover/media:bg-[#E5A93C] group-hover/media:text-slate-950 transition-all duration-300 shadow-xl group-hover/media:scale-110">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          {/* Bottom Title Overlay on Media Thumbnail */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
            <div className="text-[9px] font-semibold text-[#E5A93C] tracking-wide uppercase truncate">
              {currentSlide.tag}
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-white drop-shadow-md truncate">
              {currentSlide.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Details & Footer */}
      <div className="mt-2.5 pt-2.5 border-t border-white/10 flex flex-col">
        <div className="flex items-start justify-between gap-2.5 mb-1">
          <div className="min-w-0 flex-1">
            <h3
              className="text-white font-bold text-xs sm:text-sm leading-snug group-hover:text-[#E5A93C] transition-colors truncate"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {currentSlide.title}
            </h3>
            <div className="text-[10px] text-white/50 mt-0.5 flex items-center gap-1.5 truncate">
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="w-2.5 h-2.5 text-[#E5A93C]" /> {currentSlide.date}
              </span>
              <span className="shrink-0">•</span>
              <span className="truncate">{currentSlide.metrics}</span>
            </div>
          </div>

          {/* Action Explore Button */}
          <button
            onClick={handleActionClick}
            className="shrink-0 bg-white/10 hover:bg-[#E5A93C] text-white hover:text-slate-950 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1 shadow-sm group-hover:bg-[#E5A93C]/90 group-hover:text-slate-950"
          >
            <span>{currentSlide.actionText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Stable 2-Line Description with Fixed Height */}
        <p
          className="text-white/65 text-[11px] leading-relaxed line-clamp-2 h-8 overflow-hidden"
          style={{ fontFamily: "'Spectral', Georgia, serif" }}
        >
          {currentSlide.description}
        </p>

        {/* ============================================================== */}
        {/* BOTTOM CENTER SLIDE SELECTOR INDICATORS                         */}
        {/* ============================================================== */}
        <div className="flex items-center justify-center gap-1.5 pt-2 mt-1 border-t border-white/5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 h-1 bg-[#E5A93C] shadow-[0_0_8px_rgba(229,169,60,0.6)]'
                  : 'w-1.5 h-1 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
