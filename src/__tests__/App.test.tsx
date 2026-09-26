import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

const contactHref = 'mailto:nnam.hp2005@gmail.com';
const privateProjects = ['Medical Supply Management', 'UAV Thermal Vision', 'Alzheimer’s Prognosis', 'AI for Rehabilitation'];

describe('Nam portfolio', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });
  it('links verified education, research affiliation, and the CV page', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /University of Engineering and Technology/ })).toHaveAttribute('href', 'https://uet.edu.vn/');
    expect(screen.getByText('Artificial Intelligence', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('3.28', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'AVITECH Research Group' })).toHaveAttribute('href', 'https://avitechresearch.vn/');
    expect(screen.getByRole('link', { name: /view cv/i })).toHaveAttribute('href', '/cv');
    expect(screen.getByText(/Backend systems with Golang and SQL/)).toBeInTheDocument();
  });

  it('credits published reference figures separately from personal research', () => {
    render(<App />);
    for (const name of ['Alzheimer’s Prognosis', 'AI for Rehabilitation']) {
      const card = within(screen.getByRole('article', { name }));
      expect(card.getByRole('img', { name: /published.*pipeline/i })).toHaveAttribute('src', expect.stringContaining('/images/research/'));
      expect(card.getByRole('link', { name: /source paper/i })).toHaveAttribute('href', expect.stringMatching(/^https:\/\//));
      expect(card.getByText('Related research / Reference figure')).toBeInTheDocument();
      expect(card.getByRole('link', { name: 'CC BY 4.0' })).toBeInTheDocument();
    }
  });

  it('opens a bilingual CV page, syncs its language choice, and serves the original PDF', () => {
    window.localStorage.removeItem('portfolio-language');
    window.history.replaceState(null, '', '/cv');
    const { unmount } = render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Nguyen Phuong Nam' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open original pdf/i })).toHaveAttribute('href', '/cv/CV_Nguyen_Phuong_Nam.pdf');
    expect(screen.getByRole('img', { name: /curriculum vitae/i })).toHaveAttribute('src', '/cv/cv-preview.webp');
    expect(screen.getByRole('link', { name: /back to portfolio/i })).toHaveAttribute('href', '/#about');
    fireEvent.click(screen.getByRole('button', { name: 'Tiếng Việt' }));
    expect(window.localStorage.getItem('portfolio-language')).toBe('vi');
    expect(screen.getByRole('link', { name: /quay lại portfolio/i })).toHaveAttribute('href', '/#about');
    expect(screen.getByRole('heading', { name: 'Học vấn & thành tích' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    unmount();
    window.history.replaceState(null, '', '/');
  });
  it('presents the new hero while preserving navigation to Experience', () => {
    render(<App />);
    const hero = within(document.getElementById('top')!);
    expect(hero.getByRole('heading', { level: 1 })).toHaveTextContent(/BUILDING\s*INTELLIGENCE\./);
    expect(hero.getByRole('img', { name: 'Nguyen Phuong Nam' })).toHaveAttribute('src', '/images/NguenPhuongNamv2.webp');
    expect(hero.getByRole('link', { name: /view my work/i })).toHaveAttribute('href', '#projects');
    expect(hero.getByRole('link', { name: /contact me/i })).toHaveAttribute('href', contactHref);
    const navigation = within(screen.getByRole('navigation', { name: /primary/i }));
    for (const [name, sectionId] of [['About', 'about'], ['Experience', 'experience'], ['Projects', 'projects']]) {
      expect(navigation.getByRole('link', { name })).toHaveAttribute('href', `#${sectionId}`);
      expect(document.getElementById(sectionId)).toBeInTheDocument();
    }
    expect(navigation.queryByRole('link', { name: 'Price' })).not.toBeInTheDocument();
    expect(navigation.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', contactHref);
  });

  it('switches the portfolio and assistant copy to Vietnamese', async () => {
    window.localStorage.removeItem('portfolio-language');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Tiếng Việt' }));

    expect(document.documentElement).toHaveAttribute('lang', 'vi');
    expect(screen.getByRole('navigation', { name: 'Điều hướng chính' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Giới thiệu' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kinh nghiệm' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dự án tiêu biểu' })).toBeInTheDocument();
    expect(screen.getAllByText('Bài báo nguồn')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Hỏi AI về Nam' }));
    expect(await screen.findByRole('dialog', { name: 'Trợ lý portfolio của Nam' }, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Tin nhắn của bạn' })).toHaveAttribute('placeholder', 'Hỏi về công việc của Nam…');

    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(document.documentElement).toHaveAttribute('lang', 'en');
  }, 15_000);

  it('uses Nam’s actual profile and preserves the email contact links', () => {
    render(<App />);
    const about = within(document.getElementById('about')!);
    expect(about.getByText(/I’m Nguyen Phuong Nam/)).toBeInTheDocument();
    expect(about.getByText('Viettel High Tech')).toBeInTheDocument();
    expect(about.getByText('Central Military Hospital 108')).toBeInTheDocument();
    expect(screen.queryByText(/five years of experience/)).not.toBeInTheDocument();
    expect(about.getByRole('link', { name: /contact me/i })).toHaveAttribute('href', contactHref);
    expect(screen.getByRole('link', { name: /let.s build something/i })).toHaveAttribute('href', contactHref);
  });

  it('presents side builds under Experience without fictional achievements', () => {
    render(<App />);
    const experiment = within(document.getElementById('experience')!);
    expect(experiment.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    for (const name of ['Service websites', 'Workflow automation', 'AI-assisted utilities', 'Data processing tools']) {
      expect(experiment.getByRole('heading', { name })).toBeInTheDocument();
    }
  });

  it('shows real GUU & T screenshots and its live website', () => {
    render(<App />);
    const project = within(screen.getByRole('article', { name: 'GUU & T DESIGN' }));
    expect(project.getByRole('heading', { name: 'GUU & T DESIGN' })).toBeInTheDocument();
    const images = project.getAllByRole('img');
    expect(images).toHaveLength(3);
    images.forEach(image => {
      expect(image.getAttribute('src')).toContain('/images/guut/');
      expect(image.getAttribute('alt')?.trim().length).toBeGreaterThan(0);
    });
    const liveLink = project.getByRole('link', { name: /live project/i });
    expect(liveLink).toHaveAttribute('href', 'https://guut.com.vn');
    expect(liveLink).toHaveAttribute('target', '_blank');
    expect(liveLink.getAttribute('rel')?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
  });

  it.each(privateProjects)('opens grounded case-study details for %s', async (name) => {
    render(<App />);
    const card = within(screen.getByRole('article', { name }));
    expect(card.queryByRole('link', { name: /live project/i })).not.toBeInTheDocument();
    fireEvent.click(card.getByRole('button', { name: /view project/i }));
    const dialog = await screen.findByRole('dialog', { name });
    expect(dialog).toHaveTextContent(/concept|reference figure/i);
    fireEvent.click(within(dialog).getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
