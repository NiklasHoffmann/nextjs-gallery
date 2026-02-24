'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Fade In Animation
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide In from Bottom
 */
export function SlideIn({
  children,
  delay = 0,
  duration = 0.4,
  distance = 20,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number; distance?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale In Animation
 */
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Children Animation
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  ...props
}: HTMLMotionProps<'div'> & { staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hover Scale Animation
 */
export function HoverScale({
  children,
  scale = 1.05,
  ...props
}: HTMLMotionProps<'div'> & { scale?: number }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Rotate In Animation
 */
export function RotateIn({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0, rotate: 10 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide In from Side
 */
export function SlideInFromLeft({
  children,
  delay = 0,
  duration = 0.4,
  distance = 50,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number; distance?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -distance }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -distance }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideInFromRight({
  children,
  delay = 0,
  duration = 0.4,
  distance = 50,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number; distance?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: distance }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: distance }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Blur In Animation
 */
export function BlurIn({
  children,
  delay = 0,
  duration = 0.4,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Bounce In Animation
 */
export function BounceIn({
  children,
  delay = 0,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
