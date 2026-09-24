import { useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getMagnetOffset } from '../lib/motion';

interface MagnetProps extends PropsWithChildren {
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}

export function Magnet({ children, padding = 150, strength = 3, activeTransition = 'transform 0.3s ease-out', inactiveTransition = 'transform 0.6s ease-in-out' }: MagnetProps) {
  const anchor = useRef<HTMLDivElement>(null);
  const moving = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = moving.current;
    if (!node || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      node.style.transition = inactiveTransition;
      node.style.transform = 'translate3d(0, 0, 0)';
    };
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!anchor.current) return;
        const rect = anchor.current.getBoundingClientRect();
        const offset = getMagnetOffset({ x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, width: rect.width, height: rect.height, padding, strength });
        node.style.transition = offset.active ? activeTransition : inactiveTransition;
        node.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, [padding, strength, activeTransition, inactiveTransition, reducedMotion]);

  return <div ref={anchor}><div ref={moving} style={{ willChange: reducedMotion ? 'auto' : 'transform' }}>{children}</div></div>;
}
