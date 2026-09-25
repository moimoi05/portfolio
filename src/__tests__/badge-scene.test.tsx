import { act, fireEvent, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { animate } from 'framer-motion';
import { useBadgeScene } from '../components/useBadgeScene';

vi.mock('framer-motion', async importOriginal => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return { ...actual, animate: vi.fn(() => Object.assign(Promise.resolve(), { stop: vi.fn() })) };
});
beforeEach(() => vi.clearAllMocks());
const flush = () => act(async () => { await Promise.resolve(); });

describe('badge scene lifecycle', () => {
  it('stops its shared timeline offscreen and restarts it when visible', async () => {
    const { result, rerender } = renderHook(({ active }) => useBadgeScene(active, false, false), { initialProps: { active: true } });
    await flush();
    expect(animate).toHaveBeenCalledWith(result.current.clock, 9, expect.objectContaining({ repeat: Infinity }));
    const loops = vi.mocked(animate).mock.results.slice(-3).map(entry => entry.value);
    rerender({ active: false });
    expect(loops.every(loop => loop.stop.mock.calls.length === 1)).toBe(true);
    const stoppedCalls = vi.mocked(animate).mock.calls.length;
    await flush();
    expect(animate).toHaveBeenCalledTimes(stoppedCalls);
    rerender({ active: true });
    await flush();
    expect(vi.mocked(animate).mock.calls.length).toBeGreaterThan(stoppedCalls);
  });

  it('releases simple clicks but lets drag-end supply the actual release velocity', async () => {
    const { result } = renderHook(() => useBadgeScene(true, false, false));
    await flush();
    act(() => result.current.startPress());
    const pressedCalls = vi.mocked(animate).mock.calls.length;
    fireEvent.pointerUp(window);
    await flush();
    expect(vi.mocked(animate).mock.calls.length).toBeGreaterThan(pressedCalls);

    act(() => { result.current.startPress(); result.current.startDrag(); });
    const draggingCalls = vi.mocked(animate).mock.calls.length;
    fireEvent.pointerUp(window);
    await flush();
    expect(animate).toHaveBeenCalledTimes(draggingCalls);
    act(() => result.current.finishDrag({ x: 300, y: -200 }));
    await flush();
    expect(animate).toHaveBeenCalledWith(result.current.x, 0, expect.objectContaining({ velocity: 90 }));
    expect(animate).toHaveBeenCalledWith(result.current.y, 0, expect.objectContaining({ velocity: -65 }));
  });

  it('recovers an interrupted drag on blur and removes window listeners on unmount', async () => {
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(() => useBadgeScene(true, false, true));
    await flush();
    act(() => { result.current.startPress(); result.current.startDrag(); });
    const beforeBlur = vi.mocked(animate).mock.calls.length;
    fireEvent.blur(window);
    await flush();
    expect(vi.mocked(animate).mock.calls.length).toBeGreaterThan(beforeBlur);
    unmount();
    expect(removeListener).toHaveBeenCalledWith('blur', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('pointerup', expect.any(Function));
    removeListener.mockRestore();
  });
});
