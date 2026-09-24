export const services = [
  { name: '3D Modeling', description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.' },
  { name: 'Rendering', description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.' },
  { name: 'Motion Design', description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.' },
  { name: 'Branding', description: 'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.' },
  { name: 'Web Design', description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.' },
] as const;

export const projects = [
  { name: 'Nextlevel Studio', category: 'Client', images: [
    { src: '/images/project-1-1.webp', alt: 'Nextlevel Studio — colorful flowers and floating golden particles' },
    { src: '/images/project-1-2.webp', alt: 'Nextlevel Studio — atmospheric lighting and material study' },
    { src: '/images/project-1-3.webp', alt: 'Nextlevel Studio — sunlit flowers in a magical woodland scene' },
  ] },
  { name: 'Aura Brand Identity', category: 'Personal', images: [
    { src: '/images/project-2-1.webp', alt: 'Aura Brand Identity — lavender flowers along a mountain path' },
    { src: '/images/project-2-2.webp', alt: 'Aura Brand Identity — rows of purple flowers beside a mountain lake' },
    { src: '/images/project-2-3.webp', alt: 'Aura Brand Identity — violet flowers surrounding a still mountain lake' },
  ] },
  { name: 'Solaris Digital', category: 'Client', images: [
    { src: '/images/project-3-1.webp', alt: 'Solaris Digital — an immersive 3D concept' },
    { src: '/images/project-3-2.webp', alt: 'Solaris Digital — a detailed environment composition' },
    { src: '/images/project-3-3.webp', alt: 'Solaris Digital — a golden sunflower field in the evening light' },
  ] },
] as const;

export type Project = (typeof projects)[number];
