'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface RevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  variant?: 'fade-slide' | 'mask-up' | 'scale-up' | 'clip-reveal';
  duration?: number;
  delay?: number;
  distance?: number;
  triggerOnLoad?: boolean;
}

export default function Reveal({
  children,
  direction = 'up',
  variant = 'fade-slide',
  duration = 0.8,
  delay = 0,
  distance = 30,
  triggerOnLoad = false,
}: RevealProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const shouldReduceMotion = useReducedMotion();

  // If not hydrated yet or prefers reduced motion, return plain layout.
  // This guarantees 100% SEO indexable, server-rendered text at opacity 1 on mount.
  if (!isHydrated || shouldReduceMotion) {
    return <div className="w-full">{children}</div>;
  }

  const offsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const transition = {
    duration,
    delay,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // EaseOutExpo
  };

  const getVariants = () => {
    switch (variant) {
      case 'mask-up':
        return {
          hidden: { y: '105%', opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition,
          },
        };
      case 'scale-up':
        return {
          hidden: { scale: 0.96, opacity: 0, ...offsets[direction] },
          visible: {
            scale: 1,
            opacity: 1,
            x: 0,
            y: 0,
            transition,
          },
        };
      case 'clip-reveal':
        return {
          hidden: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.8 },
          visible: {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            transition: { ...transition, duration: duration * 1.2 },
          },
        };
      case 'fade-slide':
      default:
        return {
          hidden: { opacity: 0, ...offsets[direction] },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition,
          },
        };
    }
  };

  if (variant === 'mask-up') {
    return (
      <div className="overflow-hidden block w-full">
        <motion.div
          initial="hidden"
          animate={triggerOnLoad ? "visible" : undefined}
          whileInView={!triggerOnLoad ? "visible" : undefined}
          viewport={!triggerOnLoad ? { once: true, margin: '-4%' } : undefined}
          variants={getVariants()}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate={triggerOnLoad ? "visible" : undefined}
      whileInView={!triggerOnLoad ? "visible" : undefined}
      viewport={!triggerOnLoad ? { once: true, margin: '-4%' } : undefined}
      variants={getVariants()}
    >
      {children}
    </motion.div>
  );
}
