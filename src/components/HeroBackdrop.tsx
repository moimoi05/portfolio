import './HeroBackdrop.css';

export function HeroBackdrop() {
  return (
    <div className="hero-scenery" aria-hidden="true">
      <div className="hero-scene-floor" />
      <div className="hero-light-orbit hero-light-orbit--outer" />
      <div className="hero-light-orbit hero-light-orbit--inner" />
      <div className="hero-glass-pane hero-glass-pane--back"><i /><i /><i /><i /><i /><i /></div>
      <div className="hero-glass-pane hero-glass-pane--front"><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="hero-glass-cube hero-glass-cube--one" />
      <div className="hero-glass-cube hero-glass-cube--two" />
      <div className="hero-glass-cube hero-glass-cube--three" />
      <span className="hero-spark hero-spark--one" /><span className="hero-spark hero-spark--two" /><span className="hero-spark hero-spark--three" />
    </div>
  );
}
