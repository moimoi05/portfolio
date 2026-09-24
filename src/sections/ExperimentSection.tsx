import { FadeIn } from '../components/FadeIn';

const experiments = [
  { name: 'Service websites', category: 'Web development', description: 'Client-facing websites that turn a business’s identity and services into a clear, useful online presence.', tags: ['Client work', 'Responsive interfaces'] },
  { name: 'Workflow automation', category: 'Automation', description: 'Small scripts and connected workflows that take repetitive tasks out of everyday work.', tags: ['Python', 'Internal tools'] },
  { name: 'AI-assisted utilities', category: 'Exploration', description: 'Prototypes for practical language-model applications, from document retrieval to focused assistant workflows.', tags: ['RAG', 'Prototyping'] },
  { name: 'Data processing tools', category: 'Utilities', description: 'Helpers for collecting, cleaning, and structuring data so it is ready for analysis or the next build.', tags: ['Python', 'Data workflows'] },
] as const;

export function ExperimentSection() {
  return (
    <section id="experiment" aria-labelledby="experiment-title" className="experiment-section">
      <div className="section-eyebrow"><span>Outside the main work</span><span>Lab / Side builds</span></div>
      <FadeIn><h2 id="experiment-title" className="hero-heading section-heading experiment-heading">Experiment</h2></FadeIn>
      <FadeIn><p className="experiment-intro">Smaller builds, client-facing websites, internal tools, and automation experiments — a place to test ideas and turn them into useful systems.</p></FadeIn>
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
