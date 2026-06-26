'use client';

import { useId, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';

const CX = 140;
const CY = 140;

const STAR_OUTER_R = 72;
const STAR_INNER_R = 38;

function polarToCartesian(degrees: number, radius: number): [number, number] {
  const angle = degrees * (Math.PI / 180);
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function buildHexStarPath(): string {
  const parts: string[] = [];

  for (let i = 0; i < 6; i += 1) {
    const [ox, oy] = polarToCartesian(-90 + i * 60, STAR_OUTER_R);
    const [ix, iy] = polarToCartesian(-90 + i * 60 + 30, STAR_INNER_R);

    if (i === 0) {
      parts.push(`M ${ox},${oy}`);
    }

    parts.push(`L ${ix},${iy}`);
    parts.push(`L ${polarToCartesian(-90 + (i + 1) * 60, STAR_OUTER_R).join(',')}`);
  }

  return `${parts.join(' ')} Z`;
}

const RUNE_MARKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 - 90) * (Math.PI / 180);
  const innerR = 78;
  const outerR = 86;
  return {
    x1: CX + innerR * Math.cos(angle),
    y1: CY + innerR * Math.sin(angle),
    x2: CX + outerR * Math.cos(angle),
    y2: CY + outerR * Math.sin(angle),
  };
});

const STAR_VERTICES = Array.from({ length: 6 }, (_, i) =>
  polarToCartesian(-90 + i * 60, STAR_OUTER_R)
);

function strokeAnimationStyle(
  delay: number,
  reduceMotion: boolean | null,
  breatheDelay = 2
): CSSProperties {
  if (reduceMotion) {
    return {
      strokeDashoffset: 0,
      opacity: 0.22,
    };
  }

  return {
    strokeDashoffset: 1,
    opacity: 0.15,
    animation: `magicCircleDraw 2s ease-out ${delay}s forwards, magicCircleBreathe 7s ease-in-out ${breatheDelay + delay}s infinite`,
  };
}

function fillBreatheStyle(
  delay: number,
  reduceMotion: boolean | null,
  breatheDelay = 2
): CSSProperties {
  if (reduceMotion) {
    return { opacity: 0.35 };
  }

  return {
    opacity: 0,
    animation: `magicCircleBreathe 7s ease-in-out ${breatheDelay + delay}s infinite`,
  };
}

interface MagicCircleProps {
  className?: string;
}

export default function MagicCircle({ className = '' }: MagicCircleProps) {
  const reduceMotion = useReducedMotion();
  const textPathId = useId().replace(/:/g, '');
  const starPath = buildHexStarPath();

  const strokeProps = {
    fill: 'none' as const,
    stroke: 'var(--grimoire-gold)',
    strokeWidth: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    pathLength: 1,
    strokeDasharray: 1,
  };

  return (
    <svg
      viewBox="0 0 280 280"
      aria-hidden="true"
      className={`pointer-events-none absolute h-[180px] w-[180px] sm:h-[280px] sm:w-[280px] ${className}`}
    >
      <defs>
        <path
          id={textPathId}
          d={`M ${CX},${CY - 120} A 120,120 0 1,1 ${CX - 0.01},${CY - 120}`}
          fill="none"
        />
      </defs>

      <circle
        cx={CX}
        cy={CY}
        r={120}
        {...strokeProps}
        style={strokeAnimationStyle(0, reduceMotion)}
      />

      <circle
        cx={CX}
        cy={CY}
        r={90}
        {...strokeProps}
        style={strokeAnimationStyle(0.25, reduceMotion)}
      />

      <circle
        cx={CX}
        cy={CY}
        r={60}
        {...strokeProps}
        style={strokeAnimationStyle(0.5, reduceMotion)}
      />

      <path
        d={starPath}
        {...strokeProps}
        style={strokeAnimationStyle(0.75, reduceMotion)}
      />

      {RUNE_MARKS.map((mark, i) => (
        <line
          key={i}
          x1={mark.x1}
          y1={mark.y1}
          x2={mark.x2}
          y2={mark.y2}
          {...strokeProps}
          strokeWidth={0.75}
          style={strokeAnimationStyle(1 + i * 0.04, reduceMotion)}
        />
      ))}

      {STAR_VERTICES.map(([x, y], i) => (
        <circle
          key={`vertex-${i}`}
          cx={x}
          cy={y}
          r={2.5}
          fill="var(--grimoire-gold)"
          stroke="none"
          style={fillBreatheStyle(1.25 + i * 0.05, reduceMotion, 2.75)}
        />
      ))}

      <text
        fill="var(--grimoire-gold)"
        fontSize={9}
        letterSpacing="0.18em"
        style={fillBreatheStyle(1.5, reduceMotion, 3)}
      >
        <textPath href={`#${textPathId}`} startOffset="2%">
          AI · SYSTEMS · RESEARCH · ENGINEERING · PRIVACY · VISION
        </textPath>
      </text>
    </svg>
  );
}
