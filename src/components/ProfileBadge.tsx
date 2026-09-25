import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useTransform } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { HeroMascot } from './HeroMascot';
import { useBadgeScene } from './useBadgeScene';

export function ProfileBadge() {
  const stage = useRef<HTMLDivElement>(null);
  const tether = useRef<SVGSVGElement>(null);
  const inView = useInView(stage, { margin: '100px' });
  const initialReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [canDrag, setCanDrag] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 360, height: 160 });
  const { x, y, rotate, lagX, lagY, clock, paused, setPaused, startDrag, finishDrag } = useBadgeScene(
    inView && pageVisible, Boolean(reducedMotion), dimensions.width < 350,
  );
  const strapPath = useTransform(() => {
    const dx = x.get();
    const dy = y.get();
    const angle = rotate.get() * Math.PI / 180;
    const anchor = dimensions.width / 2;
    const endX = anchor + dx + 18 * Math.sin(angle);
    const endY = dimensions.height + dy - 18 * Math.cos(angle);
    const lag = Math.max(-34, Math.min(34, lagX.get() - dx));
    const verticalLag = Math.max(-24, Math.min(24, lagY.get() - dy));
    const slack = (Math.max(0, verticalLag) * 0.3 + Math.max(0, -dy) * 0.12) * (dx < 0 ? -1 : 1);
    const upperX = anchor + dx * 0.18 + lag * 0.45 + slack;
    const lowerX = anchor + dx * 0.78 + lag * 0.5 + slack;
    return `M ${anchor} 0 C ${upperX} ${endY * 0.34 + Math.abs(verticalLag) * 0.1}, ${lowerX} ${endY * 0.74 + verticalLag * 0.15}, ${endX} ${endY}`;
  });

  useEffect(() => {
    const pointer = window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    const updatePointer = () => setCanDrag(pointer.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePointer();
    updateVisibility();
    pointer.addEventListener('change', updatePointer);
    motionPreference.addEventListener('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      pointer.removeEventListener('change', updatePointer);
      motionPreference.removeEventListener('change', updateMotionPreference);
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

  return (
    <div ref={stage} className="hero-badge-stage">
      <div className="hero-badge-halo" aria-hidden="true" />
      <motion.div className="hero-badge-entrance"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 35 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.9, delay: 0.52, ease: [0.25, 0.1, 0.25, 1] }}>
        <div className="hero-badge-rig">
          <svg ref={tether} className="hero-tether" aria-hidden="true">
            <motion.path d={strapPath} fill="none" stroke="#82718f" strokeWidth="17" strokeLinecap="round" />
            <motion.path d={strapPath} fill="none" stroke="#282331" strokeWidth="14" strokeLinecap="round" />
            <motion.path d={strapPath} fill="none" stroke="#a28ab6" strokeWidth="1" strokeDasharray="2 5" opacity="0.65" />
          </svg>
          <motion.div className="hero-badge-body" style={{ x, y, rotate, transformOrigin: '50% 0%' }}
            drag={canDrag && !reducedMotion} dragElastic={0.18} dragMomentum={false}
            dragTransition={{ bounceStiffness: 52, bounceDamping: 12 }}
            dragConstraints={{ top: -48, bottom: 70, left: -75, right: 75 }}
            onPointerDown={() => { if (canDrag && !reducedMotion) startDrag(); }}
            onDragStart={startDrag} onDragEnd={(_, info) => finishDrag(info.velocity)} onPointerCancel={() => finishDrag()}
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
          <HeroMascot clock={clock} reducedMotion={Boolean(reducedMotion)} />
          {!reducedMotion && <button type="button" className="hero-scene-control"
            aria-label={paused ? 'Play hero animation' : 'Pause hero animation'} aria-pressed={paused}
            onClick={() => setPaused(value => !value)}>
            {paused ? <Play size={11} aria-hidden="true" /> : <Pause size={11} aria-hidden="true" />}
            <span>{paused ? 'Play' : 'Pause'}</span>
          </button>}
        </div>
      </motion.div>
      <span className="hero-badge-side-note" aria-hidden="true">PROFILE / 001</span>
    </div>
  );
}
