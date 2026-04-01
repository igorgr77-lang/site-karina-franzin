/**
 * Cloudflare Worker — SEO Pre-rendering para karinafranzin.com.br
 * 
 * Funcionalidade:
 * - Usuários normais → passa direto para o GitHub Pages (sem interferência)
 * - Googlebot/crawlers/bots sociais → renderiza o JS e entrega HTML completo com conteúdo dos artigos
 * 
 * Atualizado: 31/03/2026 — fix WhatsApp/Telegram preview de links
 */

// Lista de bots de busca e crawlers SEO
const BOT_AGENTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'duckduckbot',
  'slurp',
  'baiduspider',
  'applebot',
  'google-inspectiontool',
  'google-structured-data-testing-tool',
];

// Bots de preview social (WhatsApp, Telegram, Facebook, etc.)
// Estes precisam de tratamento especial pois o User-Agent varia muito
const SOCIAL_PREVIEW_AGENTS = [
  'whatsapp',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'telegrambot',
  'slackbot',
  'discordbot',
  'skype',
  'iframely',
  'embedly',
  'outbrain',
  'pinterest',
];

/**
 * Verifica se o request vem de um bot/crawler (busca ou social)
 */
function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return (
    BOT_AGENTS.some(bot => ua.includes(bot)) ||
    SOCIAL_PREVIEW_AGENTS.some(bot => ua.includes(bot))
  );
}

/**
 * Verifica se é uma rota de artigo do blog (dinâmica via Supabase)
 * Ex: /blog/artigo.html?slug=meu-artigo ou /blog/ ou /blog/index.html
 */
function isBlogRoute(pathname) {
  return pathname.includes('/blog');
}

/**
 * Handler principal do Worker
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';

    // 1. Se não for bot OU não for rota de blog → passa direto (sem interferência)
    if (!isBot(userAgent) || !isBlogRoute(url.pathname)) {
      return fetch(request);
    }

    // 2. É bot acessando uma rota de blog → tenta fazer pre-rendering
    const slug = url.searchParams.get('slug') || extractSlugFromPath(url.pathname);
    let article = null;

    try {
      // Busca o artigo no Supabase PRIMEIRO (antes de buscar o HTML)
      // Isso evita que o artigo seja null por timeout
      if (slug && env.SUPABASE_URL && env.SUPABASE_KEY) {
        article = await fetchArticle(slug, env.SUPABASE_URL, env.SUPABASE_KEY);
      }

      // Busca a página HTML do GitHub Pages
      const response = await fetch(request);
      
      // Se não for HTML, passa direto
      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.includes('text/html')) {
        return response;
      }

      // Pega o HTML original
      let html = await response.text();

      // Injeta meta tags — com dados do artigo se encontrou, ou com fallback genérico
      if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        html = injectMetaTags(html, article, url.href, slug);
      }

      // Retorna o HTML enriquecido
      return new Response(html, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Rendered-By': 'Cloudflare-Worker',
          'X-Debug-Slug': slug || 'none',
          'X-Debug-Article': article ? 'found' : 'not-found',
          'X-Debug-UA': userAgent.substring(0, 80),
        },
      });

    } catch (err) {
      // Em caso de erro, passa direto (fail-safe)
      console.error('[Worker] Erro ao processar request:', err);
      return fetch(request);
    }
  },
};

/**
 * Extrai o slug do pathname
 * Ex: /blog/meu-artigo → meu-artigo
 */
function extractSlugFromPath(pathname) {
  const match = pathname.match(/\/blog\/([^\/]+)\/?$/);
  return match ? match[1] : null;
}

/**
 * Busca um artigo no Supabase pela slug
 */
async function fetchArticle(slug, supabaseUrl, supabaseKey) {
  try {
    const apiUrl = `${supabaseUrl}/rest/v1/artigos?slug=eq.${encodeURIComponent(slug)}&select=titulo,resumo,subtitulo,imagem_card,meta_titulo,autor,data_publicacao&limit=1`;
    
    const res = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) return null;

    // Usa text() primeiro para remover possível BOM UTF-8 antes de parsear o JSON
    const text = await res.text();
    const clean = text.replace(/^\uFEFF/, ''); // remove BOM se existir
    const data = JSON.parse(clean);
    return data && data.length > 0 ? data[0] : null;

  } catch (err) {
    console.error('[Worker] Erro ao buscar artigo no Supabase:', err);
    return null;
  }
}

/**
 * Injeta meta tags dinâmicos no HTML para SEO e preview social (WhatsApp, Telegram, etc.)
 * Se article for null, injeta um fallback genérico (melhor que "Carregando...")
 */
function injectMetaTags(html, article, pageUrl, slug) {
  // Converte o slug em título legível como fallback (ex: "como-comecar-a-correr" → "Como Comecar A Correr")
  const slugTitle = slug
    ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : null;

  const title = (article && (article.meta_titulo || article.titulo)) || slugTitle || 'Blog | Karina Franzin';
  const description = (article && (article.subtitulo || article.resumo)) || 'Dicas de corrida e treino com a treinadora Karina Franzin. Assessoria de corrida online personalizada.';
  const image = (article && article.imagem_card) || 'https://karinafranzin.com.br/assets/img/karina-hero.jpg';
  const author = (article && article.autor) || 'Karina Franzin';

  const metaTags = `<!-- Meta tags injetados pelo Cloudflare Worker para SEO/Social -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="${escapeHtml(author)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:url" content="${escapeHtml(pageUrl)}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Karina Franzin">
    <meta property="og:locale" content="pt_BR">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
  `;

  // Remove TODAS as variações de <title> existentes no HTML
  // O artigo.html tem: <title id="pageTitle">Carregando... | Blog Karina Franzin</title>
  // A regex precisa cobrir o atributo id opcional
  html = html
    .replace(/<title[^>]*>[^<]*<\/title>/gi, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+name="author"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');

  // Injeta as novas meta tags logo após o <head>
  html = html.replace(/<head>/i, '<head>\n' + metaTags);

  return html;
}

/**
 * Escapa caracteres HTML para evitar XSS nos meta tags
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
