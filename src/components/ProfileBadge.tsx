import { useEffect, useId, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useTransform } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { HeroMascot } from './HeroMascot';
import { useBadgeScene } from './useBadgeScene';
import { useLanguage } from '../context/LanguageContext';

export function ProfileBadge() {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';
  const stage = useRef<HTMLDivElement>(null);
  const tether = useRef<SVGSVGElement>(null);
  const badge = useRef<HTMLDivElement>(null);
  const strapMask = useId();
  const inView = useInView(stage, { margin: '100px' });
  const initialReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [canDrag, setCanDrag] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 360, height: 210, headerHeight: 90 });
  const { x, y, rotate, rotateX, rotateY, lagX, lagY, clock, paused, setPaused, startPress, startDrag, finishDrag } = useBadgeScene(
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
    const pointer = window.matchMedia('(pointer: coarse), (hover: hover) and (pointer: fine)');
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
    const hero = stage.current?.closest<HTMLElement>('.hero');
    const measure = () => {
      let height = 0;
      let parent: HTMLElement | null = badge.current;
      // Offset geometry ignores animated transforms. Read only on layout changes.
      while (parent && parent !== hero) { height += parent.offsetTop; parent = parent.offsetParent as HTMLElement | null; }
      const header = hero?.querySelector<HTMLElement>('.hero-header');
      const headerHeight = header && hero ? header.getBoundingClientRect().bottom - hero.getBoundingClientRect().top : 90;
      const next = { width: element.clientWidth, height: hero ? Math.max(height + 2, 100) : 210, headerHeight };
      setDimensions(previous => previous.width === next.width && previous.height === next.height && previous.headerHeight === next.headerHeight ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (hero) observer.observe(hero);
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stage} className="hero-badge-stage">
      <div className="hero-badge-halo" aria-hidden="true" />
      <motion.div className="hero-badge-entrance"
        initial={reducedMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.9, delay: 0.52, ease: [0.25, 0.1, 0.25, 1] }}>
        <div className="hero-badge-rig">
          <svg ref={tether} className="hero-tether" aria-hidden="true"
            style={{ height: dimensions.height, top: `calc(var(--badge-gap) - ${dimensions.height}px)` }}>
            <defs>
              <linearGradient id={`${strapMask}-fade`} x1="0" x2="0" y1="0" y2={dimensions.headerHeight + 28} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="white" stopOpacity="0.2" /><stop offset="0.72" stopColor="white" stopOpacity="0.25" /><stop offset="1" stopColor="white" />
              </linearGradient>
              <mask id={strapMask} maskUnits="userSpaceOnUse" x="-200" y="-10" width={dimensions.width + 400} height={dimensions.height + 220}>
                <rect x="-200" y="-10" width={dimensions.width + 400} height={dimensions.height + 220} fill={`url(#${strapMask}-fade)`} />
              </mask>
            </defs>
            <g mask={`url(#${strapMask})`}>
            <motion.path d={strapPath} fill="none" stroke="#82718f" strokeWidth="17" strokeLinecap="round" />
            <motion.path d={strapPath} fill="none" stroke="#282331" strokeWidth="14" strokeLinecap="round" />
            <motion.path d={strapPath} fill="none" stroke="#a28ab6" strokeWidth="1" strokeDasharray="2 5" opacity="0.65" />
            </g>
          </svg>
          <motion.div ref={badge} className="hero-badge-body" style={{ x, y, rotate, transformOrigin: '50% 0%' }}
            drag={canDrag && !reducedMotion} dragElastic={0.18} dragMomentum={false}
            dragTransition={{ bounceStiffness: 52, bounceDamping: 12 }}
            dragConstraints={{ top: -48, bottom: 70, left: -75, right: 75 }}
            onPointerDown={event => { if (canDrag && !reducedMotion && event.button === 0) startPress(); }}
            onDragStart={startDrag} onDragEnd={(_, info) => finishDrag(info.velocity)} onPointerCancel={() => finishDrag()}
            whileDrag={{ cursor: 'grabbing' }}>
            <div className="hero-card-connector" aria-hidden="true"><span /><i /></div>
            <motion.div className="hero-id-card" style={{ rotateX, rotateY, transformPerspective: 900, transformOrigin: '50% 0%' }}>
              <img src="/images/NguenPhuongNamv2.webp" alt="Nguyen Phuong Nam" width="1086" height="1448"
                draggable={false} className="hero-id-photo" />
              <div className="hero-id-shade" aria-hidden="true" />
              <div className="hero-id-topline" aria-hidden="true"><span>{isVietnamese ? 'NPN / NHẬN DIỆN' : 'NPN / IDENTITY'}</span><span>01 — 01</span></div>
              <div className="hero-id-identity">
                <span className="hero-id-rule" aria-hidden="true" />
                <p className="hero-id-name">NGUYEN<br />PHUONG NAM</p>
                <p className="hero-id-role">{isVietnamese ? 'KỸ SƯ AI / NHÀ PHÁT TRIỂN PHẦN MỀM' : 'AI ENGINEER / SOFTWARE DEVELOPER'}</p>
              </div>
            </motion.div>
          </motion.div>
          <HeroMascot clock={clock} reducedMotion={Boolean(reducedMotion)} />
          {!reducedMotion && <button type="button" className="hero-scene-control"
            aria-label={paused ? (isVietnamese ? 'Phát hoạt ảnh hero' : 'Play hero animation') : (isVietnamese ? 'Tạm dừng hoạt ảnh hero' : 'Pause hero animation')} aria-pressed={paused}
            onClick={() => setPaused(value => !value)}>
            {paused ? <Play size={11} aria-hidden="true" /> : <Pause size={11} aria-hidden="true" />}
            <span>{paused ? (isVietnamese ? 'Phát' : 'Play') : (isVietnamese ? 'Dừng' : 'Pause')}</span>
          </button>}
        </div>
      </motion.div>
      <span className="hero-badge-side-note" aria-hidden="true">{isVietnamese ? 'HỒ SƠ / 001' : 'PROFILE / 001'}</span>
    </div>
  );
}
