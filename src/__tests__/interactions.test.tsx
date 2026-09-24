import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { useInView, useReducedMotion } from 'framer-motion';
import { Magnet } from '../components/Magnet';
import { MarqueeSection } from '../sections/MarqueeSection';
import App from '../App';
import { ProfileBadge } from '../components/ProfileBadge';

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return { ...actual, useInView: vi.fn(() => false), useReducedMotion: vi.fn(() => false) };
});

const defaultMediaQuery = window.matchMedia('');

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  vi.mocked(window.matchMedia).mockReturnValue(defaultMediaQuery);
  vi.mocked(useInView).mockReturnValue(false);
  vi.mocked(useReducedMotion).mockReturnValue(false);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('hero scene controls', () => {
  it('lets visitors pause and resume the decorative scene without hiding the portrait', () => {
    render(<ProfileBadge />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause hero animation' }));
    expect(screen.getByRole('button', { name: 'Play hero animation' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: 'Nguyen Phuong Nam' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play hero animation' }));
    expect(screen.getByRole('button', { name: 'Pause hero animation' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps a static decorative greeting when reduced motion is requested', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<ProfileBadge />);
    expect(screen.queryByRole('button', { name: /hero animation/ })).not.toBeInTheDocument();
    expect(container.querySelector('.hero-mascot')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('img', { name: 'Nguyen Phuong Nam' })).toBeInTheDocument();
  });
});

describe('magnetic portrait interaction', () => {
  it('responds to a fine pointer, resets on leave, and removes listeners on unmount', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ ...defaultMediaQuery, matches: true });
    let nextFrame: FrameRequestCallback | undefined;
    const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      nextFrame = callback;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const { container, unmount } = render(<Magnet><img alt="Nam" /></Magnet>);
    const anchor = container.firstElementChild as HTMLElement;
    const moving = anchor.firstElementChild as HTMLElement;
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({ left: 100, top: 200, width: 200, height: 300 } as DOMRect);

    fireEvent(window, new MouseEvent('pointermove', { clientX: 260, clientY: 260 }));
    act(() => nextFrame?.(0));
    expect(moving.style.transform).toBe('translate3d(20px, -30px, 0)');
    fireEvent(document, new Event('pointerleave'));
    expect(moving.style.transform).toBe('translate3d(0, 0, 0)');

    fireEvent(window, new MouseEvent('pointermove', { clientX: 900, clientY: 900 }));
    act(() => nextFrame?.(0));
    expect(moving.style.transform).toBe('translate3d(0px, 0px, 0)');
    unmount();
    const previousCalls = request.mock.calls.length;
    fireEvent(window, new MouseEvent('pointermove', { clientX: 260, clientY: 260 }));
    expect(request).toHaveBeenCalledTimes(previousCalls);
  });

  it('does not track the pointer when reduced motion is requested', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const request = vi.spyOn(window, 'requestAnimationFrame');
    render(<Magnet><img alt="Nam" /></Magnet>);
    fireEvent(window, new MouseEvent('pointermove', { clientX: 260, clientY: 260 }));
    expect(request).not.toHaveBeenCalled();
  });
});

describe('creative reel controls', () => {
  it('loads animations only for visible tiles and swaps to still images when paused', () => {
    vi.mocked(useInView).mockReturnValue(true);
    const { container } = render(<MarqueeSection />);
    expect(container.querySelector('video')?.src).toContain('/videos/reel/1.mp4');
    fireEvent.click(screen.getByRole('button', { name: 'Pause motion' }));
    expect(container.querySelector('video')).toBeNull();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalled();
    expect(container.querySelector('img')?.src).toContain('/images/reel/1.jpg');
    expect(screen.getByRole('button', { name: 'Play motion' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Play motion' }));
    expect(container.querySelector('video')?.src).toContain('/videos/reel/1.mp4');
  });

  it('uses a local poster when an animation cannot load', () => {
    vi.mocked(useInView).mockReturnValue(true);
    const { container } = render(<MarqueeSection />);
    const tile = container.querySelector('.marquee-tile')!;
    fireEvent.error(tile.querySelector('video')!);
    expect(tile.querySelector('video')).toBeNull();
    expect(tile.querySelector('img')?.src).toContain('/images/reel/1.jpg');
  });

  it('updates the reel when the page scrolls and cleans up its animation frame', () => {
    vi.mocked(useInView).mockReturnValue(true);
    vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(9600);
    let nextFrame: FrameRequestCallback | undefined;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { nextFrame = callback; return 7; });
    const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const { container, unmount } = render(<MarqueeSection />);
    const rows = container.querySelectorAll<HTMLElement>('.marquee-row');
    const before = rows[0].style.transform;
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100);
    const readLayout = vi.spyOn(container.querySelector('section')!, 'getBoundingClientRect');
    fireEvent.scroll(window);
    act(() => nextFrame?.(0));
    expect(rows[0].style.transform).not.toBe(before);
    expect(rows[0].style.transform).not.toBe(rows[1].style.transform);
    expect(readLayout).not.toHaveBeenCalled();
    fireEvent.scroll(window);
    unmount();
    expect(cancel).toHaveBeenCalledWith(7);
  });

  it('does no scroll work and mounts no videos while the reel is offscreen', () => {
    const request = vi.spyOn(window, 'requestAnimationFrame');
    const { container } = render(<MarqueeSection />);
    fireEvent.scroll(window);
    expect(request).not.toHaveBeenCalled();
    expect(container.querySelector('video')).toBeNull();
  });

  it('releases animated previews when the browser tab is hidden', () => {
    vi.mocked(useInView).mockReturnValue(true);
    const { container } = render(<MarqueeSection />);
    expect(container.querySelector('video')).not.toBeNull();
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    expect(container.querySelector('video')).toBeNull();
  });

  it('renders the full readable portfolio without animated tiles in reduced-motion mode', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    vi.mocked(useInView).mockReturnValue(true);
    const { container } = render(<App />);
    expect(screen.queryByRole('button', { name: 'Pause motion' })).not.toBeInTheDocument();
    expect(container.querySelector('.about-copy')?.textContent).toContain("I’m Nguyen Phuong Nam");
    const images = container.querySelectorAll<HTMLImageElement>('.marquee-tile img');
    expect(Array.from(images).every(image => image.src.endsWith('.jpg'))).toBe(true);
  });
});
