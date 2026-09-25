import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('../sections/HeroSection', () => ({ HeroSection: () => null }));
vi.mock('../sections/MarqueeSection', () => ({ MarqueeSection: () => null }));
vi.mock('../sections/AboutSection', () => ({ AboutSection: () => null }));
vi.mock('../sections/ExperimentSection', () => ({ ExperimentSection: () => null }));
vi.mock('../sections/ProjectsSection', () => ({ ProjectsSection: () => null }));

const jsonResponse = (body: unknown, ok = true) => ({
  ok,
  json: async () => body,
}) as Response;

describe('portfolio assistant', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('opens and closes the assistant panel', async () => {
    const user = userEvent.setup();
    render(<App />);

    const launcher = screen.getByRole('button', { name: /ask ai about nam/i });
    expect(launcher).toHaveAttribute('aria-expanded', 'false');

    await user.click(launcher);

    expect(screen.getByRole('dialog', { name: /nam's portfolio assistant/i })).toBeInTheDocument();
    expect(screen.getByText(/ask about his experience, projects, skills, or research/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /minimize chat/i }));
    expect(screen.queryByRole('dialog', { name: /nam's portfolio assistant/i })).not.toBeInTheDocument();
  });

  it('sends a question, shows loading, and renders the grounded reply', async () => {
    const user = userEvent.setup();
    let finishRequest!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValue(new Promise(resolve => { finishRequest = resolve; }));
    render(<App />);

    await user.click(screen.getByRole('button', { name: /ask ai about nam/i }));
    const input = screen.getByRole('textbox', { name: /your message/i });
    await user.type(input, 'What computer vision work has Nam done?');
    await user.click(screen.getByRole('button', { name: /^send question$/i }));

    expect(await screen.findByText(/thinking/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What computer vision work has Nam done?' }),
    }));

    finishRequest(jsonResponse({ message: 'Nam worked on UAV thermal and infrared target detection.' }));
    expect(await screen.findByText(/UAV thermal and infrared target detection/i)).toBeInTheDocument();
  });

  it('submits a suggested question', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ message: 'Nam studies AI.' }));
    render(<App />);

    await user.click(screen.getByRole('button', { name: /ask ai about nam/i }));
    await user.click(screen.getByRole('button', { name: /what does nam specialize in/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      body: expect.stringContaining('What does Nam specialize in?'),
    })));
    expect(await screen.findByText('Nam studies AI.')).toBeInTheDocument();
  });

  it('shows a safe error when the API is unavailable', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockRejectedValue(new Error('internal endpoint details'));
    render(<App />);

    await user.click(screen.getByRole('button', { name: /ask ai about nam/i }));
    await user.type(screen.getByRole('textbox', { name: /your message/i }), 'Tell me about Nam');
    await user.click(screen.getByRole('button', { name: /^send question$/i }));

    expect(await screen.findByText(/couldn't reach the assistant/i)).toBeInTheDocument();
    expect(screen.queryByText(/internal endpoint details/i)).not.toBeInTheDocument();
  });

  it('collapses on outside click and restores the cached conversation when opened again', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ message: 'Nam studies artificial intelligence.' }));
    const view = render(<><button type="button">Outside area</button><App /></>);

    await user.click(screen.getByRole('button', { name: /ask ai about nam/i }));
    await user.type(screen.getByRole('textbox', { name: /your message/i }), 'What does Nam study?');
    await user.click(screen.getByRole('button', { name: /^send question$/i }));
    expect(await screen.findByText('Nam studies artificial intelligence.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside area' }));
    expect(screen.queryByRole('dialog', { name: /nam's portfolio assistant/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /ask ai about nam/i }));
    expect(screen.getByText('Nam studies artificial intelligence.')).toBeInTheDocument();

    view.unmount();
    render(<App />);
    expect(screen.getByRole('button', { name: /ask ai about nam/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /ask ai about nam/i }));
    expect(screen.getByText('Nam studies artificial intelligence.')).toBeInTheDocument();
  });
});
