'use client';

import React, { useEffect, useRef } from 'react';

interface StardustCanvasProps {
  className?: string;
}

const COLORS = [
  'rgba(205,170,105,0.35)',
  'rgba(246,239,220,0.25)',
  'rgba(159,194,196,0.20)',
  'rgba(198,191,221,0.15)',
] as const;

const MOBILE_BREAKPOINT = 768;

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  velocityY: number;
  driftAmplitude: number;
  driftFrequency: number;
  driftPhase: number;
  color: string;
  life: number;
  maxLife: number;
  travelDistance: number;
  startY: number;
  fadeInDuration: number;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createParticle(width: number, height: number, spawnAnywhere = false): Particle {
  const maxLife = randomBetween(6000, 14000);
  const travelDistance = randomBetween(40, 160);
  const maxOpacity = randomBetween(0.08, 0.45);

  return {
    x: Math.random() * width,
    y: spawnAnywhere ? Math.random() * height : height + randomBetween(0, 40),
    size: randomBetween(1, 3),
    opacity: 0,
    maxOpacity,
    velocityY: -(travelDistance / maxLife),
    driftAmplitude: randomBetween(4, 18),
    driftFrequency: randomBetween(0.0008, 0.002),
    driftPhase: Math.random() * Math.PI * 2,
    color: pickColor(),
    life: spawnAnywhere ? Math.random() * maxLife * 0.8 : 0,
    maxLife,
    travelDistance,
    startY: spawnAnywhere ? Math.random() * height : height + randomBetween(0, 40),
    fadeInDuration: randomBetween(800, 1800),
  };
}

function getParticleCount(width: number): number {
  return width < MOBILE_BREAKPOINT ? 15 : 35;
}

function getStaticDotCount(): number {
  return Math.floor(randomBetween(8, 11));
}

export default function StardustCanvas({ className }: StardustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = reducedMotionQuery.matches;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let staticDots: { x: number; y: number; size: number; opacity: number; color: string }[] = [];
    let isVisible = !document.hidden;
    let isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
    let mouseX = -1000;
    let mouseY = -1000;

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      isDesktop = width >= MOBILE_BREAKPOINT;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (reducedMotionRef.current) {
        const count = getStaticDotCount();
        staticDots = Array.from({ length: count }, () => ({
          x: randomBetween(width * 0.05, width * 0.95),
          y: randomBetween(height * 0.05, height * 0.95),
          size: randomBetween(1, 2.5),
          opacity: randomBetween(0.08, 0.2),
          color: pickColor(),
        }));
      } else {
        const count = getParticleCount(width);
        particles = Array.from({ length: count }, () => createParticle(width, height, true));
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const dot of staticDots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const recycleParticle = (particle: Particle) => {
      const fresh = createParticle(width, height, false);
      Object.assign(particle, fresh);
    };

    const updateAndDraw = (timestamp: number) => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.life += 16;

        if (particle.life >= particle.maxLife || particle.y <= -particle.size) {
          recycleParticle(particle);
          continue;
        }

        particle.y = particle.startY + particle.velocityY * particle.life;

        const driftX =
          Math.sin(particle.driftPhase + timestamp * particle.driftFrequency) *
          particle.driftAmplitude;

        let drawX = particle.x + driftX;
        let drawY = particle.y;

        if (isDesktop && mouseX >= 0 && mouseY >= 0) {
          const dx = drawX - mouseX;
          const dy = drawY - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 100 && dist > 0) {
            const proximity = 1 - dist / 100;
            const push = 2 + proximity * 3;
            drawX += (dx / dist) * push;
            drawY += (dy / dist) * push;
          }
        }

        const progress = particle.life / particle.maxLife;
        const fadeIn = Math.min(particle.life / particle.fadeInDuration, 1);
        const fadeOut = progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1;
        particle.opacity = particle.maxOpacity * fadeIn * fadeOut;

        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const loop = (timestamp: number) => {
      if (reducedMotionRef.current) {
        return;
      }
      if (isVisible) {
        updateAndDraw(timestamp);
      }
      animationFrameId = window.requestAnimationFrame(loop);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      resizeCanvas();
      if (reducedMotionRef.current) {
        window.cancelAnimationFrame(animationFrameId);
        drawStatic();
      } else {
        animationFrameId = window.requestAnimationFrame(loop);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDesktop) return;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    resizeCanvas();
    if (reducedMotionRef.current) {
      drawStatic();
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      if (reducedMotionRef.current) {
        drawStatic();
      }
    });
    resizeObserver.observe(document.documentElement);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    if (!reducedMotionRef.current) {
      animationFrameId = window.requestAnimationFrame(loop);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
