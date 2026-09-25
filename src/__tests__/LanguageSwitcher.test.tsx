import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { HeroSection } from '../sections/HeroSection';

vi.mock('../components/FadeIn', () => ({
  FadeIn: ({ as: Element = 'div', children }: { as?: keyof JSX.IntrinsicElements; children: React.ReactNode }) => <Element>{children}</Element>,
}));
vi.mock('../components/ProfileBadge', () => ({ ProfileBadge: () => <div /> }));
vi.mock('../components/HeroBackdrop', () => ({ HeroBackdrop: () => null }));

describe('language switcher', () => {
  beforeEach(() => window.localStorage.clear());

  it('switches and persists the selected language', async () => {
    const user = userEvent.setup();
    render(<LanguageProvider><LanguageSwitcher /></LanguageProvider>);

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Tiếng Việt' }));
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toHaveAttribute('aria-pressed', 'true');
    expect(window.localStorage.getItem('portfolio-language')).toBe('vi');
  });

  it('updates the portfolio header and hero copy when the language changes', async () => {
    const user = userEvent.setup();
    render(<LanguageProvider><HeroSection /></LanguageProvider>);

    await user.click(screen.getByRole('button', { name: 'Tiếng Việt' }));
    expect(screen.getByRole('link', { name: 'Giới thiệu' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('heading', { name: 'KIẾN TẠOTRÍ TUỆ.' })).toBeInTheDocument();
  });
});
