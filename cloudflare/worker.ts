const FALLBACK_ORIGIN = 'https://portfolio-one-sand-hdgsu9hs2b.vercel.app';
const T3_DEFAULT_PAGE = /<title>\s*Trang mặc định của máy chủ\s*<\/title>/i;

function redirectToFallback(request: Request): Response {
  const source = new URL(request.url);
  const target = new URL(source.pathname + source.search, FALLBACK_ORIGIN);
  return Response.redirect(target.toString(), 302);
}

export async function handleRequest(request: Request, originFetch: typeof fetch = fetch): Promise<Response> {
  let response: Response;
  try {
    response = await originFetch(request);
  } catch {
    return request.method === 'GET' || request.method === 'HEAD'
      ? redirectToFallback(request)
      : new Response('Origin unavailable', { status: 502 });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return response;
  if (response.status >= 500) return redirectToFallback(request);

  if (request.method === 'GET' && response.ok && response.headers.get('content-type')?.includes('text/html')) {
    try {
      if (T3_DEFAULT_PAGE.test(await response.clone().text())) return redirectToFallback(request);
    } catch {
      // Keep the origin response if its body cannot be inspected.
    }
  }
  return response;
}

export default {
  fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  },
};
