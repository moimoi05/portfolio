import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { contactHref } from '../components/Buttons';
import { ProfileBadge } from '../components/ProfileBadge';
import { HeroBackdrop } from '../components/HeroBackdrop';
import './HeroSection.css';

export function HeroSection() {
  const scrollToContact = () => {
    document.querySelector('.site-footer')?.scrollIntoView({ block: 'start' });
  };

  return (
    <section id="top" className="hero hero--identity" aria-labelledby="hero-title">
      <HeroBackdrop />
      <div className="hero-frame">
        <FadeIn as="header" delay={0} y={-15} className="hero-header">
          <span className="hero-header-mark" aria-hidden="true">NPN</span>
          <nav aria-label="Primary" className="hero-site-nav">
            <a href="#about">About</a><a href="#experiment">Experiment</a><a href="#projects">Projects</a><a href={contactHref}>Contact</a>
          </nav>
        </FadeIn>
        <div className="hero-layout">
          <div className="hero-copy">
            <FadeIn delay={0.12} y={12}><p className="hero-role-label"><span className="hero-role-dot" aria-hidden="true" />AI ENGINEER / SOFTWARE BUILDER</p></FadeIn>
            <FadeIn delay={0.22} y={30}>
              <h1 id="hero-title" className="hero-identity-heading"><span>BUILDING</span><span className="hero-heading-outline">INTELLIGENCE<span className="hero-heading-period">.</span></span></h1>
            </FadeIn>
            <FadeIn delay={0.34} y={20}>
              <p className="hero-intro">I build intelligent software across AI, computer vision, backend systems, and applied research — turning technical ideas into practical products.</p>
            </FadeIn>
            <div className="hero-actions">
              <FadeIn delay={0.44} y={16}><a className="contact-button hero-work-button" href="#projects"><span>View my work</span><ArrowUpRight size={17} aria-hidden="true" /></a></FadeIn>
              <FadeIn delay={0.52} y={16}><button className="live-project-button hero-contact-button" type="button" onClick={scrollToContact}><span>Contact me</span><ArrowUpRight size={17} aria-hidden="true" /></button></FadeIn>
            </div>
          </div>
          <div className="hero-visual"><ProfileBadge /></div>
          <FadeIn delay={0.62} y={16} className="hero-meta">
            <div><strong>PYTHON / GOLANG</strong><span>STACK</span></div>
            <div><strong>AI + BACKEND</strong><span>FOCUS</span></div>
            <div><strong>HANOI, VIETNAM</strong><span>BASED</span></div>
            <ArrowDownRight className="hero-scroll-arrow" size={20} aria-hidden="true" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
