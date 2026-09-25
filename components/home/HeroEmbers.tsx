'use client';

import React, { useMemo } from 'react';

export default function HeroEmbers() {
  // Generate random embers with varying sizes, speeds, and positions
  const embers = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 3.5 + 1.5;
      const duration = Math.random() * 6 + 4;
      const delay = Math.random() * 5;
      const color =
        i % 3 === 0
          ? '#FDE047' // Saffron / gold
          : i % 3 === 1
          ? '#38BDF8' // Cyan
          : '#FFFFFF'; // Pure light

      return { id: i, left, top, size, duration, delay, color };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
      {embers.map((ember) => (
        <span
          key={ember.id}
          className="absolute rounded-full pointer-events-none animate-pulse"
          style={{
            left: `${ember.left}%`,
            top: `${ember.top}%`,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            backgroundColor: ember.color,
            boxShadow: `0 0 ${ember.size * 3}px ${ember.color}`,
            animationDuration: `${ember.duration}s`,
            animationDelay: `${ember.delay}s`,
            opacity: 0.65,
          }}
        />
      ))}
    </div>
  );
}
