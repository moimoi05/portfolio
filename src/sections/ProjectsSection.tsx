import { useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { contactHref } from '../components/Buttons';
import { ProjectPreview } from '../components/ProjectPreview';
import { selectedProjects } from '../data/projects';
import type { SelectedProject } from '../data/projects';
import '../projects.css';

function ProjectAction({ project }: { project: SelectedProject }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  if (project.liveUrl) return <a className="nam-project-action" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Project <ArrowUpRight size={17} aria-hidden="true" /></a>;
  return (
    <>
      <button ref={trigger} className="nam-project-action" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">View Project <ArrowUpRight size={17} aria-hidden="true" /></button>
      <dialog ref={dialog} className="nam-project-dialog" aria-labelledby={`${project.id}-dialog-title`} aria-describedby={`${project.id}-context`} onClose={() => trigger.current?.focus()}>
        <div className="nam-dialog-top"><span>{project.category}</span><button type="button" aria-label="Close project" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button></div>
        <h2 id={`${project.id}-dialog-title`}>{project.name}</h2>
        <p id={`${project.id}-context`} className="nam-dialog-context">{project.context}</p>
        <div className="nam-case-details">{project.details.map((detail) => <div key={detail.title}><h3>{detail.title}</h3><p>{detail.body}</p></div>)}</div>
        <p className="nam-dialog-note">{project.preview === 'research' || project.preview === 'rehabilitation' ? 'Reference figure from a published paper; see the source and author attribution on the project card.' : 'Concept preview. Project imagery is illustrative; internal materials are not published here.'}</p>
        <a className="nam-project-action" href={contactHref}>Discuss this work <ArrowUpRight size={17} aria-hidden="true" /></a>
      </dialog>
    </>
  );
}
function ProjectCard({ project, index }: { project: SelectedProject; index: number }) {
  return (
    <div className="nam-project-slot project-stack-slot" style={{ top: `calc(var(--nam-card-top) + ${index * 14}px)`, zIndex: index + 1 }}>
      <article aria-label={project.name} className="nam-project-card">
        <div className="nam-project-header">
          <span aria-hidden="true" className="nam-project-number">{String(index + 1).padStart(2, '0')}</span>
          <div className="nam-project-title"><p>{project.category}</p><h3>{project.name}</h3></div>
          <ProjectAction project={project} />
        </div>
        <div className="nam-project-meta"><p>{project.description}</p><ul aria-label="Project technologies and focus">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
        <ProjectPreview kind={project.preview} />
      </article>
    </div>
  );
}
export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="nam-projects-section">
      <FadeIn><div className="nam-projects-intro"><span>Selected work / 01—05</span><span>Software, vision & research</span></div><h2 id="projects-title" className="hero-heading nam-projects-heading">Selected Projects</h2></FadeIn>
      <div className="nam-project-stack">{selectedProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    </section>
  );
}
