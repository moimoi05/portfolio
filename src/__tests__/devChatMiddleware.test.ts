import { Readable } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';
import { createDevChatMiddleware } from '../../api/devChatMiddleware';
import type { VercelRequest, VercelResponse } from '../../api/types';

function makeRequest(path = '/api/chat') {
  const request = Readable.from([JSON.stringify({ message: 'What does Nam study?' })]) as Readable & {
    url?: string;
    method?: string;
    headers: Record<string, string>;
  };
  request.url = path;
  request.method = 'POST';
  request.headers = { 'content-type': 'application/json' };
  return request;
}

function makeResponse() {
  const headers: Record<string, string> = {};
  return {
    statusCode: 200,
    headers,
    body: '',
    setHeader(name: string, value: string) { headers[name] = value; },
    end(body = '') { this.body = body; },
  };
}

describe('Vite development chat middleware', () => {
  it('adapts /api/chat requests to the server-only chat handler', async () => {
    const handler = vi.fn(async (request: VercelRequest, response: VercelResponse) => {
      expect(request.body).toBe(JSON.stringify({ message: 'What does Nam study?' }));
      response.status(200).json({ message: 'Nam studies Artificial Intelligence.' });
    });
    const middleware = createDevChatMiddleware(handler);
    const response = makeResponse();
    const next = vi.fn();

    await middleware(makeRequest(), response, next);

    expect(handler).toHaveBeenCalledOnce();
    expect(next).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.headers['Content-Type']).toMatch(/application\/json/);
    expect(JSON.parse(response.body)).toEqual({ message: 'Nam studies Artificial Intelligence.' });
  });

  it('passes unrelated routes through to Vite', async () => {
    const handler = vi.fn();
    const middleware = createDevChatMiddleware(handler);
    const next = vi.fn();

    await middleware(makeRequest('/assets/app.js'), makeResponse(), next);

    expect(next).toHaveBeenCalledOnce();
    expect(handler).not.toHaveBeenCalled();
  });
});
