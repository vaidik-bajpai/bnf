import React, { useEffect, useRef } from "react";

export interface EngravedCertificateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  recipient?: string;
  issuer?: string;
}

export function EngravedCertificate({
  title = "CERTIFICATE OF ATTESTATION",
  recipient = "VERIFIED OPERATOR",
  issuer = "KINETIC LATHE SYSTEMS",
  className = "",
  style,
  ...props
}: EngravedCertificateProps) {
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

    const render = () => {
      ctx.fillStyle = "#ded6c2";
      ctx.fillRect(0, 0, width, height);

      t += 0.015;

      const cx = width / 2;
      const cy = height / 2;

      // Draw guilloche border rosette
      ctx.strokeStyle = "rgba(40, 35, 25, 0.22)";
      ctx.lineWidth = 1;

      for (let r = 80; r < Math.min(width, height) * 0.42; r += 24) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.02) {
          const rad = r + Math.sin(a * 12 + t) * 6 + Math.cos(a * 6 - t) * 4;
          const x = cx + Math.cos(a) * rad;
          const y = cy + Math.sin(a) * rad;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Engraved typography
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1e1b15";

      ctx.font = "italic 13px 'Georgia', serif";
      ctx.letterSpacing = "0.15em";
      ctx.fillText(issuer, cx, cy - 70);

      ctx.font = "bold 20px 'Georgia', serif";
      ctx.fillText(title, cx, cy - 25);

      ctx.font = "bold 26px 'Georgia', serif";
      ctx.fillText(recipient, cx, cy + 25);

      ctx.font = "12px monospace";
      ctx.fillStyle = "rgba(30, 27, 21, 0.6)";
      ctx.fillText("SERIES 042 // LATHE ENCODED AUTHENTICATION", cx, cy + 75);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [title, recipient, issuer]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[380px] bg-[#ded6c2] flex items-center justify-center p-6 border-8 border-[#3b3225] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
