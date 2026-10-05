import React, { useEffect, useRef } from "react";

export interface ParticleWordmarkProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  particleSize?: number;
}

export function ParticleWordmark({
  text = "EPILUDE",
  particleSize = 2,
  className = "",
  style,
  ...props
}: ParticleWordmarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    // Render offscreen text to sample points
    const offCanvas = document.createElement("canvas");
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext("2d");
    if (!offCtx) return;

    offCtx.fillStyle = "#fff";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    const fontSize = Math.max(48, Math.round(width * 0.12));
    offCtx.font = `900 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    offCtx.fillText(text, width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    type Particle = {
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
    };

    const particles: Particle[] = [];
    const step = 6;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] > 128) {
          particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    }

    let mouseX = -9999;
    let mouseY = -9999;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    const render = () => {
      ctx.fillStyle = "#0c0c0d";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#f4f4f0";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Repel from mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (1 - dist / 80) * 8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Return to home
        p.vx += (p.ox - p.x) * 0.05;
        p.vy += (p.oy - p.y) * 0.05;

        // Damping
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, particleSize, particleSize);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [text, particleSize]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#0c0c0d] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full cursor-pointer" />
    </div>
  );
}
