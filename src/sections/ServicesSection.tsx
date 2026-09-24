import { FadeIn } from '../components/FadeIn';
import { services } from '../data/portfolio';

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="services-section rounded-t-[40px] bg-white px-5 py-20 text-ink sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn><h2 id="services-title" className="section-heading mb-16 text-center sm:mb-20 md:mb-28">Services</h2></FadeIn>
      <ol className="mx-auto max-w-5xl">
        {services.map((service, index) => <FadeIn as="li" key={service.name} delay={index * 0.1} className="service-item flex items-center gap-6 border-t border-ink/15 py-8 sm:gap-12 sm:py-10 md:gap-16 md:py-12">
          <span aria-hidden="true" className="service-number shrink-0 font-black leading-none tracking-tight">{String(index + 1).padStart(2, '0')}</span>
          <div><h3 className="service-name mb-3 font-medium uppercase leading-tight">{service.name}</h3><p className="service-description max-w-2xl font-light leading-relaxed text-ink/60">{service.description}</p></div>
        </FadeIn>)}
      </ol>
    </section>
  );
}
