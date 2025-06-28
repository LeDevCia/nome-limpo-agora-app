import React, { useEffect, useRef, useState } from 'react';
import { CountUp } from 'countup.js';

interface ContadorProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

const Contador: React.FC<ContadorProps> = ({
  end,
  prefix = '',
  suffix = '',
  duration = 4,
  decimals = 0,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          const countUp = new CountUp(el, end, {
            duration,
            prefix,
            suffix,
            separator: '.',
            decimalPlaces: decimals,
            decimal: ',',
          });

          if (!countUp.error) {
            countUp.start();
            setHasAnimated(true);
          } else {
            console.error(countUp.error);
          }

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [end, prefix, suffix, duration, decimals, hasAnimated]);

  return <span ref={spanRef} />;
};

export default Contador;
