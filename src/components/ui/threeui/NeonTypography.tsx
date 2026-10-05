import React, { useState, useEffect } from "react";

export interface NeonTypographyProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  color?: string;
  subtext?: string;
}

export function NeonTypography({
  text = "OPEN ALL NIGHT",
  subtext = "AUTHENTIC GLASSBLOWN NEON",
  color = "#ff0055",
  className = "",
  style,
  ...props
}: NeonTypographyProps) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 80 + Math.random() * 120);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#090909] flex flex-col items-center justify-center p-8 select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="relative flex flex-col items-center">
        <h2
          className={`text-4xl md:text-6xl font-extrabold tracking-widest text-white uppercase transition-opacity duration-75 ${
            flicker ? "opacity-30" : "opacity-100"
          }`}
          style={{
            textShadow: `
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 20px ${color},
              0 0 40px ${color},
              0 0 80px ${color}
            `,
          }}
        >
          {text}
        </h2>
        <span
          className="mt-4 text-xs font-mono tracking-widest uppercase opacity-75"
          style={{ color, textShadow: `0 0 8px ${color}` }}
        >
          {subtext}
        </span>
      </div>
    </div>
  );
}
