export const PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH = 1200;
export const PORTFOLIO_ASSISTANT_MAX_BODY_BYTES = 8192;
export const DEFAULT_MODEL = 'gemini-flash-latest';
export const MAX_OUTPUT_TOKENS = 1024;
export const RATE_LIMIT_MAX_REQUESTS = 12;
export const RATE_LIMIT_WINDOW_MS = 60_000;

export function safeModelName(): string {
  const configured = process.env.GEMINI_MODEL?.trim();
  return configured && /^[a-zA-Z0-9._-]{1,64}$/.test(configured) ? configured : DEFAULT_MODEL;
}
