import { ArrowUpRight } from 'lucide-react';
import { ContactButton } from '../components/Buttons';
import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { TechnologyLinks } from '../components/TechnologyLinks';
import { useLanguage } from '../context/LanguageContext';

const experience = {
  en: [
    { role: 'AI Intern · Dec 2025 — Jul 2026', place: 'Viettel High Tech', logo: 'viettel-high-tech.svg', detail: 'UAV Perception and Navigation Department. Thermal and infrared target detection, with X-Plane 11 camera simulation and aerial environment integration.' },
    { role: 'Junior Software Developer · Dec 2025 — Sep 2026', place: 'Central Military Hospital 108', logo: 'hospital-108.jpg', detail: 'Backend systems with Golang and SQL, REST APIs, real-time communication, and a Gemini-powered RAG chatbot for medical supply management in the Equipment Department.' },
    { role: 'Undergraduate Thesis Researcher · Present', place: 'AVITECH · VNU-UET', logo: 'avitech.png', detail: 'Deep learning for Alzheimer’s disease prognosis using multimodal and longitudinal data to study progression over time.' },
  ],
  vi: [
    { role: 'Thực tập sinh AI · 12/2025 — 07/2026', place: 'Viettel High Tech', logo: 'viettel-high-tech.svg', detail: 'Phòng Thị giác và Định vị UAV. Nghiên cứu phát hiện mục tiêu từ ảnh nhiệt và hồng ngoại, mô phỏng camera trên X-Plane 11 và tích hợp vào môi trường bay mô phỏng.' },
    { role: 'Lập trình viên phần mềm · 12/2025 — 09/2026', place: 'Central Military Hospital 108', logo: 'hospital-108.jpg', detail: 'Phát triển backend bằng Golang và SQL, REST API, giao tiếp thời gian thực và chatbot RAG tích hợp Gemini cho hệ thống quản lý vật tư y tế tại Phòng Trang thiết bị.' },
    { role: 'Nghiên cứu sinh viên · Hiện tại', place: 'AVITECH · VNU-UET', logo: 'avitech.png', detail: 'Ứng dụng học sâu vào dự báo tiến triển bệnh Alzheimer, khai thác dữ liệu đa phương thức và dữ liệu theo thời gian.' },
  ],
} as const;
const decorations = ['moon', 'lego', 'sculpture', 'ribbon'];

export function AboutSection() {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';

  return (
    <section id="about" aria-labelledby="about-title" className="about-section">
      <div className="section-eyebrow"><span>Nguyen Phuong Nam</span><span>{isVietnamese ? 'Hà Nội, Việt Nam' : 'Hanoi, Vietnam'}</span></div>
      <div className="about-stage">
        <div className="about-decorations" aria-hidden="true">{decorations.map(name => <img key={name} className={`about-object about-object-${name}`} src={`/images/${name}.png`} alt="" loading="lazy" decoding="async" />)}</div>
        <FadeIn y={35}><h2 id="about-title" className="hero-heading section-heading">{isVietnamese ? 'Giới thiệu' : 'About me'}</h2></FadeIn>
        <div className="about-editorial">
          <AnimatedText text={isVietnamese ? 'Tôi là Nguyễn Phương Nam, sinh viên ngành Trí tuệ nhân tạo và nhà phát triển phần mềm tại Hà Nội. Tôi làm việc trong các lĩnh vực học máy, thị giác máy tính, hệ thống backend và nghiên cứu y tế ứng dụng.' : 'I’m Nguyen Phuong Nam, an AI engineering student and software builder based in Hanoi. I work across machine learning, computer vision, backend systems, and applied healthcare research.'} />
          <FadeIn className="about-secondary"><p>{isVietnamese ? 'Từ thị giác UAV đến phần mềm y tế, tôi biến ý tưởng kỹ thuật thành các hệ thống thiết thực. Nghiên cứu hiện tại của tôi tìm hiểu tiến triển Alzheimer theo thời gian và ứng dụng AI trong phục hồi chức năng.' : 'From UAV perception to healthcare software, I turn technical ideas into practical systems. My current research explores Alzheimer’s progression over time and AI for rehabilitation.'}</p><div className="about-actions"><ContactButton label={isVietnamese ? 'Liên hệ' : 'Contact Me'} /><a className="live-project-button" href="/cv">{isVietnamese ? 'Xem CV' : 'View CV'} <ArrowUpRight size={17} aria-hidden="true" /></a></div></FadeIn>
        </div>
      </div>
      <FadeIn className="education-panel">
        <div className="education-school"><span className="fact-label">{isVietnamese ? 'Học vấn / 2023 — dự kiến 2026' : 'Education / 2023 — expected 2026'}</span><a href="https://uet.edu.vn/" target="_blank" rel="noopener noreferrer">University of Engineering and Technology – Vietnam National University, Hanoi <ArrowUpRight size={20} aria-hidden="true" /></a></div>
        <div><span className="fact-label">{isVietnamese ? 'Ngành học' : 'Major'}</span><p>{isVietnamese ? 'Trí tuệ nhân tạo' : 'Artificial Intelligence'}</p></div>
        <div><span className="fact-label">GPA</span><p className="education-gpa">3.28</p></div>
      </FadeIn>
      <div className="research-affiliation"><span className="fact-label">{isVietnamese ? 'Nhóm nghiên cứu' : 'Research lab'}</span><a href="https://avitechresearch.vn/" target="_blank" rel="noopener noreferrer">AVITECH Research Group <ArrowUpRight size={16} aria-hidden="true" /></a><a href="https://avitechresearch.vn/nguyen-phuong-nam/" target="_blank" rel="noopener noreferrer">{isVietnamese ? 'Hồ sơ nghiên cứu' : 'My research profile'} <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      <div className="experience-list" aria-label={isVietnamese ? 'Kinh nghiệm ứng dụng' : 'Applied experience'}>{experience[language].map((item, index) => <FadeIn key={item.place} delay={index * 0.08} className="experience-item"><span className="experience-role">{item.role}</span><h3 className="experience-company"><span className="experience-logo" aria-hidden="true"><img src={`/images/companies/${item.logo}`} alt="" width="60" height="44" loading="lazy" decoding="async" /></span><span>{item.place}</span></h3><p>{item.detail}</p></FadeIn>)}</div>
      <p className="research-collaboration">{isVietnamese ? 'Hiện đang nghiên cứu ứng dụng AI trong phục hồi chức năng, phối hợp cùng Khoa Phục hồi chức năng, Bệnh viện Trung ương Quân đội 108.' : 'Currently researching AI for rehabilitation in collaboration with the Department of Rehabilitation, Central Military Hospital 108.'}</p>
      <FadeIn className="toolkit">
        <p className="section-eyebrow">{isVietnamese ? 'Bộ công cụ' : 'Working toolkit'}</p>
        <TechnologyLinks />
      </FadeIn>
    </section>
  );
}
