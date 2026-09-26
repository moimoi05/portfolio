import chatHandler from './chat.js';
import type { VercelRequest, VercelResponse } from './types.js';
import { PORTFOLIO_ASSISTANT_MAX_BODY_BYTES } from './_lib/assistantConfig.js';

type ChatHandler = (request: VercelRequest, response: VercelResponse) => Promise<void>;

type DevRequest = AsyncIterable<Uint8Array | string> & {
  url?: string;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
};

type DevResponse = {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  end(body?: string): unknown;
};

type NextFunction = (error?: unknown) => void;

export function createDevChatMiddleware(handler: ChatHandler = chatHandler) {
  return async (request: DevRequest, response: DevResponse, next: NextFunction): Promise<void> => {
    if (request.url?.split('?', 1)[0] !== '/api/chat') {
      next();
      return;
    }

    try {
      const chunks: Buffer[] = [];
      let totalBytes = 0;
      for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        totalBytes += buffer.byteLength;
        if (totalBytes > PORTFOLIO_ASSISTANT_MAX_BODY_BYTES) {
          response.statusCode = 413;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'The request is too large.' }));
          return;
        }
        chunks.push(buffer);
      }

      const body = Buffer.concat(chunks).toString('utf8');
      const headers = { ...request.headers, 'content-length': String(Buffer.byteLength(body)) };
      const adaptedResponse: VercelResponse = {
        setHeader(name, value) {
          response.setHeader(name, value);
          return this;
        },
        status(code) {
          response.statusCode = code;
          return this;
        },
        json(payload) {
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify(payload));
          return this;
        },
      };

      await handler({ method: request.method, headers, body }, adaptedResponse);
    } catch (error) {
      next(error);
    }
  };
}
