import { ArrowUpRight } from 'lucide-react';
import { researchFigures } from '../data/researchFigures';
import type { Language } from '../context/LanguageContext';

export function PaperFigure({ kind, language }: { kind: keyof typeof researchFigures; language: Language }) {
  const figure = researchFigures[kind];
  const isVietnamese = language === 'vi';
  return (
    <figure className="paper-figure">
      <div className="paper-heading"><span>{isVietnamese ? 'Nghiên cứu liên quan / Hình tham khảo' : 'Related research / Reference figure'}</span><span>{figure.figure}</span></div>
      <a className="paper-image" href={figure.src} target="_blank" rel="noopener noreferrer" aria-label={isVietnamese ? `Phóng to hình ${figure.title}` : `Enlarge ${figure.title} figure`}><img src={figure.src} alt={figure.alt} loading="lazy" decoding="async" width={figure.width} height={figure.height} /><span>{isVietnamese ? 'Phóng to hình' : 'Enlarge figure'} <ArrowUpRight size={14} aria-hidden="true" /></span></a>
      <figcaption><div><strong>{figure.title}</strong><p>{figure.authors} · {figure.journal} · {figure.figure}</p><p>{isVietnamese ? 'Hình tham khảo đã xuất bản, không phải mô hình của Nam. Giữ nguyên bản gốc.' : 'Published reference, not Nam’s own model. Reproduced without changes.'}</p></div><div className="paper-links"><a href={figure.url} target="_blank" rel="noopener noreferrer" title={figure.paperTitle}>{isVietnamese ? 'Bài báo nguồn' : 'Source paper'} <ArrowUpRight size={14} aria-hidden="true" /></a><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></div></figcaption>
    </figure>
  );
}
