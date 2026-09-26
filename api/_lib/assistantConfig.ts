export const PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH = 1200;
export const PORTFOLIO_ASSISTANT_MAX_BODY_BYTES = 8192;
export const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
export const MAX_OUTPUT_TOKENS = 512;
// Finish before the browser's 25-second deadline; retries can multiply paid work.
export const GEMINI_TIMEOUT_MS = 20_000;
export const RATE_LIMIT_MAX_REQUESTS = 12;
export const RATE_LIMIT_WINDOW_MS = 60_000;

export function safeModelName(): string {
  const configured = process.env.GEMINI_MODEL?.trim();
  return configured && /^[a-zA-Z0-9._-]{1,64}$/.test(configured) ? configured : DEFAULT_MODEL;
}
