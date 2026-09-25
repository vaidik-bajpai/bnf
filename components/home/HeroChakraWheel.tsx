'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroChakraWheelProps {
  className?: string;
}

export default function HeroChakraWheel({ className = '' }: HeroChakraWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !wheelRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Smooth fade-in & scale-in entrance on page mount
      gsap.fromTo(
        containerRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.0, ease: 'power3.out' }
      );

      // 2. Smooth continuous 360 rotation
      const spinTween = gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: 'none',
      });

      // 3. Subtle interactive speed-up when hovering over the hero section
      const heroSection = document.getElementById('home');
      if (heroSection) {
        let speedTween: gsap.core.Tween | null = null;
        const onEnter = () => {
          speedTween?.kill();
          speedTween = gsap.to(spinTween, { timeScale: 1.8, duration: 1.5, ease: 'power2.out' });
        };
        const onLeave = () => {
          speedTween?.kill();
          speedTween = gsap.to(spinTween, { timeScale: 1.0, duration: 2.2, ease: 'power2.inOut' });
        };

        heroSection.addEventListener('mouseenter', onEnter);
        heroSection.addEventListener('mouseleave', onLeave);

        return () => {
          heroSection.removeEventListener('mouseenter', onEnter);
          heroSection.removeEventListener('mouseleave', onLeave);
        };
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
    >
      {/* Exact Ashoka Chakra Wheel from Wheel.jpeg */}
      <div
        ref={wheelRef}
        className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px] lg:w-[720px] lg:h-[720px] xl:w-[780px] xl:h-[780px] flex items-center justify-center"
        style={{
          transformOrigin: '50% 50%',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/chakra-wheel.png"
          alt="Ashoka Chakra Wheel"
          className="w-full h-full object-contain pointer-events-none select-none"
          style={{
            transformOrigin: '50% 50%',
          }}
        />
      </div>
    </div>
  );
}
