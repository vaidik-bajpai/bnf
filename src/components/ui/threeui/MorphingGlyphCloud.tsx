import React, { useEffect, useRef } from "react";

export interface MorphingGlyphCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  particleCount?: number;
  speed?: number;
}

export function MorphingGlyphCloud({
  particleCount = 200,
  speed = 1,
  className = "",
  style,
  ...props
}: MorphingGlyphCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    let t = 0;

    const glyphs = "◊○□∆†‡§¶";

    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      rad: 50 + Math.random() * 120,
      glyph: glyphs[i % glyphs.length],
    }));

    const render = () => {
      ctx.fillStyle = "#08090a";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "12px sans-serif";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Morphing radius between circle and flower/star
        const morph = Math.sin(t * 0.5);
        const mod = Math.cos(p.angle * 5 + t) * (30 * morph);
        const r = p.rad + mod;

        const x = cx + Math.cos(p.angle + t * 0.2) * r;
        const y = cy + Math.sin(p.angle + t * 0.2) * r;

        ctx.fillStyle = `rgba(220, 230, 245, ${0.4 + Math.sin(i + t) * 0.3})`;
        ctx.fillText(p.glyph, x, y);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [particleCount, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[350px] bg-[#08090a] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
