import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TechnologyLinks } from '../components/TechnologyLinks';

describe('working toolkit links', () => {
  it('shows only linked SVG tool marks that open each tool homepage in a new tab', () => {
    render(<TechnologyLinks />);

    const python = screen.getByRole('link', { name: 'Python' });
    expect(python).toHaveAttribute('href', 'https://www.python.org/');
    expect(python).toHaveAttribute('target', '_blank');
    expect(python).toHaveAttribute('rel', 'noopener noreferrer');
    expect(python.querySelector('img')?.getAttribute('src')).toMatch(/\.svg$/);
    expect(screen.queryByText('Python')).not.toBeInTheDocument();
  });
});
