
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={fadeInVariants}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={scaleInVariants}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerChildren = ({ children, className = '' }: { children: ReactNode, className?: string }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerChildrenVariants}
    className={className}
  >
    {children}
  </motion.div>
);
