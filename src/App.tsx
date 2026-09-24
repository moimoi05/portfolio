import { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MotionConfig } from 'framer-motion';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ExperimentSection } from './sections/ExperimentSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { contactHref } from './components/Buttons';
import { MarqueeSection } from './sections/MarqueeSection';
import { CvPage } from './sections/CvPage';

export default function App() {
  useEffect(() => {
    const migrateSection = () => {
      if (window.location.hash !== '#services') return;
      window.history.replaceState(null, '', '#experiment');
      document.getElementById('experiment')?.scrollIntoView({ behavior: 'instant' });
    };
    migrateSection();
    window.addEventListener('hashchange', migrateSection);
    return () => window.removeEventListener('hashchange', migrateSection);
  }, []);

  if (/^\/cv\/?$/.test(window.location.pathname)) return <CvPage />;

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#about">Skip to content</a>
      <main className="overflow-x-clip bg-ink">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ExperimentSection />
        <ProjectsSection />
        <footer className="site-footer">
          <span>Nam © {new Date().getFullYear()}</span>
          <a href={contactHref}>Let&apos;s build something <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="#top">Back to top ↑</a>
        </footer>
      </main>
    </MotionConfig>
  );
}
