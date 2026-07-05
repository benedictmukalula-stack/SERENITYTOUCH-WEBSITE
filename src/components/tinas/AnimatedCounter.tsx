'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  label: string;
  duration?: number;
}

function parseNumericValue(value: string): { number: number; suffix: string } {
  const match = value.match(/^([0-9,]+)(.*)$/);
  if (!match) return { number: 0, suffix: value };
  const numericStr = match[1].replace(/,/g, '');
  return {
    number: parseInt(numericStr, 10),
    suffix: match[2] || '',
  };
}

function formatWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}

export default function AnimatedCounter({
  value,
  label,
  duration = 2000,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const { number: target, suffix } = parseNumericValue(value);

          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            setDisplayValue(formatWithCommas(current) + suffix);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(formatWithCommas(target) + suffix);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="surface-raised rounded-2xl p-6 text-center cursor-default"
    >
      <span className="heading-display text-gradient-gold text-4xl md:text-5xl font-bold block leading-tight">
        {displayValue}
      </span>
      <span className="body-serif text-pink-glow/50 text-sm mt-2 block">
        {label}
      </span>
    </motion.div>
  );
}