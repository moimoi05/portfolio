import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '../../api/_lib/types';

const { createInteraction } = vi.hoisted(() => ({ createInteraction: vi.fn() }));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    interactions = { create: createInteraction };
    constructor(_options: { apiKey: string }) {}
  },
}));

import chatHandler from '../../api/chat';
import { safeModelName } from '../../api/_lib/assistantConfig';

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
  let testTime = Date.now();

  beforeEach(() => {
    vi.useFakeTimers();
    testTime += 60_001;
    vi.setSystemTime(testTime);
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
    vi.useRealTimers();
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

  it.each(['{', 'null', '[]', '42', '{"message":false}', '{}'])('rejects invalid JSON message input %s', async (body) => {
    const response = makeResponse();
    await chatHandler(makeRequest(body), response);
    expect(response.statusCode).toBe(400);
    expect(createInteraction).not.toHaveBeenCalled();
  });

  it.each([undefined, 'text/plain', 'application/jsonp'])('rejects unsupported content type %s', async (contentType) => {
    const response = makeResponse();
    await chatHandler(makeRequest({ message: 'Nam?' }, { headers: { 'content-type': contentType } }), response);
    expect(response.statusCode).toBe(415);
    expect(createInteraction).not.toHaveBeenCalled();
  });

  it('rejects invalid length headers and oversized bodies without trusting content-length', async () => {
    const invalidLength = makeResponse();
    await chatHandler(makeRequest({}, { headers: { 'content-type': 'application/json', 'content-length': '-1' } }), invalidLength);
    expect(invalidLength.statusCode).toBe(400);
    for (const body of [{ message: 'a'.repeat(9000) }, JSON.stringify({ message: 'a'.repeat(9000) })]) {
      const response = makeResponse();
      await chatHandler(makeRequest(body, { headers: { 'content-type': 'application/json' } }), response);
      expect(response.statusCode).toBe(413);
    }
    expect(createInteraction).not.toHaveBeenCalled();
  });

  it('accepts buffered JSON and trims the message and model response', async () => {
    createInteraction.mockResolvedValue({ output_text: '  Portfolio answer.  ' });
    const response = makeResponse();
    await chatHandler(makeRequest(Buffer.from('{"message":"  Nam?  "}'), {
      headers: { 'content-type': ['application/json; charset=utf-8'], 'x-real-ip': '203.0.113.80' },
    }), response);
    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ message: 'Portfolio answer.' });
    expect(createInteraction.mock.calls[0][0].input).toBe('Nam?');
  });

  it('rejects unserializable input safely', async () => {
    const response = makeResponse();
    await chatHandler({ method: 'POST', headers: { 'content-type': 'application/json' }, body: { message: 1n } }, response);
    expect(response.statusCode).toBe(400);
    expect(createInteraction).not.toHaveBeenCalled();
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
    }), expect.objectContaining({ timeout: 20_000, maxRetries: 0 }));
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

  it('defaults to the stable cost-efficient Flash-Lite model and ignores invalid overrides', () => {
    expect(safeModelName()).toBe('gemini-3.1-flash-lite');
    process.env.GEMINI_MODEL = '../invalid';
    expect(safeModelName()).toBe('gemini-3.1-flash-lite');
  });

  it.each([429, 500, 503])('does not multiply provider requests on HTTP %s', async (status) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createInteraction.mockRejectedValue({ status });
    const response = makeResponse();
    await chatHandler(makeRequest({ message: 'Tell me about Nam' }), response);
    expect(response.statusCode).toBe(502);
    expect(createInteraction).toHaveBeenCalledOnce();
  });

  it('returns a safe failure for empty model output', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createInteraction.mockResolvedValue({ output_text: '  ' });
    const response = makeResponse();
    await chatHandler(makeRequest({ message: 'Nam?' }), response);
    expect(response.statusCode).toBe(502);
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

    vi.advanceTimersByTime(60_001);
    const renewed = makeResponse();
    await chatHandler(makeRequest({ message: 'Tell me about Nam' }, { headers }), renewed);
    expect(renewed.statusCode).toBe(200);
    expect(createInteraction).toHaveBeenCalledTimes(13);
  });
});
