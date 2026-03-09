'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

function HeroContent({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="relative z-10 px-4 py-40 sm:py-44"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FadeInSection({
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

export const HomepageAnimations = {
  HeroContent,
  FadeInSection,
};
