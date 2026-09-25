import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '../../api/types';

const { createInteraction } = vi.hoisted(() => ({ createInteraction: vi.fn() }));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    interactions = { create: createInteraction };
    constructor(_options: { apiKey: string }) {}
  },
}));

import chatHandler from '../../api/chat';

type MockResponse = VercelResponse & { statusCode: number; data?: unknown; headers: Record<string, string> };

function makeRequest(body: unknown, overrides: Partial<VercelRequest> = {}) {
  const bytes = Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body));
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': String(bytes) },
    body,
    ...overrides,
  } as unknown as VercelRequest;
}

function makeResponse(): MockResponse {
  const response = {
    statusCode: 200,
    data: undefined as unknown,
    headers: {} as Record<string, string>,
    setHeader(name: string, value: string) { this.headers[name] = value; return this; },
    status(code: number) { this.statusCode = code; return this; },
    json(data: unknown) { this.data = data; return this; },
  };
  return response as unknown as MockResponse;
}

describe('POST /api/chat', () => {
  const originalApiKey = process.env.GEMINI_API_KEY;
  const originalModel = process.env.GEMINI_MODEL;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-only-placeholder';
    delete process.env.GEMINI_MODEL;
    createInteraction.mockReset();
  });

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalApiKey;
    if (originalModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = originalModel;
    vi.restoreAllMocks();
  });

  it('rejects methods other than POST', async () => {
    const response = makeResponse();
    await chatHandler(makeRequest({}, { method: 'GET' }), response);
    expect(response.statusCode).toBe(405);
    expect(response.headers.Allow).toBe('POST');
  });

  it('rejects malformed JSON and empty messages', async () => {
    const malformed = makeRequest('{}');
    Object.defineProperty(malformed, 'body', { get() { throw new SyntaxError('invalid json'); } });
    const malformedResponse = makeResponse();
    await chatHandler(malformed, malformedResponse);
    expect(malformedResponse.statusCode).toBe(400);

    const emptyResponse = makeResponse();
    await chatHandler(makeRequest({ message: '   ' }), emptyResponse);
    expect(emptyResponse.statusCode).toBe(400);
  });

  it('rejects oversized bodies and messages before calling Gemini', async () => {
    const largeResponse = makeResponse();
    await chatHandler(makeRequest({}, { headers: { 'content-type': 'application/json', 'content-length': '9000' } }), largeResponse);
    expect(largeResponse.statusCode).toBe(413);

    const longResponse = makeResponse();
    await chatHandler(makeRequest({ message: 'a'.repeat(1201) }), longResponse);
    expect(longResponse.statusCode).toBe(400);
    expect(createInteraction).not.toHaveBeenCalled();
  });

  it('requires a server-side API key and never returns internal details', async () => {
    delete process.env.GEMINI_API_KEY;
    const response = makeResponse();
    await chatHandler(makeRequest({ message: 'What does Nam study?' }), response);
    expect(response.statusCode).toBe(503);
    expect(response.data).toEqual({ error: expect.stringMatching(/not configured/i) });
    expect(createInteraction).not.toHaveBeenCalled();
  });

  it('uses the configured Flash model through Interactions with grounded context and low reasoning', async () => {
    process.env.GEMINI_MODEL = 'gemini-3.8-flash';
    createInteraction.mockResolvedValue({ output_text: 'Nam studies Artificial Intelligence at UET.' });
    const response = makeResponse();

    await chatHandler(makeRequest({ message: 'What does Nam study?' }), response);

    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ message: 'Nam studies Artificial Intelligence at UET.' });
    expect(createInteraction).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-3.8-flash',
      input: 'What does Nam study?',
      store: false,
      system_instruction: expect.stringContaining('University of Engineering and Technology'),
      generation_config: expect.objectContaining({
        thinking_level: 'low',
        max_output_tokens: expect.any(Number),
      }),
    }));
    expect(response.headers['Cache-Control']).toBe('no-store');
  });

  it('returns a generic error if Gemini fails', async () => {
    createInteraction.mockRejectedValue(new Error('private provider response detail'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = makeResponse();

    await chatHandler(makeRequest({ message: 'Tell me about Nam' }), response);

    expect(response.statusCode).toBe(502);
    expect(JSON.stringify(response.data)).not.toContain('private provider response detail');
    expect(log).toHaveBeenCalled();
  });

  it('rate limits repeated requests from the same client before calling Gemini again', async () => {
    createInteraction.mockResolvedValue({ output_text: 'A concise portfolio answer.' });
    const headers = {
      'content-type': 'application/json',
      'content-length': '29',
      'x-forwarded-for': '203.0.113.42',
    };

    for (let index = 0; index < 12; index += 1) {
      const response = makeResponse();
      await chatHandler(makeRequest({ message: 'Tell me about Nam' }, { headers }), response);
      expect(response.statusCode).toBe(200);
    }

    const limited = makeResponse();
    await chatHandler(makeRequest({ message: 'Tell me about Nam' }, { headers }), limited);

    expect(limited.statusCode).toBe(429);
    expect(limited.headers['Retry-After']).toMatch(/^\d+$/);
    expect(createInteraction).toHaveBeenCalledTimes(12);
  });
});
