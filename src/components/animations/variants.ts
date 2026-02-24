/**
 * Framer Motion Variants für wiederverwendbare Animationen
 */

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const rotateVariants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 10 },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Transition Configs
 */
export const springTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
};

export const smoothTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.3,
};

export const bouncyTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 17,
};

/**
 * Hover/Tap Animation Configs
 */
export const hoverScaleConfig = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.98 },
  transition: bouncyTransition,
};

export const hoverLiftConfig = {
  whileHover: { y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  whileTap: { y: 0 },
  transition: smoothTransition,
};

export const hoverRotateConfig = {
  whileHover: { rotate: 5 },
  transition: bouncyTransition,
};
