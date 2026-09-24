import { ArrowUpRight } from 'lucide-react';
import { ContactButton } from '../components/Buttons';
import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';

const experience = [
  { role: 'AI Intern · Dec 2025 — Jul 2026', place: 'Viettel High Tech', detail: 'UAV Perception and Navigation Department. Thermal and infrared target detection, with X-Plane 11 camera simulation and aerial environment integration.' },
  { role: 'Junior Software Developer · Dec 2025 — Sep 2026', place: 'Central Military Hospital 108', detail: 'Backend systems with Golang and SQL, REST APIs, real-time communication, and a Gemini-powered RAG chatbot for medical supply management in the Equipment Department.' },
  { role: 'Undergraduate Thesis Researcher · Present', place: 'AVITECH · VNU-UET', detail: 'Deep learning for Alzheimer’s disease prognosis using multimodal and longitudinal data to study progression over time.' },
] as const;
const technologies = ['Python', 'Golang', 'PyTorch', 'Scikit-learn', 'Hugging Face', 'YOLOv8', 'Transformers', 'NumPy', 'SQL', 'NoSQL', 'Docker', 'CI/CD'];
const decorations = ['moon', 'lego', 'sculpture', 'ribbon'];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="about-section">
      <div className="section-eyebrow"><span>Nguyen Phuong Nam</span><span>Hanoi, Vietnam</span></div>
      <div className="about-stage">
        <div className="about-decorations" aria-hidden="true">{decorations.map(name => <img key={name} className={`about-object about-object-${name}`} src={`/images/${name}.png`} alt="" loading="lazy" decoding="async" />)}</div>
        <FadeIn y={35}><h2 id="about-title" className="hero-heading section-heading">About me</h2></FadeIn>
        <div className="about-editorial">
          <AnimatedText text="I’m Nguyen Phuong Nam, an AI engineering student and software builder based in Hanoi. I work across machine learning, computer vision, backend systems, and applied healthcare research." />
          <FadeIn className="about-secondary"><p>From UAV perception to healthcare software, I turn technical ideas into practical systems. My current research explores Alzheimer’s progression over time and AI for rehabilitation.</p><div className="about-actions"><ContactButton /><a className="live-project-button" href="/cv">View CV <ArrowUpRight size={17} aria-hidden="true" /></a></div></FadeIn>
        </div>
      </div>
      <FadeIn className="education-panel">
        <div className="education-school"><span className="fact-label">Education / 2023 — expected 2026</span><a href="https://uet.edu.vn/" target="_blank" rel="noopener noreferrer">University of Engineering and Technology – Vietnam National University, Hanoi <ArrowUpRight size={20} aria-hidden="true" /></a></div>
        <div><span className="fact-label">Major</span><p>Artificial Intelligence</p></div>
        <div><span className="fact-label">GPA</span><p className="education-gpa">3.28</p></div>
      </FadeIn>
      <div className="research-affiliation"><span className="fact-label">Research lab</span><a href="https://avitechresearch.vn/" target="_blank" rel="noopener noreferrer">AVITECH Research Group <ArrowUpRight size={16} aria-hidden="true" /></a><a href="https://avitechresearch.vn/nguyen-phuong-nam/" target="_blank" rel="noopener noreferrer">My research profile <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      <div className="experience-list" aria-label="Applied experience">{experience.map((item, index) => <FadeIn key={item.place} delay={index * 0.08} className="experience-item"><span className="experience-role">{item.role}</span><h3>{item.place}</h3><p>{item.detail}</p></FadeIn>)}</div>
      <p className="research-collaboration">Currently researching AI for rehabilitation in collaboration with the Department of Rehabilitation, Central Military Hospital 108.</p>
      <FadeIn className="toolkit"><p className="section-eyebrow">Working toolkit</p><ul aria-label="Technologies">{technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></FadeIn>
    </section>
  );
}
