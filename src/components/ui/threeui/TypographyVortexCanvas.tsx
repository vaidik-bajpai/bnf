import React, { useEffect, useRef } from "react";

export interface TypographyVortexCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  phrase?: string;
  speed?: number;
}

export function TypographyVortexCanvas({
  phrase = "SABLE // SYSTEMS IN MOTION // ",
  speed = 1,
  className = "",
  style,
  ...props
}: TypographyVortexCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);
    let t = 0;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;
      const rings = 8;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rings; r++) {
        const radius = (r + 1) * 35 + Math.sin(t + r) * 5;
        const count = 12 + r * 6;
        const fontSz = Math.max(8, 10 + r * 2);
        ctx.font = `bold ${fontSz}px monospace`;

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + t * (r % 2 === 0 ? 0.3 : -0.3);
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;

          const char = phrase[i % phrase.length];
          const alpha = 0.2 + (r / rings) * 0.8;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle + Math.PI / 2);
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [phrase, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#050505] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
