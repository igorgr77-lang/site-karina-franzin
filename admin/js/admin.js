// Proteção de Rota - Verificar Autenticação
let currentUser = null;
let articleToDelete = null;

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = '/admin/login.html';
        return false;
    }
    
    currentUser = session.user;
    document.getElementById('userEmail').textContent = currentUser.email;
    return true;
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;
    
    await loadArticles();
    setupEventListeners();
});

// Carregar Artigos
async function loadArticles() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const articlesGrid = document.getElementById('articlesGrid');
    
    try {
        const { data: articles, error } = await supabase
            .from('artigos')
            .select('*')
            .order('criado_em', { ascending: false });
        
        if (error) throw error;
        
        loadingState.style.display = 'none';
        
        if (!articles || articles.length === 0) {
            emptyState.style.display = 'block';
            articlesGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            articlesGrid.style.display = 'grid';
            renderArticles(articles);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar artigos:', error);
        loadingState.innerHTML = '<p style="color: #e53e3e;">Erro ao carregar artigos. Tente novamente.</p>';
    }
}

// Renderizar Artigos
function renderArticles(articles) {
    const articlesGrid = document.getElementById('articlesGrid');
    articlesGrid.innerHTML = '';
    
    articles.forEach(article => {
        const card = createArticleCard(article);
        articlesGrid.appendChild(card);
    });
}

// Criar Card de Artigo
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    const publishedDate = new Date(article.data_publicacao || article.criado_em).toLocaleDateString('pt-BR');
    const statusClass = article.publicado ? 'status-published' : 'status-draft';
    const statusText = article.publicado ? 'Publicado' : 'Rascunho';
    
    card.innerHTML = `
        <img 
            src="${article.imagem_card || '../assets/img/placeholder.jpg'}" 
            alt="${article.titulo}"
            class="article-image"
            onerror="this.src='../assets/img/placeholder.jpg'"
        >
        <div class="article-content">
            <div class="article-header">
                <span class="article-status ${statusClass}">${statusText}</span>
            </div>
            <h3 class="article-title">${article.titulo}</h3>
            <p class="article-description">${article.resumo}</p>
            <div class="article-meta">
                <span>📅 ${publishedDate}</span>
                <span>👁️ ${article.visualizacoes || 0} visualizações</span>
            </div>
            <div class="article-actions">
                <button class="btn-edit" onclick="editArticle('${article.id}')">
                    ✏️ Editar
                </button>
                <button class="btn-delete" onclick="showDeleteModal('${article.id}')">
                    🗑️ Excluir
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('btnNewArticle').addEventListener('click', () => {
        window.location.href = '/admin/editor.html';
    });
    document.getElementById('btnCancelDelete').addEventListener('click', hideDeleteModal);
    document.getElementById('btnConfirmDelete').addEventListener('click', confirmDelete);
}

// Logout
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('❌ Erro ao fazer logout:', error);
        alert('Erro ao sair. Tente novamente.');
    } else {
        window.location.href = '/admin/login.html';
    }
}

// Editar Artigo
function editArticle(articleId) {
    window.location.href = `/admin/editor.html?id=${articleId}`;
}

// Modal de Exclusão
function showDeleteModal(articleId) {
    articleToDelete = articleId;
    document.getElementById('deleteModal').classList.add('show');
}

function hideDeleteModal() {
    articleToDelete = null;
    document.getElementById('deleteModal').classList.remove('show');
}

async function confirmDelete() {
    if (!articleToDelete) return;
    
    const btnConfirm = document.getElementById('btnConfirmDelete');
    btnConfirm.disabled = true;
    btnConfirm.textContent = 'Excluindo...';
    
    try {
        const { error } = await supabase
            .from('artigos')
            .delete()
            .eq('id', articleToDelete);
        
        if (error) throw error;
        
        console.log('✅ Artigo excluído com sucesso!');
        hideDeleteModal();
        await loadArticles(); // Recarregar lista
        
    } catch (error) {
        console.error('❌ Erro ao excluir artigo:', error);
        alert('Erro ao excluir artigo. Tente novamente.');
        btnConfirm.disabled = false;
        btnConfirm.textContent = 'Excluir Artigo';
    }
}
