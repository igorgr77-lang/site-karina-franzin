// ========================================
// BLOG - ARTIGO INDIVIDUAL
// ========================================
// Carrega e exibe um artigo específico do Supabase

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarArtigo();
});

// Carregar artigo do Supabase baseado no slug da URL
async function carregarArtigo() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const errorMessage = document.getElementById('errorMessage');
    const articleContent = document.getElementById('articleContent');
    
    try {
        // Pegar slug da URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            throw new Error('Slug não fornecido na URL');
        }
        
        // Buscar artigo no Supabase
        const { data: artigo, error } = await supabase
            .from('artigos')
            .select('*')
            .eq('slug', slug)
            .eq('publicado', true)
            .single();
        
        if (error) throw error;
        if (!artigo) throw new Error('Artigo não encontrado');
        
        // Renderizar artigo
        renderizarArtigo(artigo);
        
        // Atualizar meta tags (SEO)
        atualizarMetaTags(artigo);
        
        // Mostrar conteúdo
        loadingOverlay.style.display = 'none';
        articleContent.style.display = 'block';
        
    } catch (error) {
        console.error('Erro ao carregar artigo:', error);
        loadingOverlay.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

// Renderizar artigo na página
function renderizarArtigo(artigo) {
    const articleContent = document.getElementById('articleContent');
    
    // Calcular tempo de leitura
    const tempoLeitura = calcularTempoLeitura(artigo.conteudo || '');
    const tempoFormatado = formatarTempoLeitura(tempoLeitura);
    
    // Formatar data
    const dataFormatada = formatarData(artigo.data_publicacao);
    
    // Categoria (primeira palavra-chave ou "Blog")
    const categoria = artigo.palavras_chave && artigo.palavras_chave.length > 0
        ? artigo.palavras_chave[0].charAt(0).toUpperCase() + artigo.palavras_chave[0].slice(1)
        : 'Blog';
    
    // Criar HTML do artigo
    const html = `
        <!-- Header -->
        <header class="article-header" style="background-image: url('${artigo.imagem_cabecalho || artigo.imagem_card || '../assets/img/placeholder.jpg'}');">
            <div class="header-overlay"></div>
            <div class="container">
                <nav class="breadcrumb">
                    <a href="/">Home</a> → 
                    <a href="/blog/">Blog</a> → 
                    <span>${categoria}</span>
                </nav>
                
                <span class="article-category">${categoria}</span>
                <h1>${artigo.titulo}</h1>
                
                <div class="article-meta">
                    <span>📅 ${dataFormatada}</span>
                    <span>⏱️ ${tempoFormatado}</span>
                    <span>✍️ Por ${artigo.autor || 'Karina Franzin'}</span>
                </div>
            </div>
        </header>

        <!-- Article Content -->
        <article class="article-single">
            <div class="container">
                ${artigo.subtitulo ? `
                <div class="article-subtitle">
                    <p>${artigo.subtitulo}</p>
                </div>
                ` : ''}
                
                <div class="article-body">
                    ${artigo.conteudo || '<p>Conteúdo não disponível.</p>'}
                </div>
                
                <!-- Social Share -->
                <div class="social-share">
                    <p>Compartilhe este artigo:</p>
                    <div class="share-buttons">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn facebook">Facebook</a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(artigo.titulo)}" target="_blank" class="share-btn twitter">Twitter</a>
                        <a href="https://wa.me/?text=${encodeURIComponent(artigo.titulo + ' ' + window.location.href)}" target="_blank" class="share-btn whatsapp">WhatsApp</a>
                    </div>
                </div>
                
                <!-- Back to Blog -->
                <div class="back-to-blog">
                    <a href="/blog/" class="btn-primary">← Voltar para o blog</a>
                </div>
            </div>
        </article>

        <!-- Footer -->
        <footer class="blog-footer">
            <div class="container">
                <p>&copy; 2026 Karina Franzin - Todos os direitos reservados</p>
                <a href="/">Voltar para o site principal</a>
            </div>
        </footer>
    `;
    
    articleContent.innerHTML = html;
}

// Atualizar meta tags para SEO
function atualizarMetaTags(artigo) {
    // Title
    const title = artigo.meta_titulo || artigo.titulo;
    document.title = `${title} | Karina Franzin`;
    document.getElementById('pageTitle').textContent = `${title} | Karina Franzin`;
    
    // Description
    const description = artigo.meta_description || artigo.resumo || '';
    document.getElementById('metaDescription').setAttribute('content', description);
    
    // Keywords
    const keywords = artigo.palavras_chave ? artigo.palavras_chave.join(', ') : '';
    document.getElementById('metaKeywords').setAttribute('content', keywords);
    
    // Open Graph
    document.getElementById('ogTitle').setAttribute('content', title);
    document.getElementById('ogDescription').setAttribute('content', description);
    document.getElementById('ogImage').setAttribute('content', artigo.imagem_card || '');
    document.getElementById('ogUrl').setAttribute('content', window.location.href);
    
    // Twitter
    document.getElementById('twitterTitle').setAttribute('content', title);
    document.getElementById('twitterDescription').setAttribute('content', description);
    document.getElementById('twitterImage').setAttribute('content', artigo.imagem_card || '');
}

// Formatar data para pt-BR
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
    return data.toLocaleDateString('pt-BR', opcoes);
}
