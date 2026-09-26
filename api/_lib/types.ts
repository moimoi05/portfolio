export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponse {
  setHeader(name: string, value: string): this;
  status(code: number): this;
  json(body: unknown): this;
}
