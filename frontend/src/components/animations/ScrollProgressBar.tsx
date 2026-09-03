'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none bg-transparent"
    >
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-[#E8612C] via-[#FF8A50] to-[#E8612C] shadow-[0_0_8px_rgba(232,97,44,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
}
