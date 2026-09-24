import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { marqueeClips } from '../data/marquee';
import { getMarqueeOffset } from '../lib/motion';

const rows = [marqueeClips.slice(0, 11), marqueeClips.slice(11)];
type Clip = typeof marqueeClips[number];

function ReelTile({ clip, paused }: { clip: Clip; paused: boolean }) {
  const tile = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const inView = useInView(tile, { amount: 0.05 });
  const [failed, setFailed] = useState(false);
  const canAnimate = inView && !paused && !failed && Boolean(clip.video);
  useEffect(() => {
    const video = player.current;
    if (!canAnimate || !video || !clip.video) return;
    let disposed = false;
    video.src = clip.video;
    void video.play().catch(() => { if (!disposed) setFailed(true); });
    return () => {
      disposed = true;
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [canAnimate, clip.video]);
  return (
    <div ref={tile} className="marquee-tile relative h-[270px] w-[420px] shrink-0 overflow-hidden rounded-2xl bg-[#191919]" style={{ contain: 'layout paint' }}>
      <img src={clip.poster} alt="" width="420" height="270" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      {canAnimate && <video ref={player} poster={clip.poster} autoPlay loop muted playsInline preload="none"
        width="420" height="270" className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />}
    </div>
  );
}

export function MarqueeSection() {
  const section = useRef<HTMLElement>(null);
  const firstRow = useRef<HTMLDivElement>(null);
  const secondRow = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(section, { margin: '150px' });
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const motionPaused = Boolean(reducedMotion) || paused || !pageVisible;
  const active = nearViewport && !motionPaused;

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!active) return;
    const element = section.current;
    const first = firstRow.current;
    const second = secondRow.current;
    if (!element || !first || !second) return;
    let frame = 0;
    let needsMeasure = true;
    let geometry = { top: 0, height: 0, firstCycle: 0, secondCycle: 0 };
    const update = () => {
      frame = 0;
      if (needsMeasure) {
        geometry = {
          top: element.getBoundingClientRect().top + window.scrollY,
          height: window.innerHeight,
          firstCycle: (first.scrollWidth + 12) / 2,
          secondCycle: (second.scrollWidth + 12) / 2,
        };
        needsMeasure = false;
      }
      const offset = getMarqueeOffset(window.scrollY, geometry.top, geometry.height) - 200;
      // Two copies are enough to wrap the strip; only transforms change on scroll.
      const wrap = (value: number, cycle: number) => cycle > 0 ? ((value % cycle) + cycle) % cycle - cycle : 0;
      first.style.transform = `translate3d(${wrap(offset, geometry.firstCycle)}px, 0, 0)`;
      second.style.transform = `translate3d(${wrap(-offset, geometry.secondCycle)}px, 0, 0)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => { needsMeasure = true; schedule(); };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    resize.observe(first);
    resize.observe(second);
    resize.observe(document.body);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
    };
  }, [active]);

  return (
    <section ref={section} aria-label="Creative inspiration reel" className="marquee-section overflow-hidden bg-ink pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3" aria-hidden="true">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} ref={rowIndex === 0 ? firstRow : secondRow} className="marquee-row flex w-max gap-3" style={{ willChange: active ? 'transform' : 'auto' }}>
            {[...row, ...row].map((clip, index) => <ReelTile key={`${clip.poster}-${index}`} clip={clip} paused={!active} />)}
          </div>
        ))}
      </div>
      {!reducedMotion && <div className="flex justify-end px-6 pt-5 md:px-10">
        <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="inline-flex min-h-11 items-center gap-2 text-xs font-light uppercase tracking-widest text-mist/70 transition-colors hover:text-mist">
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
          {paused ? 'Play motion' : 'Pause motion'}
        </button>
      </div>}
    </section>
  );
}
