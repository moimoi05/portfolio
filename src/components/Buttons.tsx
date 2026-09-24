import { ArrowUpRight } from 'lucide-react';

export const contactHref = 'mailto:nnam.hp2005@gmail.com';
export const projectHref = 'https://nnam.05.id.vn';

export function ContactButton() {
  return (
    <a href={contactHref} className="contact-button group">
      <span>Contact Me</span>
      <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export function LiveProjectButton() {
  return (
    <a href={projectHref} target="_blank" rel="noopener noreferrer" className="live-project-button group">
      <span>Live Project</span>
      <ArrowUpRight aria-hidden="true" size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
