'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface NodePosition {
  x: number;
  y: number;
}

interface JourneyMapOverlayProps {
  containerRef: RefObject<HTMLElement | null>;
}

function getContentPosition(el: Element, container: HTMLElement): NodePosition {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: elRect.left + elRect.width / 2 - containerRect.left + container.scrollLeft,
    y: elRect.top + elRect.height / 2 - containerRect.top + container.scrollTop,
  };
}

function buildWindingPath(nodes: NodePosition[]): string {
  if (nodes.length === 0) {
    return '';
  }

  if (nodes.length === 1) {
    return `M ${nodes[0].x} ${nodes[0].y}`;
  }

  let path = `M ${nodes[0].x} ${nodes[0].y}`;

  for (let i = 1; i < nodes.length; i += 1) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const dy = curr.y - prev.y;
    const wave = 16 * (i % 2 === 0 ? 1 : -1);
    const cp1y = prev.y + dy * 0.33;
    const cp2y = prev.y + dy * 0.66;

    path += ` C ${prev.x + wave} ${cp1y}, ${curr.x - wave} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return path;
}

function nodeReached(index: number, total: number, progress: number): boolean {
  if (total <= 1) {
    return progress >= 1;
  }

  return progress >= index / (total - 1);
}

export default function JourneyMapOverlay({ containerRef }: JourneyMapOverlayProps) {
  const reduceMotion = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const frameRef = useRef<number | null>(null);
  const [nodes, setNodes] = useState<NodePosition[]>([]);
  const [pathD, setPathD] = useState('');
  const [pathLength, setPathLength] = useState(0);
  const [progress, setProgress] = useState(reduceMotion ? 1 : 0);
  const [inView, setInView] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const nodeEls = container.querySelectorAll('[data-journey-node]');
    const positions = Array.from(nodeEls).map((el) => getContentPosition(el, container));

    setSize({
      width: container.clientWidth,
      height: container.scrollHeight,
    });
    setNodes(positions);
    setPathD(buildWindingPath(positions));
  }, [containerRef]);

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    scheduleMeasure();

    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(container);

    const mutationObserver = new MutationObserver(scheduleMeasure);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    container.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      container.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [containerRef, scheduleMeasure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!pathRef.current || !pathD) {
      return;
    }

    setPathLength(pathRef.current.getTotalLength());
  }, [pathD, size]);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return undefined;
    }

    if (!inView || pathLength <= 0) {
      return undefined;
    }

    let frame = 0;
    const duration = 2200;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setProgress(eased);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, pathLength, reduceMotion]);

  if (!pathD || size.width <= 0 || size.height <= 0) {
    return null;
  }

  const dashOffset = pathLength > 0 ? pathLength * (1 - progress) : 0;

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
      width={size.width}
      height={size.height}
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="var(--grimoire-gold)"
        strokeOpacity={0.25}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength || undefined}
        strokeDashoffset={reduceMotion ? 0 : dashOffset}
      />

      {nodes.map((node, index) => {
        const reached = nodeReached(index, nodes.length, progress);

        return (
          <motion.g key={`${node.x}-${node.y}-${index}`}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={6}
              fill="var(--grimoire-pale-cyan)"
              initial={false}
              animate={
                reached
                  ? {
                      opacity: reduceMotion ? 0.2 : [0.08, 0.35, 0.12],
                      r: reduceMotion ? 6 : [4, 9, 5],
                    }
                  : { opacity: 0, r: 4 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }
              }
              style={{ filter: 'blur(1px)' }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={4}
              fill="none"
              stroke="var(--grimoire-gold)"
              strokeWidth={1.5}
              initial={false}
              animate={
                reached
                  ? {
                      opacity: reduceMotion ? 0.35 : [0.15, 0.55, 0.2],
                      scale: reduceMotion ? 1 : [0.85, 1.35, 0.9],
                    }
                  : { opacity: 0, scale: 0.85 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 1.2, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }
              }
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}
