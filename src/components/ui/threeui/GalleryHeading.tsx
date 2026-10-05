import React, { useEffect, useRef } from "react";

export interface GalleryHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  headline?: string;
  tagline?: string;
  speed?: number;
}

export function GalleryHeading({
  headline = "NEW GRAINIENT",
  tagline = "COLLECTION ADDED",
  speed = 1,
  className = "",
  style,
  ...props
}: GalleryHeadingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);
    let t = 0;

    const tiles = 14;

    const render = () => {
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, width, height);

      t += 0.015 * speed;

      const cx = width / 2;
      const cy = height / 2;
      const rx = width * 0.38;
      const ry = height * 0.22;

      // Draw rotating 3D gradient cards in orbit
      for (let i = 0; i < tiles; i++) {
        const phi = (i / tiles) * Math.PI * 2 + t;
        const x = cx + Math.cos(phi) * rx;
        const y = cy + Math.sin(phi) * ry + Math.sin(phi * 2 + t) * 15;
        const scale = 0.5 + ((Math.sin(phi) + 1) / 2) * 0.6;
        const cardW = 70 * scale;
        const cardH = 90 * scale;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.sin(phi) * 0.25);

        // Gradient rounded rectangle
        const grad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
        const hue = (i * 25 + t * 40) % 360;
        grad.addColorStop(0, `hsla(${hue}, 80%, 65%, ${0.75 * scale})`);
        grad.addColorStop(1, `hsla(${(hue + 60) % 360}, 90%, 50%, ${0.25 * scale})`);

        ctx.fillStyle = grad;
        ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.4)`;
        ctx.shadowBlur = 12 * scale;
        ctx.beginPath();
        ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 8 * scale);
        ctx.fill();
        ctx.restore();
      }

      // Foreground bold headlines
      ctx.shadowBlur = 0;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${Math.max(24, Math.round(width * 0.055))}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.fillStyle = "#e5e5e5";
      ctx.fillText(headline, cx, cy - 25);

      ctx.font = `900 ${Math.max(28, Math.round(width * 0.065))}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(tagline, cx, cy + 30);

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [headline, tagline, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[380px] bg-[#080808] flex items-center justify-center ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
