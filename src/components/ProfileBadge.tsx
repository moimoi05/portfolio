import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import type { AnimationPlaybackControls } from 'framer-motion';

export function ProfileBadge() {
  const stage = useRef<HTMLDivElement>(null);
  const tether = useRef<SVGSVGElement>(null);
  const animations = useRef<AnimationPlaybackControls[]>([]);
  const inView = useInView(stage, { margin: '100px' });
  const reducedMotion = useReducedMotion();
  const [canDrag, setCanDrag] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 360, height: 160 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-4, 0, 4]);
  const strapPath = useTransform(() => {
    const dx = x.get();
    const dy = y.get();
    const angle = rotate.get() * Math.PI / 180;
    const anchor = dimensions.width / 2;
    const endX = anchor + dx + 18 * Math.sin(angle);
    const endY = dimensions.height + dy - 18 * Math.cos(angle);
    const bend = dx * 0.24 + Math.sin(dy / 30) * Math.min(16, Math.abs(dy) * 0.4);
    return `M ${anchor} 0 C ${anchor + bend} ${endY * 0.35}, ${endX - bend} ${endY * 0.74}, ${endX} ${endY}`;
  });

  useEffect(() => {
    const pointer = window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
    const updatePointer = () => setCanDrag(pointer.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePointer();
    updateVisibility();
    pointer.addEventListener('change', updatePointer);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      pointer.removeEventListener('change', updatePointer);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    const element = tether.current;
    if (!element) return;
    const measure = () => setDimensions({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !pageVisible || dragging) return;
    if (reducedMotion) { x.set(0); y.set(0); return; }
    let cancelled = false;
    const settle = [
      animate(x, 0, { type: 'spring', stiffness: 210, damping: 17 }),
      animate(y, 0, { type: 'spring', stiffness: 210, damping: 17 }),
    ];
    animations.current = settle;
    void Promise.all(settle).then(() => {
      if (cancelled) return;
      animations.current = [
        animate(x, [0, 7, 0, -7, 0], { duration: 3.4, ease: 'easeInOut', repeat: Infinity }),
        animate(y, [0, -11, 0, 7, 0], { duration: 3.4, ease: 'easeInOut', repeat: Infinity }),
      ];
    });
    return () => { cancelled = true; animations.current.forEach(animation => animation.stop()); };
  }, [dragging, inView, pageVisible, reducedMotion, x, y]);

  const startDrag = () => {
    animations.current.forEach(animation => animation.stop());
    setDragging(true);
  };

  return (
    <div ref={stage} className="hero-badge-stage">
      <div className="hero-badge-halo" aria-hidden="true" />
      <motion.div className="hero-badge-entrance"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 35 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.9, delay: 0.52, ease: [0.25, 0.1, 0.25, 1] }}>
        <div className="hero-badge-rig">
          <svg ref={tether} className="hero-tether" aria-hidden="true">
            <motion.path d={strapPath} fill="none" stroke="#171c21" strokeWidth="15" strokeLinecap="round" />
            <motion.path d={strapPath} fill="none" stroke="#46515b" strokeWidth="11" strokeLinecap="round" />
            <motion.path d={strapPath} fill="none" stroke="#8a98a3" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
          </svg>
          <motion.div className="hero-badge-body" style={{ x, y, rotate, transformOrigin: '50% 0%' }}
            drag={canDrag && !reducedMotion} dragElastic={0.24} dragMomentum={false}
            dragConstraints={{ top: -48, bottom: 70, left: -75, right: 75 }}
            onDragStart={startDrag} onDragEnd={() => setDragging(false)} onPointerCancel={() => setDragging(false)}
            whileDrag={{ cursor: 'grabbing' }}>
            <div className="hero-card-connector" aria-hidden="true"><span /><i /></div>
            <div className="hero-id-card">
              <img src="/images/NguenPhuongNamv2.png" alt="Nguyen Phuong Nam" width="1086" height="1448"
                draggable={false} className="hero-id-photo" />
              <div className="hero-id-shade" aria-hidden="true" />
              <div className="hero-id-topline" aria-hidden="true"><span>NPN / IDENTITY</span><span>01 — 01</span></div>
              <div className="hero-id-identity">
                <span className="hero-id-rule" aria-hidden="true" />
                <p className="hero-id-name">NGUYEN<br />PHUONG NAM</p>
                <p className="hero-id-role">AI ENGINEER / SOFTWARE DEVELOPER</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <span className="hero-badge-side-note" aria-hidden="true">PROFILE / 001</span>
    </div>
  );
}
