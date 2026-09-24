export type PreviewKind = 'website' | 'systems' | 'vision' | 'research' | 'rehabilitation';
export interface SelectedProject {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly preview: PreviewKind;
  readonly liveUrl?: string;
  readonly context: string;
  readonly details: readonly { readonly title: string; readonly body: string }[];
}
export const selectedProjects: readonly SelectedProject[] = [
  {
    id: 'guut', name: 'GUU & T DESIGN', category: 'Client website / Interior architecture',
    description: 'A digital home for a premium interior design and architecture brand, bringing its spaces and approach to personalized living into focus.',
    tags: ['Company website', 'Interior design', 'Live website'], preview: 'website', liveUrl: 'https://guut.com.vn',
    context: 'A company website for GUU & T DESIGN.', details: [],
  },
  {
    id: 'medical-supply', name: 'Medical Supply Management', category: 'Equipment Department / Central Military Hospital 108',
    description: 'An end-to-end medical supply management system built with Golang and SQL: departmental forecasts, approval workflows, supplier orders, invoice reconciliation, real-time updates, and a Gemini-powered RAG chatbot.',
    tags: ['Golang / Gin', 'SQL / MySQL', 'REST APIs', 'WebSocket', 'Gemini / RAG'], preview: 'systems',
    context: 'Junior Software Developer in the Equipment Department at Central Military Hospital 108 (December 2025 – September 2026). Developed and deployed an internal medical supply management application supporting workflows across hospital departments.',
    details: [
      { title: 'Backend & data', body: 'Designed the database schema, RESTful APIs, and backend business logic using Golang, Gin, and SQL (MySQL), connected to a React and TypeScript interface.' },
      { title: 'Medical supply workflows', body: 'Supported supply catalog and stock lookup, departmental forecasts with approval history, supplier orders, and invoice reconciliation. These connected workflows help departments move from requests to procurement and verification.' },
      { title: 'Real-time communication & deployment', body: 'Integrated WebSocket updates to keep application views synchronized and worked on deployment of the internal web application.' },
      { title: 'Retrieval-assisted support', body: 'Integrated a Gemini API-powered RAG chatbot over application data and internal knowledge to support information lookup. The concept diagram summarizes the system without publishing internal records.' },
    ],
  },
  {
    id: 'uav-thermal', name: 'UAV Thermal Vision', category: 'AI internship / Viettel High Tech',
    description: 'Computer vision work with UAV thermal and infrared imagery, exploring object detection and perception in a different visual spectrum.',
    tags: ['Computer vision', 'Thermal / Infrared', 'Object detection'], preview: 'vision',
    context: 'Applied computer vision work during an AI internship at Viettel High Tech, with a focus on UAV perception and thermal / infrared imagery.',
    details: [
      { title: 'Perception focus', body: 'Working with thermal and infrared data for object detection and UAV perception tasks.' },
      { title: 'Engineering context', body: 'Built an X-Plane 11 camera simulation plugin and integrated objects and maps into simulated aerial environments in the UAV Perception and Navigation Department.' },
      { title: 'Preview boundaries', body: 'The visual is an abstract illustration of an image-to-detection pipeline. It contains no operational imagery, location data, confidence scores, or claimed evaluation results.' },
    ],
  },
  {
    id: 'alzheimers-research', name: 'Alzheimer’s Prognosis', category: 'Thesis research / AVITECH Research Group, VNU-UET',
    description: 'Research into deep learning for Alzheimer’s disease prognosis, connecting multimodal information with observations collected over time.',
    tags: ['Deep learning', 'Multimodal data', 'Longitudinal modeling'], preview: 'research',
    context: 'Ongoing undergraduate thesis research at AVITECH Research Group, VNU-UET, focused on Alzheimer’s disease progression over time through deep learning and multimodal, longitudinal data.',
    details: [
      { title: 'Research question', body: 'Exploring how different sources of information and their changes over time can inform a prognosis task.' },
      { title: 'Modeling perspective', body: 'The work combines a multimodal perspective with longitudinal modeling, bringing attention to both the type and timing of observations.' },
      { title: 'Research status', body: 'Ongoing thesis research. The published reference figure is from Wang et al. (2024), illustrating a related multimodal architecture; it is not a model or result authored by Nam.' },
    ],
  },
  {
    id: 'ai-rehabilitation', name: 'AI for Rehabilitation', category: 'Research collaboration / Central Military Hospital 108',
    description: 'Ongoing research into AI for rehabilitation, in collaboration with the Department of Rehabilitation at Central Military Hospital 108.',
    tags: ['Applied AI', 'Rehabilitation', 'Ongoing research'], preview: 'rehabilitation',
    context: 'An ongoing research direction in AI for rehabilitation, developed in collaboration with the Department of Rehabilitation, Central Military Hospital 108.',
    details: [
      { title: 'Research focus', body: 'Exploring how AI can support rehabilitation, connecting computational research with the needs and expertise of a clinical rehabilitation team.' },
      { title: 'Collaboration', body: 'Collaboration with the Department of Rehabilitation at Central Military Hospital 108.' },
      { title: 'Related literature', body: 'The reference figure is the Rehab-DRLX architecture published by Alsolai et al. (2026). It provides context from related rehabilitation AI literature; it does not represent Nam’s own implementation or research results.' },
    ],
  },
];
