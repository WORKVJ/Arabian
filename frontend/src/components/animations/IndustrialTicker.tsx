'use client';

import { motion } from 'framer-motion';

interface IndustrialTickerProps {
  items?: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

const defaultItems = [
  'ISO 9001:2015 CERTIFIED',
  'BS EN ISO 1461 HOT-DIP GALVANIZED',
  'ASTM A36 STRUCTURAL CARBON STEEL',
  'DEFLECTION TESTED // BS EN 14122-2',
  'S355JR HIGH LOAD-BEARING MATRICES',
  'FRP / GRP VINYL ESTER CHEMICAL RESIN',
  'SERRATED & PLAIN ANTI-SLIP EDGING',
  '100% MILL CERTIFIED HEAT NUMBERS',
];

export default function IndustrialTicker({
  items = defaultItems,
  speed = 28,
  reverse = false,
  className = '',
}: IndustrialTickerProps) {
  const displayItems = [...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#111318] border-y border-white/10 py-3.5 select-none ${className}`}
    >
      <motion.div
        className="flex whitespace-nowrap gap-8 items-center will-change-transform"
        animate={{
          x: reverse ? ['-33.333%', '0%'] : ['0%', '-33.333%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-white/80 hover:text-[#E8612C] transition-colors duration-200">
              {item}
            </span>
            <span className="w-2 h-2 rotate-45 border border-[#E8612C] bg-[#E8612C]/20 shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
