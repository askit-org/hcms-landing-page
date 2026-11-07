'use client';

import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
}

export default function Hero3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;

    let displayWidth = canvas.offsetWidth;
    let displayHeight = canvas.offsetHeight;

    const setupDimensions = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      displayWidth = canvas.offsetWidth;
      displayHeight = canvas.offsetHeight;
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
    };

    setupDimensions();
    window.addEventListener('resize', setupDimensions);

    // Mouse coordinates in normalized [-1, 1] range
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate crisp 3D lattice points (double helix + crystalline outer shell)
    const points: Point3D[] = [];
    const numPoints = 72;

    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 4;
      const radius = 170 + (i % 2 === 0 ? 30 : -20);
      const x = Math.cos(t) * radius + (Math.sin(i * 1.5) * 25);
      const y = (i - numPoints / 2) * 8.5;
      const z = Math.sin(t) * radius + (Math.cos(i * 1.5) * 25);

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.sin(i) * 0.2),
        vy: (Math.cos(i) * 0.2),
        vz: (Math.sin(i * 2) * 0.2),
      });
    }

    let angleY = 0;
    let angleX = 0;
    const focalLength = 520;

    const render = () => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      angleY += 0.0035 + mouseX * 0.009;
      angleX = mouseY * 0.35;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;

      // Transform points with 3D rotation
      const projected = points.map((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (Math.abs(p.x - p.baseX) > 25) p.vx *= -1;
        if (Math.abs(p.y - p.baseY) > 25) p.vy *= -1;
        if (Math.abs(p.z - p.baseZ) > 25) p.vz *= -1;

        // Rotate Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Crisp perspective math
        const scale = focalLength / (focalLength + z2 + 280);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        return {
          px,
          py,
          scale,
          z: z2,
          index,
        };
      });

      // Painter's algorithm
      projected.sort((a, b) => b.z - a.z);

      // 1. Draw sharp vector connection lines
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 105) {
            const alpha = (1 - dist / 105) * 0.35 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // 2. Draw crisp vector geometric nodes (crisp diamond / circle markers)
      projected.forEach((p) => {
        if (p.scale <= 0) return;
        const alpha = Math.max(0.2, Math.min(1, p.scale * 1.1));
        const r = Math.max(1.8, 3.2 * p.scale);

        ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fill();

        // Crisp vector ring for accent nodes
        if (p.index % 4 === 0) {
          ctx.strokeStyle = `rgba(13, 148, 136, ${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.px, p.py, r + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 3. Draw subtle crisp telemetry grid crosshairs
      const gridAlpha = 0.12;
      ctx.strokeStyle = `rgba(20, 184, 166, ${gridAlpha})`;
      ctx.lineWidth = 1;

      // Small target reticle at center
      ctx.beginPath();
      ctx.moveTo(centerX - 16, centerY);
      ctx.lineTo(centerX + 16, centerY);
      ctx.moveTo(centerX, centerY - 16);
      ctx.lineTo(centerX, centerY + 16);
      ctx.stroke();

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
