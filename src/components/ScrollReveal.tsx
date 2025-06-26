
import React from 'react';
import { motion } from 'framer-motion';
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

  const getVariants = () => {
    const variants = {
      hidden: {},
      visible: {
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1]
        }
      }
    };

    switch (direction) {
      case 'up':
        variants.hidden = { opacity: 0, y: 50 };
        variants.visible = { ...variants.visible, y: 0 };
        break;
      case 'down':
        variants.hidden = { opacity: 0, y: -50 };
        variants.visible = { ...variants.visible, y: 0 };
        break;
      case 'left':
        variants.hidden = { opacity: 0, x: -50 };
        variants.visible = { ...variants.visible, x: 0 };
        break;
      case 'right':
        variants.hidden = { opacity: 0, x: 50 };
        variants.visible = { ...variants.visible, x: 0 };
        break;
      case 'scale':
        variants.hidden = { opacity: 0, scale: 0.8 };
        variants.visible = { ...variants.visible, scale: 1 };
        break;
    }

    return variants;
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
