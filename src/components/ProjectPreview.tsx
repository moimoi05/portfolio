import type { PreviewKind } from '../data/projects';
import { PaperFigure } from './PaperFigure';
import { UavPreview } from './UavPreview';
import type { Language } from '../context/LanguageContext';

function WebsitePreview({ isVietnamese }: { isVietnamese: boolean }) {
  return (
    <figure className="nam-website-preview" aria-label={isVietnamese ? 'Ảnh chụp website GUU & T DESIGN' : 'Screenshots from the live GUU & T DESIGN website'}>
      <img className="nam-site-home" src="/images/guut/homepage.webp" alt={isVietnamese ? 'Trang chủ website GUU & T DESIGN' : 'GUU & T DESIGN live website homepage'} loading="lazy" decoding="async" width="1440" height="1000" />
      <img className="nam-site-interiors" src="/images/guut/interiors.webp" alt={isVietnamese ? 'Kiến trúc nội thất trên guut.com.vn' : 'Interior architecture showcased on guut.com.vn'} loading="lazy" decoding="async" width="1440" height="1000" />
      <img className="nam-site-detail" src="/images/guut/detail.webp" alt={isVietnamese ? 'Chi tiết website GUU & T DESIGN' : 'Detail of the GUU & T DESIGN live website'} loading="lazy" decoding="async" width="1440" height="1000" />
      <figcaption>GUUT.COM.VN <span>{isVietnamese ? 'Ảnh chụp website' : 'Live website captures'}</span></figcaption>
    </figure>
  );
}
function SystemsPreview({ isVietnamese }: { isVietnamese: boolean }) {
  return (
    <div className="nam-bv108-preview">
      <div className="nam-bv108-glow" aria-hidden="true" />
      <div className="nam-bv108-topline"><span>{isVietnamese ? 'Bệnh viện Trung ương Quân đội 108' : 'Central Military Hospital 108'}</span><span><i aria-hidden="true" /> {isVietnamese ? 'Giao diện mẫu / dữ liệu tổng hợp' : 'Sample interface / synthetic data'}</span></div>
      <figure className="nam-bv108-shot nam-bv108-dashboard-shot"><img src="/images/bv108/dashboard-demo.webp" alt={isVietnamese ? 'Bảng điều khiển vật tư y tế với dữ liệu minh họa' : 'Medical supply dashboard using synthetic demo records'} loading="lazy" decoding="async" width="1600" height="1050" /><figcaption><strong>{isVietnamese ? 'Điều hành' : 'Control room'}</strong><span>{isVietnamese ? 'Dự báo · tồn kho · mua sắm' : 'Forecast · stock · procurement'}</span></figcaption></figure>
      <figure className="nam-bv108-shot nam-bv108-catalog-shot"><img src="/images/bv108/inventory-demo.webp" alt={isVietnamese ? 'Giao diện kho vật tư với dữ liệu mẫu tổng hợp' : 'Medical supply inventory interface with synthetic sample items'} loading="lazy" decoding="async" width="1600" height="1050" /><figcaption><strong>{isVietnamese ? 'Kho vật tư' : 'Inventory'}</strong><span>{isVietnamese ? 'Danh mục mẫu · trạng thái tồn' : 'Sample catalog · stock states'}</span></figcaption></figure>
      <div className="nam-bv108-workflow"><span>Golang / MySQL</span><i aria-hidden="true">→</i><span>{isVietnamese ? 'Phê duyệt khoa' : 'Department approvals'}</span><i aria-hidden="true">→</i><span>{isVietnamese ? 'Đơn nhà cung cấp' : 'Supplier orders'}</span><i aria-hidden="true">→</i><span>{isVietnamese ? 'Đối soát hóa đơn' : 'Invoice checks'}</span></div>
    </div>
  );
}
export function ProjectPreview({ kind, language }: { kind: PreviewKind; language: Language }) {
  const isVietnamese = language === 'vi';
  if (kind === 'website') return <WebsitePreview isVietnamese={isVietnamese} />;
  if (kind === 'research' || kind === 'rehabilitation') return <PaperFigure kind={kind} language={language} />;
  return (
    <figure className={`nam-concept-preview nam-concept-${kind}`}>
      <figcaption><span>{kind === 'systems' ? (isVietnamese ? 'Bản xem trước ứng dụng' : 'Application preview') : (isVietnamese ? 'Bản xem trước khái niệm' : 'Concept preview')}</span><span>{kind === 'systems' ? (isVietnamese ? 'Giao diện vật tư y tế' : 'Medical supply interface') : (isVietnamese ? 'Nghiên cứu nhận thức' : 'Perception study')}</span></figcaption>
      {kind === 'systems' ? <SystemsPreview isVietnamese={isVietnamese} /> : <UavPreview language={language} />}
      <p className="nam-concept-note">{kind === 'vision' ? (isVietnamese ? 'Mô phỏng minh họa · Không có dữ liệu vận hành' : 'Illustrative simulation · No operational data') : (isVietnamese ? 'Tổng quan kiến trúc · Không có hồ sơ nội bộ' : 'Architecture overview · No internal records')}</p>
    </figure>
  );
}
