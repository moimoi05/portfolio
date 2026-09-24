import { ArrowUpRight } from 'lucide-react';
import { researchFigures } from '../data/researchFigures';

export function PaperFigure({ kind }: { kind: keyof typeof researchFigures }) {
  const figure = researchFigures[kind];
  return (
    <figure className="paper-figure">
      <div className="paper-heading"><span>Related research / Reference figure</span><span>{figure.figure}</span></div>
      <a className="paper-image" href={figure.src} target="_blank" rel="noopener noreferrer" aria-label={`Enlarge ${figure.title} figure`}><img src={figure.src} alt={figure.alt} loading="lazy" decoding="async" width={figure.width} height={figure.height} /><span>Enlarge figure <ArrowUpRight size={14} aria-hidden="true" /></span></a>
      <figcaption><div><strong>{figure.title}</strong><p>{figure.authors} · {figure.journal} · {figure.figure}</p><p>Published reference, not Nam’s own model. Reproduced without changes.</p></div><div className="paper-links"><a href={figure.url} target="_blank" rel="noopener noreferrer" title={figure.paperTitle}>Source paper <ArrowUpRight size={14} aria-hidden="true" /></a><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></div></figcaption>
    </figure>
  );
}
