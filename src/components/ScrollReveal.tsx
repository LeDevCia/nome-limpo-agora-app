
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = ''
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const getVariants = (): Variants => {
    const baseVariants: Variants = {
      hidden: {
        opacity: 0
      },
      visible: {
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1] as any
        }
      }
    };

    switch (direction) {
      case 'up':
        baseVariants.hidden = { ...baseVariants.hidden, y: 50 };
        baseVariants.visible = { ...baseVariants.visible, y: 0 };
        break;
      case 'down':
        baseVariants.hidden = { ...baseVariants.hidden, y: -50 };
        baseVariants.visible = { ...baseVariants.visible, y: 0 };
        break;
      case 'left':
        baseVariants.hidden = { ...baseVariants.hidden, x: -50 };
        baseVariants.visible = { ...baseVariants.visible, x: 0 };
        break;
      case 'right':
        baseVariants.hidden = { ...baseVariants.hidden, x: 50 };
        baseVariants.visible = { ...baseVariants.visible, x: 0 };
        break;
      case 'scale':
        baseVariants.hidden = { ...baseVariants.hidden, scale: 0.8 };
        baseVariants.visible = { ...baseVariants.visible, scale: 1 };
        break;
    }

    return baseVariants;
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
