import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface FluxVortexProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  particleCount?: number;
  primaryColor?: string;
}

export function FluxVortex({
  speed = 1,
  particleCount = 6000,
  primaryColor = "#ff6a3d",
  className = "",
  style,
  ...props
}: FluxVortexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 4, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const positions = new Float32Array(particleCount * 3);
    const radius = new Float32Array(particleCount);
    const angle = new Float32Array(particleCount);
    const ySpeed = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const y = (Math.random() - 0.5) * 6;
      const r = (0.2 + Math.pow(Math.random(), 1.4) * 2.8) * (0.4 + Math.abs(y) * 0.25);
      const a = Math.random() * Math.PI * 2;
      radius[i] = r;
      angle[i] = a;
      ySpeed[i] = 0.005 + Math.random() * 0.015;

      positions[i3] = Math.cos(a) * r;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(a) * r;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.025,
      color: new THREE.Color(primaryColor),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animId: number;
    const render = () => {
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        angle[i] += ySpeed[i] * 2.0 * speed;
        pos[i3] = Math.cos(angle[i]) * radius[i];
        pos[i3 + 2] = Math.sin(angle[i]) * radius[i];
      }
      geometry.attributes.position.needsUpdate = true;
      points.rotation.y += 0.002 * speed;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [speed, particleCount, primaryColor]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full min-h-[350px] bg-[#050505] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
