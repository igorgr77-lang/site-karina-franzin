/**
 * Cloudflare Worker — Otimização de SEO e Redirecionamentos para karinafranzin.com.br
 * 
 * Funcionalidade:
 * - Redirecionamento 301 definitivo de links legados do blog com parâmetro query '?slug=...' para a nova URL limpa.
 * - Bypass de todas as outras rotas diretamente para o GitHub Pages (sem latência e sem chamadas ao Supabase).
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Intercepta requisições para o arquivo legado artigo.html
    if (url.pathname === '/blog/artigo.html') {
      const slug = url.searchParams.get('slug');

      if (slug) {
        // Redireciona 301 para a URL amigável final compilada (ex: /blog/meu-post/)
        return new Response(null, {
          status: 301,
          headers: {
            'Location': `${url.origin}/blog/${slug}/`,
            'Cache-Control': 'public, max-age=31536000', // Cache por 1 ano na borda
          },
        });
      } else {
        // Se acessar sem slug, redireciona 301 para a listagem principal do blog
        return new Response(null, {
          status: 301,
          headers: {
            'Location': `${url.origin}/blog/`,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      }
    }

    // Para todas as outras rotas, passa direto para o GitHub Pages
    return fetch(request);
  },
};
