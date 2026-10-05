import React, { useEffect, useRef } from "react";

export interface DataFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  fontSize?: number;
  color?: string;
}

export function DataField({
  speed = 1,
  fontSize = 14,
  color = "#10b981",
  className = "",
  style,
  ...props
}: DataFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const chars = "0123456789ABCDEFΣΩΨλπθ";

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(5, 5, 8, 0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1 * speed;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed, fontSize, color]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-black ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
