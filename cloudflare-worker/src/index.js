/**
 * Cloudflare Worker — karinafranzin.com.br
 *
 * O site é servido pelo GitHub Pages, que não permite configurar headers
 * nem ler o .htaccess. Este Worker fica na frente de todas as rotas e:
 * - força HTTPS;
 * - faz os redirecionamentos 301 (links antigos do blog, Cãominhada);
 * - esconde arquivos internos do repositório (404);
 * - adiciona os headers de segurança em todas as respostas;
 * - recebe os relatórios de violação da CSP (aparecem nos logs do Worker).
 */

const CSP_REPORT_PATH = '/__csp-report';

// Partes da CSP que não quebram nada: aplicadas de verdade.
const CSP_ENFORCED = [
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

// CSP completa em modo "só relatório": nada é bloqueado, as violações
// são enviadas para CSP_REPORT_PATH. Quando os logs ficarem limpos,
// dá para trocar para Content-Security-Policy.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://www.googletagmanager.com https://*.clarity.ms https://news.google.com https://challenges.cloudflare.com https://device.clearsale.com.br",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api-contas-karina.onrender.com https://viacep.com.br https://api.allorigins.win https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com https://news.google.com https://tokenizer.sejaefi.com.br https://cobrancas.api.efipay.com.br https://cobrancas-h.api.efipay.com.br https://*.clearsale.com.br https://*.fpcs-monitor.com.br",
  "frame-src https://www.google.com https://challenges.cloudflare.com https://news.google.com https://accounts.google.com https://www.googletagmanager.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  `report-uri ${CSP_REPORT_PATH}`,
  'report-to csp',
].join('; ');

const SECURITY_HEADERS = {
  // Sem includeSubDomains: outros subdomínios (ex.: gestao.) ficam fora.
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), usb=(), payment=()',
  'Content-Security-Policy': CSP_ENFORCED,
  'Content-Security-Policy-Report-Only': CSP_REPORT_ONLY,
  'Reporting-Endpoints': `csp="https://karinafranzin.com.br${CSP_REPORT_PATH}"`,
};

// Redirecionamentos 301 fixos (antes ficavam no .htaccess, que o GitHub Pages ignora).
const REDIRECTS = {
  '/cao-minhada-2026': '/eventos/cao-minhada-2026/',
  '/cao-minhada-2026/': '/eventos/cao-minhada-2026/',
};

// Arquivos do repositório que não fazem parte do site.
const BLOCKED_PATHS = [
  /^\/\.(htaccess|gitignore)$/i,
  /^\/(package(-lock)?\.json|build-blog\.js|CNAME)$/i,
  /^\/[^/]+\.(md|sql)$/i, // README, manuais e scripts SQL na raiz
  /^\/SUPABASE-CREDENCIAIS/i,
  /\.template\.html$/i,
  /^\/(cloudflare-worker|artigos-rascunhos)(\/|$)/i,
];

function withSecurityHeaders(response) {
  const res = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(name, value);
  }
  return res;
}

function redirect(location, origin) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: new URL(location, origin).toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

async function handleCspReport(request) {
  try {
    const body = await request.text();
    // Limita o tamanho para não lotar os logs.
    console.log('[csp-report]', body.slice(0, 2000));
  } catch (err) {
    console.log('[csp-report] erro ao ler relatório', String(err));
  }
  return new Response(null, { status: 204 });
}

async function handle(request) {
  const url = new URL(request.url);

  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return redirect(url.toString(), url.origin);
  }

  if (url.pathname === CSP_REPORT_PATH) {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    return handleCspReport(request);
  }

  // Links legados do blog: /blog/artigo.html?slug=meu-post -> /blog/meu-post/
  if (url.pathname === '/blog/artigo.html') {
    const slug = url.searchParams.get('slug');
    return redirect(slug ? `/blog/${encodeURIComponent(slug)}/` : '/blog/', url.origin);
  }

  if (REDIRECTS[url.pathname]) {
    return redirect(REDIRECTS[url.pathname], url.origin);
  }

  if (BLOCKED_PATHS.some((re) => re.test(url.pathname))) {
    const notFound = await fetch(new URL('/404.html', url.origin).toString());
    return new Response(notFound.body, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return fetch(request);
}

export default {
  async fetch(request) {
    const response = await handle(request);
    return withSecurityHeaders(response);
  },
};
