import type { PreviewKind } from '../data/projects';
import { PaperFigure } from './PaperFigure';
import { UavPreview } from './UavPreview';

function WebsitePreview() {
  return (
    <figure className="nam-website-preview" aria-label="Screenshots from the live GUU & T DESIGN website">
      <img className="nam-site-home" src="/images/guut/homepage.png" alt="GUU & T DESIGN live website homepage" loading="lazy" decoding="async" width="1440" height="1000" />
      <img className="nam-site-interiors" src="/images/guut/interiors.png" alt="Interior architecture showcased on guut.com.vn" loading="lazy" decoding="async" width="1440" height="1000" />
      <img className="nam-site-detail" src="/images/guut/detail.png" alt="Detail of the GUU & T DESIGN live website" loading="lazy" decoding="async" width="1440" height="1000" />
      <figcaption>GUUT.COM.VN <span>Live website captures</span></figcaption>
    </figure>
  );
}
function SystemsPreview() {
  return (
    <div className="nam-bv108-preview">
      <div className="nam-bv108-glow" aria-hidden="true" />
      <div className="nam-bv108-topline"><span>Central Military Hospital 108</span><span><i aria-hidden="true" /> Sample interface / synthetic data</span></div>
      <figure className="nam-bv108-shot nam-bv108-dashboard-shot"><img src="/images/bv108/dashboard-demo.png" alt="Medical supply dashboard using synthetic demo records" loading="lazy" decoding="async" width="1600" height="1050" /><figcaption><strong>Control room</strong><span>Forecast · stock · procurement</span></figcaption></figure>
      <figure className="nam-bv108-shot nam-bv108-catalog-shot"><img src="/images/bv108/inventory-demo.png" alt="Medical supply inventory interface with synthetic sample items" loading="lazy" decoding="async" width="1600" height="1050" /><figcaption><strong>Inventory</strong><span>Sample catalog · stock states</span></figcaption></figure>
      <div className="nam-bv108-workflow"><span>Golang / MySQL</span><i aria-hidden="true">→</i><span>Department approvals</span><i aria-hidden="true">→</i><span>Supplier orders</span><i aria-hidden="true">→</i><span>Invoice checks</span></div>
    </div>
  );
}
export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  if (kind === 'website') return <WebsitePreview />;
  if (kind === 'research' || kind === 'rehabilitation') return <PaperFigure kind={kind} />;
  return (
    <figure className={`nam-concept-preview nam-concept-${kind}`}>
      <figcaption><span>{kind === 'systems' ? 'Application preview' : 'Concept preview'}</span><span>{kind === 'systems' ? 'Medical supply interface' : 'Perception study'}</span></figcaption>
      {kind === 'systems' ? <SystemsPreview /> : <UavPreview />}
      <p className="nam-concept-note">{kind === 'vision' ? 'Illustrative simulation · No operational data' : 'Architecture overview · No internal records'}</p>
    </figure>
  );
}
