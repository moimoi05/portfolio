import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';

const pdf = '/cv/CV_Nguyen_Phuong_Nam.pdf';

export function CvPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'CV — Nguyen Phuong Nam';
    return () => { document.title = previousTitle; };
  }, []);
  return (
    <main className="cv-page">
      <a className="cv-back" href="/#about"><ArrowLeft size={18} aria-hidden="true" /> Back to portfolio</a>
      <header className="cv-header">
        <div><p className="section-eyebrow">Curriculum vitae</p><h1 className="hero-heading">Nguyen Phuong Nam</h1><p>Artificial Intelligence · University of Engineering and Technology, VNU Hanoi</p></div>
        <div className="cv-actions">
          <a className="live-project-button" href={pdf} target="_blank" rel="noopener noreferrer">Open original PDF <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a className="contact-button" href={pdf} download="CV_Nguyen_Phuong_Nam.pdf">Download CV <Download size={16} aria-hidden="true" /></a>
        </div>
      </header>
      <figure className="cv-document">
        <img src="/cv/cv-preview.webp" alt="Curriculum vitae of Nguyen Phuong Nam. A text summary follows the document preview." width="1041" height="1347" />
        <figcaption>Original CV supplied by Nguyen Phuong Nam. Open the PDF to select text or print.</figcaption>
      </figure>
      <section className="cv-text" aria-label="CV text summary">
        <h2>Education & experience</h2>
        <p>Artificial Intelligence, University of Engineering and Technology – Vietnam National University, Hanoi. September 2023 – expected December 2026. GPA: 3.28. IELTS: 6.0.</p>
        <p>Viettel High Tech — AI Intern, UAV Perception and Navigation Department (December 2025 – July 2026). Thermal and infrared target detection; X-Plane 11 camera simulation.</p>
        <p>Central Military Hospital 108 — Junior Software Developer, Equipment Department (December 2025 – September 2026). Medical supply management with Golang, database design, REST APIs, WebSocket updates, a Gemini-powered RAG chatbot, and internal deployment.</p>
        <p>AVITECH Research Group, VNU-UET — Undergraduate Thesis Researcher. Alzheimer’s disease prognosis with deep learning, multimodal and longitudinal data.</p>
        <a href="mailto:nnam.hp2005@gmail.com">nnam.hp2005@gmail.com</a>
      </section>
    </main>
  );
}
