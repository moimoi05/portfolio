import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '../../api/types';

const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent };
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
    generateContent.mockReset();
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
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('requires a server-side API key and never returns internal details', async () => {
    delete process.env.GEMINI_API_KEY;
    const response = makeResponse();
    await chatHandler(makeRequest({ message: 'What does Nam study?' }), response);
    expect(response.statusCode).toBe(503);
    expect(response.data).toEqual({ error: expect.stringMatching(/not configured/i) });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('uses the configured Flash model and grounded portfolio context', async () => {
    process.env.GEMINI_MODEL = 'gemini-3.8-flash';
    generateContent.mockResolvedValue({ text: 'Nam studies Artificial Intelligence at UET.' });
    const response = makeResponse();

    await chatHandler(makeRequest({ message: 'What does Nam study?' }), response);

    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ message: 'Nam studies Artificial Intelligence at UET.' });
    expect(generateContent).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-3.8-flash',
      contents: expect.arrayContaining([expect.objectContaining({ role: 'user' })]),
      config: expect.objectContaining({
        maxOutputTokens: expect.any(Number),
        systemInstruction: expect.stringContaining('University of Engineering and Technology'),
      }),
    }));
    expect(response.headers['Cache-Control']).toBe('no-store');
  });

  it('returns a generic error if Gemini fails', async () => {
    generateContent.mockRejectedValue(new Error('private provider response detail'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = makeResponse();

    await chatHandler(makeRequest({ message: 'Tell me about Nam' }), response);

    expect(response.statusCode).toBe(502);
    expect(JSON.stringify(response.data)).not.toContain('private provider response detail');
    expect(log).toHaveBeenCalled();
  });
});
