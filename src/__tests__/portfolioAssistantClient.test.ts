import { afterEach, expect, it, vi } from 'vitest';
import { askPortfolioAssistant } from '../lib/portfolioAssistantClient';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it.each([null, {}, { message: 42 }, { message: '  ' }])('rejects an invalid assistant response %j', async body => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => body }));
  await expect(askPortfolioAssistant('Hello')).rejects.toThrow();
});

it('aborts a stalled request at the browser deadline and clears its timer', async () => {
  vi.useFakeTimers();
  let requestSignal: AbortSignal | undefined;
  vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
    requestSignal = options.signal as AbortSignal;
    requestSignal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  })));
  const request = askPortfolioAssistant('Hello');
  const assertion = expect(request).rejects.toMatchObject({ name: 'AbortError' });
  await vi.advanceTimersByTimeAsync(25_000);
  await assertion;
  expect(requestSignal?.aborted).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});
