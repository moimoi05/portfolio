import type { PortfolioAssistantRequest, PortfolioAssistantResponse } from '../data/portfolioAssistantContract';

export async function askPortfolioAssistant(message: string): Promise<string> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 25_000);

  try {
    const payload: PortfolioAssistantRequest = { message };
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Portfolio assistant request failed');

    const data = await response.json() as Partial<PortfolioAssistantResponse>;
    if (typeof data.message !== 'string' || !data.message.trim()) throw new Error('Portfolio assistant returned an invalid response');
    return data.message.trim();
  } finally {
    window.clearTimeout(timeout);
  }
}
