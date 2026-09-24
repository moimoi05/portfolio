import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

function Character({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1]);
  return <span className="relative"><span className="invisible">{char}</span><motion.span className="absolute left-0 top-0" style={{ opacity }}>{char}</motion.span></span>;
}

export function AnimatedText({ text }: { text: string }) {
  const paragraph = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: paragraph, offset: ['start 0.8', 'end 0.2'] });
  let characterIndex = 0;
  return (
    <p ref={paragraph} className="about-copy">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {reducedMotion ? text : text.split(' ').map((word, wordIndex) => {
          const start = characterIndex;
          characterIndex += word.length + 1;
          return <span key={wordIndex}><span className="inline-block whitespace-nowrap">{Array.from(word).map((char, index) => <Character key={index} char={char} index={start + index} total={text.length} progress={scrollYProgress} />)}</span>{' '}</span>;
        })}
      </span>
    </p>
  );
}
