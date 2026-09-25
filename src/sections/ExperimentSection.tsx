import { FadeIn } from '../components/FadeIn';
import { useLanguage } from '../context/LanguageContext';

const experimentsEn = [
  { name: 'Service websites', category: 'Web development', description: 'Client-facing websites that turn a business’s identity and services into a clear, useful online presence.', tags: ['Client work', 'Responsive interfaces'] },
  { name: 'Workflow automation', category: 'Automation', description: 'Small scripts and connected workflows that take repetitive tasks out of everyday work.', tags: ['Python', 'Internal tools'] },
  { name: 'AI-assisted utilities', category: 'Exploration', description: 'Prototypes for practical language-model applications, from document retrieval to focused assistant workflows.', tags: ['RAG', 'Prototyping'] },
  { name: 'Data processing tools', category: 'Utilities', description: 'Helpers for collecting, cleaning, and structuring data so it is ready for analysis or the next build.', tags: ['Python', 'Data workflows'] },
] as const;
const experimentsVi = [
  { name: 'Website dịch vụ', category: 'Phát triển web', description: 'Website hướng đến khách hàng, thể hiện bản sắc và dịch vụ doanh nghiệp một cách rõ ràng, hữu ích.', tags: ['Dự án khách hàng', 'Giao diện đáp ứng'] },
  { name: 'Tự động hóa quy trình', category: 'Tự động hóa', description: 'Các tập lệnh và quy trình kết nối giúp giảm bớt những công việc lặp lại hằng ngày.', tags: ['Python', 'Công cụ nội bộ'] },
  { name: 'Tiện ích ứng dụng AI', category: 'Khám phá', description: 'Nguyên mẫu ứng dụng mô hình ngôn ngữ vào các tác vụ thực tế, từ truy xuất tài liệu đến quy trình trợ lý chuyên biệt.', tags: ['RAG', 'Tạo nguyên mẫu'] },
  { name: 'Công cụ xử lý dữ liệu', category: 'Tiện ích', description: 'Công cụ thu thập, làm sạch và cấu trúc dữ liệu để sẵn sàng phân tích hoặc tích hợp vào sản phẩm.', tags: ['Python', 'Quy trình dữ liệu'] },
] as const;

export function ExperimentSection() {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';
  const experiments = isVietnamese ? experimentsVi : experimentsEn;

  return (
    <section id="experiment" aria-labelledby="experiment-title" className="experiment-section">
      <div className="section-eyebrow"><span>{isVietnamese ? 'Ngoài công việc chính' : 'Outside the main work'}</span><span>{isVietnamese ? 'Phòng lab / Dự án nhỏ' : 'Lab / Side builds'}</span></div>
      <FadeIn><h2 id="experiment-title" className="hero-heading section-heading experiment-heading">{isVietnamese ? 'Thử nghiệm' : 'Experiment'}</h2></FadeIn>
      <FadeIn><p className="experiment-intro">{isVietnamese ? 'Các sản phẩm nhỏ, website cho khách hàng, công cụ nội bộ và thử nghiệm tự động hóa — nơi tôi kiểm chứng ý tưởng và biến chúng thành hệ thống hữu ích.' : 'Smaller builds, client-facing websites, internal tools, and automation experiments — a place to test ideas and turn them into useful systems.'}</p></FadeIn>
      <ol className="experiment-list">
        {experiments.map((item, index) => <FadeIn as="li" key={item.name} delay={index * 0.06} className="experiment-row">
          <span className="experiment-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div className="experiment-name"><span>{item.category}</span><h3>{item.name}</h3></div>
          <div className="experiment-detail"><p>{item.description}</p><ul aria-label={`${item.name} tags`}>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
        </FadeIn>)}
      </ol>
    </section>
  );
}
