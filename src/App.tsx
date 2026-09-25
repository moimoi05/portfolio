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
import { PortfolioAssistant } from './components/PortfolioAssistant';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function PortfolioPage() {
  const { language } = useLanguage();

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#about">{language === 'vi' ? 'Bỏ qua đến nội dung' : 'Skip to content'}</a>
      <main className="overflow-x-clip bg-ink" lang={language}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ExperimentSection />
        <ProjectsSection />
        <footer className="site-footer">
          <span>Nam © {new Date().getFullYear()}</span>
          <a href={contactHref}>{language === 'vi' ? 'Cùng xây dựng điều gì đó' : 'Let’s build something'} <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="#top">{language === 'vi' ? 'Lên đầu trang ↑' : 'Back to top ↑'}</a>
        </footer>
      </main>
      <PortfolioAssistant />
    </MotionConfig>
  );
}

export default function App() {
  useEffect(() => {
    const migrateSection = () => {
      if (window.location.hash !== '#services' && window.location.hash !== '#experiment') return;
      window.history.replaceState(null, '', '#experience');
      document.getElementById('experience')?.scrollIntoView({ behavior: 'instant' });
    };
    migrateSection();
    window.addEventListener('hashchange', migrateSection);
    return () => window.removeEventListener('hashchange', migrateSection);
  }, []);

  return (
    <LanguageProvider>
      {/^\/cv\/?$/.test(window.location.pathname) ? <CvPage /> : <PortfolioPage />}
    </LanguageProvider>
  );
}
