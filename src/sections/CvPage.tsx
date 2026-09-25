import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

const pdf = '/cv/CV_Nguyen_Phuong_Nam.pdf';

export function CvPage() {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = isVietnamese ? 'CV — Nguyễn Phương Nam' : 'CV — Nguyen Phuong Nam';
    return () => { document.title = previousTitle; };
  }, [isVietnamese]);

  return (
    <main className="cv-page" lang={language}>
      <div className="cv-toolbar">
        <a className="cv-back" href="/#about"><ArrowLeft size={18} aria-hidden="true" /> {isVietnamese ? 'Quay lại portfolio' : 'Back to portfolio'}</a>
        <LanguageSwitcher />
      </div>
      <header className="cv-header">
        <div><p className="section-eyebrow">{isVietnamese ? 'Sơ yếu lý lịch' : 'Curriculum vitae'}</p><h1 className="hero-heading">Nguyen Phuong Nam</h1><p>{isVietnamese ? 'Trí tuệ nhân tạo · Trường Đại học Công nghệ, ĐHQGHN' : 'Artificial Intelligence · University of Engineering and Technology, VNU Hanoi'}</p></div>
        <div className="cv-actions">
          <a className="live-project-button" href={pdf} target="_blank" rel="noopener noreferrer">{isVietnamese ? 'Mở PDF gốc' : 'Open original PDF'} <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a className="contact-button" href={pdf} download="CV_Nguyen_Phuong_Nam.pdf">{isVietnamese ? 'Tải CV' : 'Download CV'} <Download size={16} aria-hidden="true" /></a>
        </div>
      </header>
      <figure className="cv-document">
        <img src="/cv/cv-preview.webp" alt={isVietnamese ? 'Bản xem trước curriculum vitae một trang của Nguyễn Phương Nam. Nội dung dạng văn bản nằm bên dưới.' : 'Preview of Nguyen Phuong Nam’s updated one-page curriculum vitae. A text summary follows the document preview.'} width="1560" height="2016" />
        <figcaption>{isVietnamese ? 'CV gốc do Nguyễn Phương Nam cung cấp. Mở PDF để chọn văn bản hoặc in.' : 'Original CV supplied by Nguyen Phuong Nam. Open the PDF to select text or print.'}</figcaption>
      </figure>
      <section className="cv-text" aria-label={isVietnamese ? 'Nội dung CV dạng văn bản' : 'CV text summary'}>
        <section className="cv-section" aria-labelledby="cv-education-title">
          <h2 id="cv-education-title">{isVietnamese ? 'Học vấn & thành tích' : 'Education & recognition'}</h2>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>{isVietnamese ? 'Trường Đại học Công nghệ, ĐHQGHN' : 'University of Engineering and Technology, VNU Hanoi'}</h3><span>{isVietnamese ? '09/2023 – 12/2026' : 'Sep 2023 – Dec 2026'}</span></div>
            <p className="cv-entry-role">{isVietnamese ? 'Chuyên ngành: Trí tuệ nhân tạo · GPA 3.28 · IELTS 6.0' : 'Major: Artificial Intelligence · GPA 3.28 · IELTS 6.0'}</p>
            <p>{isVietnamese ? 'Top 10% vòng chung kết Naver Hackathon; Giải Khuyến khích UET Makathon; Giấy chứng nhận Sinh viên Xuất sắc (2026).' : 'Top 10% Finalist, Naver Hackathon; Consolation Prize, UET Makathon; Outstanding Student Certificate (2026).'}</p>
            <p>Portfolio: <a href="https://nnam05.id.vn/" target="_blank" rel="noopener noreferrer">nnam05.id.vn</a></p>
          </div>
        </section>
        <section className="cv-section" aria-labelledby="cv-experience-title">
          <h2 id="cv-experience-title">{isVietnamese ? 'Kinh nghiệm & nghiên cứu' : 'Experience & research'}</h2>
          <article className="cv-entry">
            <div className="cv-entry-heading"><h3>Viettel High Tech</h3><span>{isVietnamese ? '12/2025 – 07/2026' : 'Dec 2025 – Jul 2026'}</span></div>
            <p className="cv-entry-role">{isVietnamese ? 'Thực tập sinh AI · Bộ phận Nhận thức và Dẫn đường UAV' : 'AI Intern · UAV Perception and Navigation Department'}</p>
            <ul>
              <li>{isVietnamese ? 'Phát triển giải pháp thị giác máy tính để UAV phát hiện mục tiêu từ dữ liệu camera nhiệt và hồng ngoại.' : 'Developed computer vision solutions for UAV target detection with thermal and infrared camera data.'}</li>
              <li>{isVietnamese ? 'Tích hợp ảnh nhiệt vào môi trường bay mô phỏng và xây dựng plug-in mô phỏng camera cho X-Plane 11.' : 'Integrated thermal imagery into simulated aerial environments and built an X-Plane 11 camera simulation plug-in.'}</li>
            </ul>
          </article>
          <article className="cv-entry">
            <div className="cv-entry-heading"><h3>{isVietnamese ? 'Bệnh viện Trung ương Quân đội 108' : 'Central Military Hospital 108'}</h3><span>{isVietnamese ? '12/2025 – 09/2026' : 'Dec 2025 – Sep 2026'}</span></div>
            <p className="cv-entry-role">{isVietnamese ? 'Lập trình viên phần mềm · Khoa Trang bị' : 'Junior Software Developer · Equipment Department'}</p>
            <ul>
              <li>{isVietnamese ? 'Xây dựng hệ thống quản lý vật tư y tế đầu cuối bằng Golang để sử dụng giữa các khoa trong bệnh viện.' : 'Built an end-to-end medical supply management system for use across hospital departments with Golang.'}</li>
              <li>{isVietnamese ? 'Thiết kế lược đồ cơ sở dữ liệu, RESTful API và logic nghiệp vụ backend.' : 'Designed its database schema, RESTful APIs, and backend business logic.'}</li>
              <li>{isVietnamese ? 'Triển khai cập nhật thời gian thực bằng WebSocket và chatbot RAG sử dụng Gemini để truy vấn dữ liệu ứng dụng cùng tri thức nội bộ.' : 'Implemented WebSocket live updates and a Gemini-powered RAG chatbot for questions over application data and internal knowledge.'}</li>
              <li>{isVietnamese ? 'Triển khai và tích hợp hệ thống vào môi trường web nội bộ của bệnh viện.' : 'Deployed and integrated the system into the hospital’s internal web environment.'}</li>
            </ul>
          </article>
          <article className="cv-entry">
            <div className="cv-entry-heading"><h3>AVITECH Research Group, VNU-UET</h3><span>{isVietnamese ? 'Hiện tại' : 'Present'}</span></div>
            <p className="cv-entry-role">{isVietnamese ? 'Nghiên cứu khóa luận · Tiên lượng bệnh Alzheimer' : 'Undergraduate Thesis Researcher · Alzheimer’s Disease Prognosis'}</p>
            <ul>
              <li>{isVietnamese ? 'Nghiên cứu tiên lượng bệnh Alzheimer bằng học sâu.' : 'Researching Alzheimer’s disease prognosis with deep learning.'}</li>
              <li>{isVietnamese ? 'Khảo sát dữ liệu dọc và đa phương thức để mô hình hóa tiến triển bệnh theo thời gian.' : 'Investigating longitudinal and multimodal data to model disease progression over time.'}</li>
            </ul>
            <p>{isVietnamese ? 'Hồ sơ nghiên cứu' : 'Research profile'}: <a href="https://avitechresearch.vn/nguyen-phuong-nam/" target="_blank" rel="noopener noreferrer">avitechresearch.vn/nguyen-phuong-nam</a></p>
          </article>
        </section>
        <section className="cv-section" aria-labelledby="cv-leadership-title">
          <h2 id="cv-leadership-title">{isVietnamese ? 'Lãnh đạo & kỹ năng kỹ thuật' : 'Leadership & technical skills'}</h2>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>{isVietnamese ? 'UET · Trưởng nhóm dự án' : 'UET · Project Team Leader'}</h3><span>{isVietnamese ? '09/2023 – Hiện tại' : 'Sep 2023 – Present'}</span></div>
            <p>{isVietnamese ? 'Dẫn dắt các nhóm học thuật trong AI, học máy, thị giác máy tính và phát triển phần mềm; điều phối phân công, triển khai, tích hợp và bàn giao.' : 'Led academic teams in AI, machine learning, computer vision, and software development; coordinated task allocation, implementation, integration, and delivery.'}</p>
          </div>
          <div className="cv-skills">
            <p><strong>{isVietnamese ? 'Lập trình' : 'Programming'}:</strong> Python, Golang</p>
            <p><strong>{isVietnamese ? 'Học máy & học sâu' : 'Machine & deep learning'}:</strong> PyTorch, scikit-learn, Hugging Face, CNN, RNN, LSTM, Transformer, BERT, GPT</p>
            <p><strong>{isVietnamese ? 'Thị giác máy tính' : 'Computer vision'}:</strong> YOLOv8, FaceNet, MTCNN, InceptionResnetV1</p>
            <p><strong>{isVietnamese ? 'Dữ liệu & công cụ' : 'Data & tools'}:</strong> NumPy, Matplotlib, SQL, NoSQL, Docker, Colab, CI/CD</p>
          </div>
        </section>
        <a className="cv-email" href="mailto:nnam.hp2005@gmail.com">nnam.hp2005@gmail.com</a>
      </section>
    </main>
  );
}
