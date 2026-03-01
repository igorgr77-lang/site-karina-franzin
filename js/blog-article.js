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
        document.getElementById('articleHeader').style.display = 'block';
        document.getElementById('articleContainer').style.display = 'block';
        
    } catch (error) {
        console.error('Erro ao carregar artigo:', error);
        loadingOverlay.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

// Renderizar artigo na página
function renderizarArtigo(artigo) {
    // Calcular tempo de leitura
    const tempoLeitura = calcularTempoLeitura(artigo.conteudo || '');
    
    // Formatar data
    const dataFormatada = formatarData(artigo.data_publicacao);
    
    // Categoria (primeira palavra-chave ou "CORRIDA")
    const categoria = artigo.palavras_chave && artigo.palavras_chave.length > 0
        ? artigo.palavras_chave[0].toUpperCase()
        : 'CORRIDA';
    
    // Preencher elementos do HTML existente
    document.getElementById('articleCategory').textContent = categoria;
    document.getElementById('articleTitle').textContent = artigo.titulo;
    document.getElementById('articleDate').textContent = `📅 ${dataFormatada}`;
    document.getElementById('articleReadingTime').textContent = `⏱️ ${tempoLeitura} min de leitura`;
    document.getElementById('articleAuthor').textContent = `✍️ Por ${artigo.autor || 'Karina Franzin'}`;
    
    // Subtítulo (se existir)
    const subtituloEl = document.getElementById('articleSubtitle');
    if (artigo.subtitulo) {
        subtituloEl.innerHTML = `<p>${artigo.subtitulo}</p>`;
        subtituloEl.style.display = 'block';
    } else {
        subtituloEl.style.display = 'none';
    }
    
    // Conteúdo do artigo
    document.getElementById('articleContent').innerHTML = artigo.conteudo || '<p>Conteúdo não disponível.</p>';
    
    // Breadcrumb
    document.getElementById('breadcrumbCurrent').textContent = artigo.titulo;
}

// Atualizar meta tags para SEO
function atualizarMetaTags(artigo) {
    // Title
    const title = artigo.meta_titulo || artigo.titulo;
    document.title = `${title} | Karina Franzin`;
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = `${title} | Karina Franzin`;
    
    // Description
    const description = artigo.meta_description || artigo.resumo || '';
    const metaDesc = document.getElementById('metaDescription');
    if (metaDesc) metaDesc.setAttribute('content', description);
    
    // Keywords
    const keywords = artigo.palavras_chave ? artigo.palavras_chave.join(', ') : '';
    const metaKeywords = document.getElementById('metaKeywords');
    if (metaKeywords) metaKeywords.setAttribute('content', keywords);
    
    // Canonical URL
    const canonical = document.getElementById('canonical');
    if (canonical) canonical.setAttribute('href', window.location.href);
    
    // Open Graph
    const ogTitle = document.getElementById('ogTitle');
    const ogDescription = document.getElementById('ogDescription');
    const ogImage = document.getElementById('ogImage');
    const ogUrl = document.getElementById('ogUrl');
    
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (ogImage) ogImage.setAttribute('content', artigo.imagem_card || '/assets/img/karina-profile.jpg');
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);
}

// Formatar data para pt-BR
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
    return data.toLocaleDateString('pt-BR', opcoes);
}
