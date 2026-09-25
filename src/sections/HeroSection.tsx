import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { contactHref } from '../components/Buttons';
import { ProfileBadge } from '../components/ProfileBadge';
import { HeroBackdrop } from '../components/HeroBackdrop';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import './HeroSection.css';

export function HeroSection() {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';

  return (
    <section id="top" className="hero hero--identity" aria-labelledby="hero-title">
      <HeroBackdrop />
      <div className="hero-frame">
        <FadeIn as="header" delay={0} y={-15} className="hero-header">
          <span className="hero-header-mark" aria-hidden="true">NPN</span>
          <div className="hero-header-controls">
            <nav aria-label={isVietnamese ? 'Điều hướng chính' : 'Primary'} className="hero-site-nav">
              <a href="#about">{isVietnamese ? 'Giới thiệu' : 'About'}</a><a href="#experience">{isVietnamese ? 'Kinh nghiệm' : 'Experience'}</a><a href="#projects">{isVietnamese ? 'Dự án' : 'Projects'}</a><a href={contactHref}>{isVietnamese ? 'Liên hệ' : 'Contact'}</a>
            </nav>
            <LanguageSwitcher />
          </div>
        </FadeIn>
        <div className="hero-layout">
          <div className="hero-copy">
            <FadeIn delay={0.12} y={12}><p className="hero-role-label"><span className="hero-role-dot" aria-hidden="true" />{isVietnamese ? 'KỸ SƯ AI / NHÀ PHÁT TRIỂN PHẦN MỀM' : 'AI ENGINEER / SOFTWARE BUILDER'}</p></FadeIn>
            <FadeIn delay={0.22} y={30}>
              <h1 id="hero-title" className="hero-identity-heading">{isVietnamese ? <><span>KIẾN TẠO</span><span className="hero-heading-outline">TRÍ TUỆ<span className="hero-heading-period">.</span></span></> : <><span>BUILDING</span><span className="hero-heading-outline">INTELLIGENCE<span className="hero-heading-period">.</span></span></>}</h1>
            </FadeIn>
            <FadeIn delay={0.34} y={20}>
              <p className="hero-intro">{isVietnamese ? 'Tôi xây dựng phần mềm thông minh trong các lĩnh vực AI, thị giác máy tính, hệ thống backend và nghiên cứu ứng dụng — biến ý tưởng kỹ thuật thành sản phẩm thực tế.' : 'I build intelligent software across AI, computer vision, backend systems, and applied research — turning technical ideas into practical products.'}</p>
            </FadeIn>
            <div className="hero-actions">
              <FadeIn delay={0.44} y={16}><a className="contact-button hero-work-button" href="#projects"><span>{isVietnamese ? 'Xem dự án' : 'View my work'}</span><ArrowUpRight size={17} aria-hidden="true" /></a></FadeIn>
              <FadeIn delay={0.52} y={16}><a className="live-project-button hero-contact-button" href={contactHref}><span>{isVietnamese ? 'Liên hệ' : 'Contact me'}</span><ArrowUpRight size={17} aria-hidden="true" /></a></FadeIn>
            </div>
          </div>
          <div className="hero-visual"><ProfileBadge /></div>
          <FadeIn delay={0.62} y={16} className="hero-meta">
            <div><strong>PYTHON / GOLANG</strong><span>{isVietnamese ? 'CÔNG NGHỆ' : 'STACK'}</span></div>
            <div><strong>AI + BACKEND</strong><span>{isVietnamese ? 'TRỌNG TÂM' : 'FOCUS'}</span></div>
            <div><strong>{isVietnamese ? 'HÀ NỘI, VIỆT NAM' : 'HANOI, VIETNAM'}</strong><span>{isVietnamese ? 'NƠI LÀM VIỆC' : 'BASED'}</span></div>
            <ArrowDownRight className="hero-scroll-arrow" size={20} aria-hidden="true" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
