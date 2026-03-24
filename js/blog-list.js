// ========================================
// BLOG - LISTAGEM DE ARTIGOS
// ========================================
// Carrega e exibe artigos do Supabase

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarArtigos();
});

// Carregar artigos do Supabase
async function carregarArtigos() {
    const articlesGrid = document.getElementById('articlesGrid');
    const noArticles = document.getElementById('noArticles');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        loadingOverlay.style.display = 'flex';
        
        // Buscar apenas artigos publicados, ordenados por data (mais recentes primeiro)
        const { data: artigos, error } = await supabase
            .from('artigos')
            .select('*')
            .eq('publicado', true)
            .order('data_publicacao', { ascending: false });
        
        if (error) throw error;
        
        // Limpar grid
        articlesGrid.innerHTML = '';
        
        if (!artigos || artigos.length === 0) {
            noArticles.style.display = 'block';
            return;
        }
        
        // Renderizar cada artigo
        artigos.forEach(artigo => {
            const card = criarCardArtigo(artigo);
            articlesGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
        articlesGrid.innerHTML = '<p class="error">Erro ao carregar artigos. Tente novamente mais tarde.</p>';
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Criar card de artigo a partir do template
function criarCardArtigo(artigo) {
    const template = document.getElementById('articleCardTemplate');
    const clone = template.content.cloneNode(true);
    
    // Preencher dados
    const img = clone.querySelector('img');
    const category = clone.querySelector('.article-category');
    const title = clone.querySelector('.article-title');
    const excerpt = clone.querySelector('.article-excerpt');
    const date = clone.querySelector('.article-date');
    const readingTime = clone.querySelector('.article-reading-time');
    const cardLink = clone.querySelector('.article-card-link');
    const link = clone.querySelector('.article-link');
    
    // Imagem do card
    if (artigo.imagem_card) {
        img.src = artigo.imagem_card;
        img.alt = artigo.titulo;
    } else {
        img.src = '../assets/img/placeholder.jpg';
        img.alt = 'Imagem do artigo';
    }
    
    // Categoria (extrair da primeira palavra-chave ou deixar genérico)
    const categoria = artigo.palavras_chave && artigo.palavras_chave.length > 0 
        ? artigo.palavras_chave[0].charAt(0).toUpperCase() + artigo.palavras_chave[0].slice(1)
        : 'Blog';
    category.textContent = categoria;
    
    // Título e resumo
    title.textContent = artigo.titulo;
    excerpt.textContent = artigo.resumo;
    
    // Data de publicação formatada
    const dataFormatada = formatarData(artigo.data_publicacao);
    date.textContent = `📅 ${dataFormatada}`;
    
    // Tempo de leitura (calculado a partir do conteúdo)
    const tempoLeitura = calcularTempoLeitura(artigo.conteudo || '');
    readingTime.textContent = `⏱️ ${formatarTempoLeitura(tempoLeitura)}`;
    
    // Link para artigo individual — href direto para máxima compatibilidade com WebViews
    const url = `https://karinafranzin.com.br/blog/artigo.html?slug=${artigo.slug}`;
    cardLink.href = url;
    
    return clone;
}

// Formatar data para pt-BR
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
    return data.toLocaleDateString('pt-BR', opcoes);
}
