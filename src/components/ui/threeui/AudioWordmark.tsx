import React, { useEffect, useRef } from "react";

export interface AudioWordmarkProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  speed?: number;
}

export function AudioWordmark({
  title = "SUPREME RADIO",
  subtitle = "FREQUENCY 108.4 // KINETIC IDENT",
  speed = 1,
  className = "",
  style,
  ...props
}: AudioWordmarkProps) {
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
    let t = 0;

    const bars = 64;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      t += 0.04 * speed;

      // Draw circular waveform reel
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.28;

      ctx.save();
      ctx.translate(cx, cy);

      // Rotating reel ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Audio waveform bars
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2 + t * 0.2;
        const freq = Math.sin(i * 0.4 + t) * Math.cos(i * 0.2 - t * 0.8);
        const barH = 10 + Math.abs(freq) * 45;

        const x1 = Math.cos(angle) * (r - 10);
        const y1 = Math.sin(angle) * (r - 10);
        const x2 = Math.cos(angle) * (r + barH);
        const y2 = Math.sin(angle) * (r + barH);

        const hue = 140 + Math.sin(angle * 2 + t) * 40;
        ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${0.4 + Math.abs(freq) * 0.6})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();

      // Typography in center
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${Math.max(18, Math.round(width * 0.045))}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "0.08em";
      ctx.fillText(title, cx, cy - 8);

      ctx.font = `600 ${Math.max(10, Math.round(width * 0.015))}px monospace`;
      ctx.fillStyle = "rgba(16, 185, 129, 0.85)";
      ctx.fillText(subtitle, cx, cy + 24);

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
  }, [title, subtitle, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-neutral-950 flex items-center justify-center ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
