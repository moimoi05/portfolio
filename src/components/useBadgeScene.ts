import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { AnimationPlaybackControls } from 'framer-motion';

export const BADGE_SCENE_DURATION = 9;
const swingTimes = [0, 2.5, 3.45, 4.5, 5.7, 6.9, 8, 9].map(time => time / BADGE_SCENE_DURATION);
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export function useBadgeScene(active: boolean, reducedMotion: boolean, compact: boolean) {
  const animations = useRef<AnimationPlaybackControls[]>([]);
  const releaseVelocity = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const clock = useMotionValue(0);
  const rotationTarget = useTransform(x, [-100, 0, 100], [6, 0, -6]);
  const rotate = useSpring(rotationTarget, { stiffness: 70, damping: 16, mass: 1.3 });
  // Only the strap's interior lags. Its final point always stays on the metal loop.
  const lagX = useSpring(x, { stiffness: 48, damping: 12, mass: 1.1, restDelta: 0.05, restSpeed: 0.05 });
  const lagY = useSpring(y, { stiffness: 42, damping: 13, mass: 1.2, restDelta: 0.05, restSpeed: 0.05 });

  useEffect(() => {
    if (reducedMotion) {
      x.jump(0); y.jump(0); rotate.jump(0); lagX.jump(0); lagY.jump(0); clock.jump(0);
      return;
    }
    if (!active || dragging || paused) return;
    let cancelled = false;
    const velocity = releaseVelocity.current;
    releaseVelocity.current = { x: 0, y: 0 };
    const settle = [
      animate(x, 0, { type: 'spring', stiffness: 52, damping: 12, mass: 1.6, velocity: velocity.x, restDelta: 0.05, restSpeed: 0.05 }),
      animate(y, 0, { type: 'spring', stiffness: 62, damping: 16, mass: 1.6, velocity: velocity.y, restDelta: 0.05, restSpeed: 0.05 }),
    ];
    animations.current = settle;
    void Promise.all(settle).then(() => {
      if (cancelled) return;
      clock.set(0);
      const distance = compact ? 0.4 : 1;
      const loop = { duration: BADGE_SCENE_DURATION, times: swingTimes, ease: 'easeInOut' as const, repeat: Infinity };
      animations.current = [
        animate(clock, BADGE_SCENE_DURATION, { duration: BADGE_SCENE_DURATION, ease: 'linear', repeat: Infinity }),
        animate(x, [0, 0, -60, 27, -10, 3, 0, 0].map(value => value * distance), loop),
        animate(y, [0, 0, -11, -2, -1, 0, 0, 0].map(value => value * distance), loop),
      ];
    });
    return () => { cancelled = true; animations.current.forEach(animation => animation.stop()); };
  }, [active, compact, dragging, paused, reducedMotion, x, y, clock, rotate, lagX, lagY]);

  const startDrag = () => {
    animations.current.forEach(animation => animation.stop());
    clock.set(0);
    setDragging(true);
  };
  const finishDrag = (velocity = { x: 0, y: 0 }) => {
    releaseVelocity.current = { x: clamp(velocity.x, 90), y: clamp(velocity.y, 65) };
    setDragging(false);
  };

  return { x, y, rotate, lagX, lagY, clock, paused, setPaused, startDrag, finishDrag };
}
