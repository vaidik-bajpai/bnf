import React, { useEffect, useRef } from "react";

export interface KoiStudiesProps extends React.HTMLAttributes<HTMLDivElement> {
  koiCount?: number;
}

export function KoiStudies({
  koiCount = 4,
  className = "",
  style,
  ...props
}: KoiStudiesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const fish = Array.from({ length: koiCount }, (_, i) => ({
      x: width * 0.2 + (i / koiCount) * width * 0.6,
      y: height * 0.3 + Math.random() * height * 0.4,
      angle: Math.random() * Math.PI * 2,
      speed: 1.5 + Math.random(),
      size: 26 + Math.random() * 12,
      color: i % 2 === 0 ? "#ea580c" : "#f4f4f5",
      wiggle: Math.random() * 10,
    }));

    const render = () => {
      // Deep pond water
      ctx.fillStyle = "#04151f";
      ctx.fillRect(0, 0, width, height);

      // Water ripple caustics
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 2;
      for (let r = 0; r < 5; r++) {
        ctx.beginPath();
        ctx.arc(width * 0.5 + Math.sin(r) * 120, height * 0.5 + Math.cos(r) * 80, 80 + r * 50, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const k of fish) {
        k.wiggle += 0.12;
        k.angle += Math.sin(k.wiggle * 0.3) * 0.04;
        k.x += Math.cos(k.angle) * k.speed;
        k.y += Math.sin(k.angle) * k.speed;

        if (k.x < -50) k.x = width + 50;
        if (k.x > width + 50) k.x = -50;
        if (k.y < -50) k.y = height + 50;
        if (k.y > height + 50) k.y = -50;

        ctx.save();
        ctx.translate(k.x, k.y);
        ctx.rotate(k.angle);

        // Koi body
        ctx.fillStyle = k.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, k.size, k.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wiggling tail
        const tailOffset = Math.sin(k.wiggle) * 8;
        ctx.beginPath();
        ctx.moveTo(-k.size * 0.8, 0);
        ctx.lineTo(-k.size * 1.5, tailOffset - 10);
        ctx.lineTo(-k.size * 1.5, tailOffset + 10);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [koiCount]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#04151f] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
