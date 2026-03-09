'use client';

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { type ReactNode, useEffect, useRef } from 'react';

// -- Hero stagger variants --

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

export function HeroContent({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative z-10 px-4 py-40 sm:py-44"
      variants={heroContainerVariants}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={heroItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// -- Scroll-triggered fade in --

export function FadeInSection({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: 0.04 + delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// -- Animated spec number (counts up on scroll) --

export function AnimatedSpec({
  value,
  suffix,
  decimalPlaces = 0,
  className,
}: {
  value: number;
  suffix?: string;
  decimalPlaces?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 40, stiffness: 120 });
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      if (shouldReduceMotion) {
        motionValue.set(value);
        return;
      }
      const timer = setTimeout(() => motionValue.set(value), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, motionValue, value, shouldReduceMotion]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          const formatted = Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
          ref.current.textContent = suffix
            ? `${formatted}${suffix}`
            : formatted;
        }
      }),
    [springValue, decimalPlaces, suffix]
  );

  return (
    <span ref={ref} className={className}>
      {shouldReduceMotion
        ? `${value}${suffix ?? ''}`
        : `0${suffix ?? ''}`}
    </span>
  );
}
