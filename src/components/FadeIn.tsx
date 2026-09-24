import { useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FadeInProps extends PropsWithChildren {
  as?: 'div' | 'header' | 'li';
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}

export function FadeIn({ as = 'div', children, className, style, delay = 0, duration = 0.7, x = 0, y = 30 }: FadeInProps) {
  const reducedMotion = useReducedMotion();
  const Component = useMemo(() => motion.create(as), [as]);
  return (
    <Component className={className} style={style}
      initial={reducedMotion ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration: reducedMotion ? 0 : duration, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </Component>
  );
}
