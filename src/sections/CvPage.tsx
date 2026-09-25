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
        <img src="/cv/cv-preview.webp" alt="Preview of Nguyen Phuong Nam’s updated one-page curriculum vitae. A text summary follows the document preview." width="1560" height="2016" />
        <figcaption>Original CV supplied by Nguyen Phuong Nam. Open the PDF to select text or print.</figcaption>
      </figure>
      <section className="cv-text" aria-label="CV text summary">
        <section className="cv-section" aria-labelledby="cv-education-title">
          <h2 id="cv-education-title">Education & recognition</h2>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>University of Engineering and Technology, VNU Hanoi</h3><span>Sep 2023 – Dec 2026</span></div>
            <p className="cv-entry-role">B.S. in Artificial Intelligence · GPA 3.28 · IELTS 6.0</p>
            <p>Top 10% Finalist, Naver Hackathon; Consolation Prize, UET Makathon; Outstanding Student Certificate (2026).</p>
            <p>Portfolio: <a href="https://nnam05.id.vn/" target="_blank" rel="noopener noreferrer">nnam05.id.vn</a></p>
          </div>
        </section>
        <section className="cv-section" aria-labelledby="cv-experience-title">
          <h2 id="cv-experience-title">Experience & research</h2>
          <article className="cv-entry">
            <div className="cv-entry-heading"><h3>Viettel High Tech</h3><span>Dec 2025 – Jul 2026</span></div>
            <p className="cv-entry-role">AI Intern · UAV Perception and Navigation Department</p>
            <ul>
              <li>Developed computer vision solutions for UAV target detection with thermal and infrared camera data.</li>
              <li>Integrated thermal imagery into simulated aerial environments and built an X-Plane 11 camera simulation plug-in.</li>
            </ul>
          </article>
          <article className="cv-entry">
            <div className="cv-entry-heading"><h3>Central Military Hospital 108</h3><span>Dec 2025 – Sep 2026</span></div>
            <p className="cv-entry-role">Junior Software Developer · Equipment Department</p>
            <ul>
              <li>Built an end-to-end medical supply management system for use across hospital departments with Golang.</li>
              <li>Designed its database schema, RESTful APIs, and backend business logic.</li>
              <li>Implemented WebSocket live updates and a Gemini-powered RAG chatbot for questions over application data and internal knowledge.</li>
              <li>Deployed and integrated the system into the hospital’s internal web environment.</li>
            </ul>
          </article>
          <article className="cv-entry">
            <div className="cv-entry-heading"><h3>AVITECH Research Group, VNU-UET</h3><span>Present</span></div>
            <p className="cv-entry-role">Undergraduate Thesis Researcher · Alzheimer’s Disease Prognosis</p>
            <ul>
              <li>Researching Alzheimer’s disease prognosis with deep learning.</li>
              <li>Investigating longitudinal and multimodal data to model disease progression over time.</li>
            </ul>
            <p>Research profile: <a href="https://avitechresearch.vn/nguyen-phuong-nam/" target="_blank" rel="noopener noreferrer">avitechresearch.vn/nguyen-phuong-nam</a></p>
          </article>
        </section>
        <section className="cv-section" aria-labelledby="cv-leadership-title">
          <h2 id="cv-leadership-title">Leadership & technical skills</h2>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>UET · Project Team Leader</h3><span>Sep 2023 – Present</span></div>
            <p>Led academic teams in AI, machine learning, computer vision, and software development; coordinated task allocation, implementation, integration, and delivery.</p>
          </div>
          <div className="cv-skills">
            <p><strong>Programming:</strong> Python, Golang</p>
            <p><strong>Machine & deep learning:</strong> PyTorch, scikit-learn, Hugging Face, CNN, RNN, LSTM, Transformer, BERT, GPT</p>
            <p><strong>Computer vision:</strong> YOLOv8, FaceNet, MTCNN, InceptionResnetV1</p>
            <p><strong>Data & tools:</strong> NumPy, Matplotlib, SQL, NoSQL, Docker, Colab, CI/CD</p>
          </div>
        </section>
        <a className="cv-email" href="mailto:nnam.hp2005@gmail.com">nnam.hp2005@gmail.com</a>
      </section>
    </main>
  );
}
