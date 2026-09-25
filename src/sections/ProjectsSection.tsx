import { useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { contactHref } from '../components/Buttons';
import { ProjectPreview } from '../components/ProjectPreview';
import { selectedProjects } from '../data/projects';
import type { SelectedProject } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';
import '../projects.css';

const projectTranslations: Record<string, Partial<SelectedProject>> = {
  guut: {
    category: 'Website khách hàng / Kiến trúc nội thất',
    description: 'Website dành cho thương hiệu kiến trúc và thiết kế nội thất cao cấp, giới thiệu các không gian và triết lý sống được cá nhân hóa.',
    tags: ['Website doanh nghiệp', 'Thiết kế nội thất', 'Website trực tuyến'],
    context: 'Website doanh nghiệp dành cho GUU & T DESIGN.',
  },
  'medical-supply': {
    category: 'Phòng Trang thiết bị / Bệnh viện Trung ương Quân đội 108',
    description: 'Hệ thống quản lý vật tư y tế toàn diện bằng Golang và SQL: dự báo nhu cầu, quy trình phê duyệt, đơn đặt hàng nhà cung cấp, đối soát hóa đơn, cập nhật thời gian thực và chatbot RAG tích hợp Gemini.',
    tags: ['Golang / Gin', 'SQL / MySQL', 'REST API', 'WebSocket', 'Gemini / RAG'],
    context: 'Lập trình viên phần mềm tại Phòng Trang thiết bị, Bệnh viện Trung ương Quân đội 108 (12/2025 – 09/2026). Phát triển và triển khai ứng dụng quản lý vật tư nội bộ hỗ trợ các quy trình giữa các khoa.',
    details: [
      { title: 'Backend và dữ liệu', body: 'Thiết kế lược đồ cơ sở dữ liệu, REST API và nghiệp vụ backend bằng Golang, Gin và SQL (MySQL), kết nối với giao diện React và TypeScript.' },
      { title: 'Quy trình vật tư y tế', body: 'Hỗ trợ danh mục và tra cứu tồn kho, dự báo nhu cầu theo khoa kèm lịch sử phê duyệt, đơn hàng nhà cung cấp và đối soát hóa đơn. Các quy trình kết nối yêu cầu với khâu mua sắm và kiểm tra.' },
      { title: 'Giao tiếp thời gian thực và triển khai', body: 'Tích hợp cập nhật WebSocket để đồng bộ giao diện ứng dụng và tham gia triển khai ứng dụng web nội bộ.' },
      { title: 'Hỗ trợ truy xuất thông tin', body: 'Tích hợp chatbot RAG sử dụng Gemini API trên dữ liệu ứng dụng và kiến thức nội bộ. Sơ đồ khái niệm mô tả hệ thống mà không công bố hồ sơ nội bộ.' },
    ],
  },
  'uav-thermal': {
    category: 'Thực tập AI / Viettel High Tech',
    description: 'Ứng dụng thị giác máy tính với ảnh nhiệt và hồng ngoại từ UAV, nghiên cứu phát hiện vật thể và nhận thức trong một phổ hình ảnh khác.',
    tags: ['Thị giác máy tính', 'Nhiệt / Hồng ngoại', 'Phát hiện vật thể'],
    context: 'Công việc thị giác máy tính trong kỳ thực tập AI tại Viettel High Tech, tập trung vào nhận thức UAV và ảnh nhiệt / hồng ngoại.',
    details: [
      { title: 'Bài toán nhận thức', body: 'Làm việc với dữ liệu nhiệt và hồng ngoại cho các tác vụ phát hiện vật thể và nhận thức UAV.' },
      { title: 'Bối cảnh kỹ thuật', body: 'Xây dựng plugin mô phỏng camera X-Plane 11 và tích hợp vật thể, bản đồ vào môi trường bay mô phỏng tại Phòng Thị giác và Định vị UAV.' },
      { title: 'Phạm vi hình minh họa', body: 'Hình ảnh là minh họa trừu tượng cho quy trình từ ảnh đến phát hiện. Không sử dụng hình ảnh vận hành, dữ liệu vị trí, điểm tin cậy hay kết quả đánh giá được tuyên bố.' },
    ],
  },
  'alzheimers-research': {
    category: 'Nghiên cứu khóa luận / Nhóm nghiên cứu AVITECH, VNU-UET',
    description: 'Nghiên cứu học sâu cho bài toán dự báo bệnh Alzheimer, kết nối thông tin đa phương thức với các quan sát được thu thập theo thời gian.',
    tags: ['Học sâu', 'Dữ liệu đa phương thức', 'Mô hình hóa theo thời gian'],
    context: 'Nghiên cứu khóa luận tại Nhóm nghiên cứu AVITECH, VNU-UET về tiến triển bệnh Alzheimer theo thời gian bằng học sâu và dữ liệu đa phương thức, theo dõi dọc.',
    details: [
      { title: 'Câu hỏi nghiên cứu', body: 'Tìm hiểu cách các nguồn thông tin khác nhau và sự thay đổi của chúng theo thời gian có thể hỗ trợ bài toán dự báo.' },
      { title: 'Hướng mô hình hóa', body: 'Kết hợp góc nhìn đa phương thức với mô hình hóa dữ liệu theo thời gian, chú ý cả loại và thời điểm của các quan sát.' },
      { title: 'Tiến độ nghiên cứu', body: 'Đang thực hiện khóa luận. Hình tham khảo được trích từ Wang và cộng sự (2024), minh họa kiến trúc đa phương thức liên quan; đây không phải mô hình hay kết quả do Nam thực hiện.' },
    ],
  },
  'ai-rehabilitation': {
    category: 'Hợp tác nghiên cứu / Bệnh viện Trung ương Quân đội 108',
    description: 'Nghiên cứu đang triển khai về AI trong phục hồi chức năng, phối hợp với Khoa Phục hồi chức năng, Bệnh viện Trung ương Quân đội 108.',
    tags: ['AI ứng dụng', 'Phục hồi chức năng', 'Nghiên cứu đang triển khai'],
    context: 'Hướng nghiên cứu đang triển khai về AI trong phục hồi chức năng, phối hợp với Khoa Phục hồi chức năng, Bệnh viện Trung ương Quân đội 108.',
    details: [
      { title: 'Trọng tâm nghiên cứu', body: 'Tìm hiểu cách AI có thể hỗ trợ phục hồi chức năng, kết nối nghiên cứu tính toán với nhu cầu và chuyên môn của đội ngũ phục hồi chức năng.' },
      { title: 'Hợp tác', body: 'Phối hợp với Khoa Phục hồi chức năng, Bệnh viện Trung ương Quân đội 108.' },
      { title: 'Tài liệu liên quan', body: 'Hình tham khảo mô tả kiến trúc Rehab-DRLX do Alsolai và cộng sự công bố năm 2026. Đây là tài liệu nền về AI phục hồi chức năng, không đại diện cho phần triển khai hay kết quả nghiên cứu của Nam.' },
    ],
  },
};

function ProjectAction({ project, isVietnamese }: { project: SelectedProject; isVietnamese: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  if (project.liveUrl) return <a className="nam-project-action" href={project.liveUrl} target="_blank" rel="noopener noreferrer">{isVietnamese ? 'Website trực tuyến' : 'Live Project'} <ArrowUpRight size={17} aria-hidden="true" /></a>;
  return (
    <>
      <button ref={trigger} className="nam-project-action" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">{isVietnamese ? 'Xem dự án' : 'View Project'} <ArrowUpRight size={17} aria-hidden="true" /></button>
      <dialog ref={dialog} className="nam-project-dialog" aria-labelledby={`${project.id}-dialog-title`} aria-describedby={`${project.id}-context`} onClose={() => trigger.current?.focus()}>
        <div className="nam-dialog-top"><span>{project.category}</span><button type="button" aria-label="Close project" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button></div>
        <h2 id={`${project.id}-dialog-title`}>{project.name}</h2>
        <p id={`${project.id}-context`} className="nam-dialog-context">{project.context}</p>
        <div className="nam-case-details">{project.details.map((detail) => <div key={detail.title}><h3>{detail.title}</h3><p>{detail.body}</p></div>)}</div>
        <p className="nam-dialog-note">{isVietnamese ? (project.preview === 'research' || project.preview === 'rehabilitation' ? 'Hình tham khảo từ bài báo đã xuất bản; xem nguồn và ghi công tác giả trên thẻ dự án.' : 'Hình ảnh dự án chỉ mang tính minh họa; tài liệu nội bộ không được công bố tại đây.') : (project.preview === 'research' || project.preview === 'rehabilitation' ? 'Reference figure from a published paper; see the source and author attribution on the project card.' : 'Concept preview. Project imagery is illustrative; internal materials are not published here.')}</p>
        <a className="nam-project-action" href={contactHref}>{isVietnamese ? 'Trao đổi về dự án' : 'Discuss this work'} <ArrowUpRight size={17} aria-hidden="true" /></a>
      </dialog>
    </>
  );
}
function ProjectCard({ project, index, isVietnamese }: { project: SelectedProject; index: number; isVietnamese: boolean }) {
  return (
    <div className="nam-project-slot project-stack-slot" style={{ top: `calc(var(--nam-card-top) + ${index * 14}px)`, zIndex: index + 1 }}>
      <article aria-label={project.name} className="nam-project-card">
        <div className="nam-project-header">
          <span aria-hidden="true" className="nam-project-number">{String(index + 1).padStart(2, '0')}</span>
          <div className="nam-project-title"><p>{project.category}</p><h3>{project.name}</h3></div>
          <ProjectAction project={project} isVietnamese={isVietnamese} />
        </div>
        <div className="nam-project-meta"><p>{project.description}</p><ul aria-label="Project technologies and focus">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
        <ProjectPreview kind={project.preview} language={isVietnamese ? 'vi' : 'en'} />
      </article>
    </div>
  );
}
export function ProjectsSection() {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';
  const projects = isVietnamese ? selectedProjects.map(project => ({ ...project, ...projectTranslations[project.id] })) : selectedProjects;

  return (
    <section id="projects" aria-labelledby="projects-title" className="nam-projects-section">
      <FadeIn><div className="nam-projects-intro"><span>{isVietnamese ? 'Dự án tiêu biểu / 01—05' : 'Selected work / 01—05'}</span><span>{isVietnamese ? 'Phần mềm, thị giác máy tính và nghiên cứu' : 'Software, vision & research'}</span></div><h2 id="projects-title" className="hero-heading nam-projects-heading">{isVietnamese ? 'Dự án tiêu biểu' : 'Selected Projects'}</h2></FadeIn>
      <div className="nam-project-stack">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} isVietnamese={isVietnamese} />)}</div>
    </section>
  );
}
