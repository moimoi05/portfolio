import { cubicBezier, motion, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import './HeroMascot.css';

const softEase = cubicBezier(0.4, 0, 0.2, 1);
// Switch rendered poses cleanly; crossfading silhouettes makes the robot look doubled.
const poseEase = (progress: number) => progress < 0.5 ? 0 : 1;

export function HeroMascot({ clock, reducedMotion }: { clock: MotionValue<number>; reducedMotion: boolean }) {
  const bodyX = useTransform(clock, [0, 1.8, 2.2, 2.48, 2.65, 2.9, 4.4, 4.85, 6.3, 6.85, 9], [0, 0, -2, 3, -7, 0, 0, -20, -20, 0, 0], { ease: softEase });
  const bodyY = useTransform(clock, [0, 0.7, 1.15, 1.5, 1.8, 2.48, 2.65, 2.9, 4.4, 4.7, 4.94, 5.17, 6.3, 6.6, 6.85, 9], [0, -1, -3, 0, -2, 2, -1, 0, 0, -13, -7, -9, -9, -16, 0, 0], { ease: softEase });
  const bodyAngle = useTransform(clock, [0, 1.8, 2.2, 2.48, 2.65, 2.9, 4.4, 4.62, 4.88, 5.06, 5.2, 6.3, 6.85, 9], [0, 0, -6, 5, -10, 0, 0, 34, 82, 74, 82, 82, 0, 0], { ease: softEase });
  const squash = useTransform(clock, [0, 2.2, 2.48, 2.65, 2.9, 4.4, 4.65, 5.2, 6.3, 6.65, 6.85, 9], [1, 1, 0.96, 1.02, 1, 1, 1.02, 1, 1, 0.96, 1, 1], { ease: softEase });
  const greeting = useTransform(clock, [0, 0.7, 1, 1.2, 1.4, 1.6, 1.85, 9], [0, 0, -3, 2, -3, 2, 0, 0], { ease: softEase });
  const idle = useTransform(clock, [0, 0.6, 0.78, 6.7, 6.95, 9], [1, 1, 0, 0, 1, 1], { ease: poseEase });
  const wave = useTransform(clock, [0, 0.6, 0.78, 1.88, 2.06, 9], [0, 0, 1, 1, 0, 0], { ease: poseEase });
  const windup = useTransform(clock, [0, 1.88, 2.06, 2.46, 2.64, 2.88, 3.05, 4.28, 4.44, 9], [0, 0, 1, 1, 0, 0, 1, 1, 0, 0], { ease: poseEase });
  const push = useTransform(clock, [0, 2.46, 2.64, 2.88, 3.05, 9], [0, 0, 1, 1, 0, 0], { ease: poseEase });
  const surprised = useTransform(clock, [0, 4.28, 4.44, 5, 5.15, 9], [0, 0, 1, 1, 0, 0], { ease: poseEase });
  const dizzy = useTransform(clock, [0, 5, 5.15, 6.7, 6.95, 9], [0, 0, 1, 1, 0, 0], { ease: poseEase });
  const impact = useTransform(clock, [0, 2.5, 2.64, 2.83, 4.37, 4.49, 4.7, 9], [0, 0, 1, 0, 0, 1, 0, 0]);
  const sparkleTurn = useTransform(clock, [5, 6.5], [-12, 18]);

  return (
    <div className="hero-mascot" aria-hidden="true">
      <div className="hero-mascot-ground" />
      <motion.div className="hero-mascot-body" style={{ x: reducedMotion ? 0 : bodyX, y: reducedMotion ? 0 : bodyY, rotate: reducedMotion ? 0 : bodyAngle, scaleY: reducedMotion ? 1 : squash, transformOrigin: '50% 91%' }}>
        <motion.div className="hero-mascot-pose hero-mascot-idle" style={{ opacity: reducedMotion ? 0 : idle }} />
        <motion.div className="hero-mascot-pose hero-mascot-wave" style={{ opacity: reducedMotion ? 1 : wave, rotate: reducedMotion ? 0 : greeting, transformOrigin: '50% 91%' }} />
        <motion.div className="hero-mascot-pose hero-mascot-windup" style={{ opacity: reducedMotion ? 0 : windup }} />
        <motion.div className="hero-mascot-pose hero-mascot-push" style={{ opacity: reducedMotion ? 0 : push }} />
        <motion.div className="hero-mascot-pose hero-mascot-surprised" style={{ opacity: reducedMotion ? 0 : surprised }} />
        <motion.div className="hero-mascot-pose hero-mascot-dizzy" style={{ opacity: reducedMotion ? 0 : dizzy }} />
      </motion.div>
      <motion.svg className="hero-mascot-impact" viewBox="0 0 32 40" style={{ opacity: reducedMotion ? 0 : impact }} fill="none" stroke="#debbff" strokeWidth="3" strokeLinecap="round"><path d="M22 12 15 3M12 22 2 19M17 33l-8 5" /></motion.svg>
      <motion.svg className="hero-mascot-stars" viewBox="0 0 64 48" style={{ opacity: reducedMotion ? 0 : dizzy, rotate: sparkleTurn }} fill="none" stroke="#dec6ff" strokeWidth="1.5"><path d="m15 17 2-7 2 7 7 2-7 2-2 7-2-7-7-2zM47 30l2-5 2 5 5 2-5 2-2 5-2-5-5-2z" /><circle cx="37" cy="8" r="2" /></motion.svg>
    </div>
  );
}
