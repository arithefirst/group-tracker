'use client';

import { AnimatePresence, motion } from 'motion/react';

interface BlurInProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  key?: string | number;
}

interface AnimateHeadingProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  aKey?: string | number;
}

export function AnimateHeading({ children, aKey, duration, delay, className }: AnimateHeadingProps) {
  duration = duration ? duration / 1000 : 300 / 1000;
  delay = delay ? delay / 1000 : 100 / 1000;

  return (
    <AnimatePresence mode="wait">
      <motion.h1
        className={className}
        key={aKey}
        initial={{ opacity: 0, translateY: 20, filter: 'blur(30px)' }}
        animate={{ opacity: 1, translateY: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, translateY: -20, filter: 'blur(30px)' }}
        transition={{ duration, delay }}
      >
        {children}
      </motion.h1>
    </AnimatePresence>
  );
}

/**
 * Adds a "Blur in" animation the component's child
 * @param className optional CSS classes
 * @param duration animation duration in ms (defaults to 300)
 * @param delay animation delay in ms (defaults to 100)
 * @returns
 */
export function BlurIn({ children, className, duration, delay, key }: BlurInProps) {
  duration = duration ? duration / 1000 : 300 / 1000;
  delay = delay ? delay / 1000 : 100 / 1000;

  return (
    <motion.div
      className={className}
      initial={{ filter: 'blur(30px)', opacity: 0, translateY: 6 }}
      animate={{ filter: 'blur(0px)', opacity: 1, translateY: 0 }}
      transition={{ duration, delay }}
      key={key}
    >
      {children}
    </motion.div>
  );
}
