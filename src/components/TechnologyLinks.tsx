const technologyLogos = [
  { name: 'Python', file: 'python.svg', url: 'https://www.python.org/' },
  { name: 'Go', file: 'go.svg', url: 'https://go.dev/' },
  { name: 'PyTorch', file: 'pytorch.svg', url: 'https://pytorch.org/' },
  { name: 'scikit-learn', file: 'scikitlearn.svg', url: 'https://scikit-learn.org/' },
  { name: 'Hugging Face', file: 'huggingface.svg', url: 'https://huggingface.co/' },
  { name: 'Ultralytics', file: 'ultralytics.svg', url: 'https://www.ultralytics.com/' },
  { name: 'NumPy', file: 'numpy.svg', url: 'https://numpy.org/' },
  { name: 'PostgreSQL', file: 'postgresql.svg', url: 'https://www.postgresql.org/' },
  { name: 'MongoDB', file: 'mongodb.svg', url: 'https://www.mongodb.com/' },
  { name: 'Docker', file: 'docker.svg', url: 'https://www.docker.com/' },
  { name: 'GitHub Actions', file: 'githubactions.svg', url: 'https://github.com/features/actions' },
] as const;

export function TechnologyLinks() {
  return (
    <ul className="toolkit-logos" aria-label="Technology homepages">
      {technologyLogos.map(({ name, file, url }) => (
        <li key={file}>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}>
            <img src={`/images/technologies/${file}`} alt="" width="28" height="28" loading="lazy" decoding="async" />
          </a>
        </li>
      ))}
    </ul>
  );
}
