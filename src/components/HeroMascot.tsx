import { useId } from 'react';
import { cubicBezier, motion, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

const softEase = cubicBezier(0.4, 0, 0.2, 1);

export function HeroMascot({ clock, reducedMotion }: { clock: MotionValue<number>; reducedMotion: boolean }) {
  const metalId = useId();
  const bodyX = useTransform(clock, [0, 1.8, 2.2, 2.48, 2.65, 2.9, 4.4, 4.85, 6.3, 6.85, 9], [0, 0, -2, 3, -7, 0, 0, 5, 5, 0, 0], { ease: softEase });
  const bodyY = useTransform(clock, [0, 0.7, 1.15, 1.5, 1.8, 2.48, 2.65, 2.9, 4.4, 4.7, 4.94, 5.17, 6.3, 6.6, 6.85, 9], [0, -1, -3, 0, -2, 2, -1, 0, 0, -13, -7, -9, -9, -16, 0, 0], { ease: softEase });
  const bodyAngle = useTransform(clock, [0, 1.8, 2.2, 2.48, 2.65, 2.9, 4.4, 4.62, 4.88, 5.06, 5.2, 6.3, 6.85, 9], [0, 0, -6, 5, -10, 0, 0, 34, 82, 74, 82, 82, 0, 0], { ease: softEase });
  const squash = useTransform(clock, [0, 2.2, 2.48, 2.65, 2.9, 4.4, 4.65, 5.2, 6.3, 6.65, 6.85, 9], [1, 1, 0.94, 1.035, 1, 1, 1.03, 1, 1, 0.94, 1, 1], { ease: softEase });
  const wave = useTransform(clock, [0, 0.7, 0.95, 1.15, 1.35, 1.55, 1.75, 1.95, 4.4, 4.8, 6.3, 6.85, 9], [0, 0, -128, -153, -112, -151, -116, 0, 0, -65, -65, 0, 0], { ease: softEase });
  const push = useTransform(clock, [0, 2.15, 2.48, 2.65, 2.9, 4.4, 4.8, 6.3, 6.85, 9], [0, 0, -48, 62, 0, 0, 42, 42, 0, 0], { ease: softEase });
  const look = useTransform(clock, [0, 1.75, 2.15, 4.25, 4.45, 6.65, 6.85, 9], [0, 0, -3, -3, 0, 0, 0, 0], { ease: softEase });
  const normalEyes = useTransform(clock, [0, 4.35, 4.44, 6.5, 6.75, 9], [1, 1, 0, 0, 1, 1]);
  const surprisedEyes = useTransform(clock, [0, 4.35, 4.44, 4.95, 5.1, 9], [0, 0, 1, 1, 0, 0]);
  const dizzy = useTransform(clock, [0, 4.95, 5.12, 6.35, 6.6, 9], [0, 0, 1, 1, 0, 0]);
  const sparkleTurn = useTransform(clock, [5, 6.5], [-12, 18]);
  const impact = useTransform(clock, [0, 2.5, 2.64, 2.83, 4.37, 4.49, 4.7, 9], [0, 0, 1, 0, 0, 1, 0, 0]);

  return (
    <div className="hero-mascot" aria-hidden="true">
      <svg viewBox="0 0 150 140" fill="none" className="hero-mascot-art">
        <defs><linearGradient id={metalId} x1="24" y1="24" x2="84" y2="110" gradientUnits="userSpaceOnUse"><stop stopColor="#e0e8ee" /><stop offset="0.5" stopColor="#a5b4c0" /><stop offset="1" stopColor="#536472" /></linearGradient></defs>
        <path d="M17 125H144" stroke="#aebcc7" strokeOpacity=".15" strokeLinecap="round" />
        <ellipse cx="68" cy="126" rx="36" ry="4" fill="#070a0d" opacity=".55" />
        <motion.g className="hero-mascot-body" style={{ x: reducedMotion ? 0 : bodyX, y: reducedMotion ? 0 : bodyY, rotate: reducedMotion ? 0 : bodyAngle, scaleY: reducedMotion ? 1 : squash, originX: '52px', originY: '116px', transformBox: 'view-box' }}>
          <path d="M41 102V116M63 102V116" stroke="#596b78" strokeWidth="9" strokeLinecap="round" />
          <rect x="30" y="114" width="20" height="9" rx="4.5" fill="#bdcbd4" /><rect x="57" y="114" width="20" height="9" rx="4.5" fill="#bdcbd4" />
          <rect x="28" y="66" width="48" height="40" rx="18" fill={`url(#${metalId})`} stroke="#d7e2ea" strokeOpacity=".45" />
          <rect x="39" y="81" width="26" height="15" rx="7" fill="#34424d" /><path d="M46 89h4m4 0h4" stroke="#c5d5df" strokeWidth="2" strokeLinecap="round" />
          <motion.g style={{ rotate: reducedMotion ? 0 : push, originX: '29px', originY: '77px', transformBox: 'view-box' }}><path d="M29 77L16 88" stroke="#9dafbd" strokeWidth="10" strokeLinecap="round" /><circle cx="15" cy="89" r="6.5" fill="#d1dce4" /></motion.g>
          <motion.g className="hero-mascot-wave" style={{ rotate: reducedMotion ? -125 : wave, originX: '74px', originY: '77px', transformBox: 'view-box' }}><path d="M74 77L85 94" stroke="#9dafbd" strokeWidth="10" strokeLinecap="round" /><circle cx="86" cy="95" r="7" fill="#d1dce4" /><path d="M87 91v5" stroke="#879cab" strokeWidth="1.5" strokeLinecap="round" /></motion.g>
          <path d="M52 24V15" stroke="#95a8b7" strokeWidth="3" /><circle cx="52" cy="12" r="4" fill="#c4d6e1" />
          <rect x="19" y="24" width="66" height="50" rx="20" fill={`url(#${metalId})`} stroke="#e0e8ee" strokeOpacity=".55" />
          <rect x="25" y="34" width="54" height="27" rx="13.5" fill="#15212a" />
          <motion.g style={{ x: reducedMotion ? 0 : look, opacity: reducedMotion ? 1 : normalEyes }}><ellipse cx="41" cy="46" rx="5" ry="6" fill="#d7e7f1" /><ellipse cx="64" cy="46" rx="5" ry="6" fill="#d7e7f1" /><path d="M48 55q4 3 8 0" stroke="#9db6c6" strokeWidth="1.5" strokeLinecap="round" /></motion.g>
          <motion.g style={{ opacity: reducedMotion ? 0 : surprisedEyes }}><circle cx="41" cy="46" r="7" stroke="#d7e7f1" strokeWidth="2" /><circle cx="64" cy="46" r="7" stroke="#d7e7f1" strokeWidth="2" /><ellipse cx="52" cy="57" rx="3" ry="2.5" fill="#d7e7f1" /></motion.g>
          <motion.g style={{ opacity: reducedMotion ? 0 : dizzy }} stroke="#d7e7f1" strokeWidth="2" strokeLinecap="round"><path d="m37 42 8 8m0-8-8 8m23-8 8 8m0-8-8 8" /></motion.g>
          <path d="M29 29q5-3 12-3" stroke="#f0f4f7" strokeOpacity=".6" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        <motion.g style={{ opacity: reducedMotion ? 0 : impact }} stroke="#d7e2ea" strokeWidth="1.5" strokeLinecap="round"><path d="M10 76 4 72M10 84H2M12 91l-5 4" /></motion.g>
        <motion.g style={{ opacity: reducedMotion ? 0 : dizzy, rotate: sparkleTurn, originX: '114px', originY: '67px', transformBox: 'view-box' }} stroke="#c6d5df" strokeWidth="1.2"><path d="m103 60 1-4 1 4 4 1-4 1-1 4-1-4-4-1zM129 69l1-3 1 3 3 1-3 1-1 3-1-3-3-1z" /><circle cx="119" cy="54" r="1.7" /></motion.g>
      </svg>
    </div>
  );
}
