import { describe, expect, it, vi } from 'vitest';
import { handleRequest } from '../../cloudflare/worker';

const request = new Request('https://nnam.id.vn/cv?lang=vi');

describe('Cloudflare origin fallback', () => {
  it('passes a healthy origin response through', async () => {
    const response = new Response('portfolio', { status: 200 });
    const originFetch = vi.fn().mockResolvedValue(response);
    expect(await handleRequest(request, originFetch)).toBe(response);
  });

  it.each([500, 502, 503, 504, 522])('redirects origin status %i to the same Vercel path', async status => {
    const response = await handleRequest(request, vi.fn().mockResolvedValue(new Response('down', { status })));
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://portfolio-one-sand-hdgsu9hs2b.vercel.app/cv?lang=vi');
  });

  it('redirects when the origin is unreachable', async () => {
    const response = await handleRequest(request, vi.fn().mockRejectedValue(new Error('origin offline')));
    expect(response.headers.get('location')).toBe('https://portfolio-one-sand-hdgsu9hs2b.vercel.app/cv?lang=vi');
  });

  it('redirects the current T3 default server page even though it returns HTTP 200', async () => {
    const placeholder = new Response('<html><title>Trang mặc định của máy chủ</title></html>', {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
    const response = await handleRequest(request, vi.fn().mockResolvedValue(placeholder));
    expect(response.headers.get('location')).toBe('https://portfolio-one-sand-hdgsu9hs2b.vercel.app/cv?lang=vi');
  });
});
