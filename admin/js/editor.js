// Variáveis Globais
let currentUser = null;
let isEditMode = false;
let currentArticleId = null;
let cardImageFile = null;
let headerImageFile = null;

// Proteção de Rota
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
    
    // Verificar se é modo de edição
    const urlParams = new URLSearchParams(window.location.search);
    currentArticleId = urlParams.get('id');
    
    if (currentArticleId) {
        isEditMode = true;
        await loadArticle(currentArticleId);
    }
    
    setupEventListeners();
    setupImageUpload();
    setupCharCounters();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('articleForm').addEventListener('submit', saveArticle);
    document.getElementById('btnBackToList').addEventListener('click', () => {
        window.location.href = '/admin/index.html';
    });
    
    // Auto-gerar slug do título
    document.getElementById('title').addEventListener('input', (e) => {
        const slug = generateSlug(e.target.value);
        document.getElementById('slug').value = slug;
        document.getElementById('slugPreview').textContent = slug || 'seu-artigo';
    });
    
    // Calcular tempo de leitura ao digitar conteúdo
    document.getElementById('content').addEventListener('input', () => {
        updateReadingTime();
    });
}

// Contadores de Caracteres
function setupCharCounters() {
    const counters = [
        { input: 'title', counter: 'titleCount' },
        { input: 'description', counter: 'descriptionCount' },
        { input: 'subtitle', counter: 'subtitleCount' },
        { input: 'metaTitle', counter: 'metaTitleCount' },
        { input: 'metaDescription', counter: 'metaDescriptionCount' }
    ];
    
    counters.forEach(({ input, counter }) => {
        const inputEl = document.getElementById(input);
        const counterEl = document.getElementById(counter);
        
        inputEl.addEventListener('input', () => {
            counterEl.textContent = inputEl.value.length;
        });
    });
}

// Upload de Imagens
function setupImageUpload() {
    // Card Image
    const cardImageInput = document.getElementById('cardImageInput');
    const cardImageArea = document.getElementById('cardImageArea');
    
    cardImageInput.addEventListener('change', (e) => {
        handleImageSelect(e.target.files[0], 'card');
    });
    
    cardImageArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cardImageArea.style.borderColor = '#667eea';
    });
    
    cardImageArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cardImageArea.style.borderColor = '#e0e0e0';
    });
    
    cardImageArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cardImageArea.style.borderColor = '#e0e0e0';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageSelect(file, 'card');
        }
    });
    
    // Header Image (mesma lógica)
    const headerImageInput = document.getElementById('headerImageInput');
    const headerImageArea = document.getElementById('headerImageArea');
    
    headerImageInput.addEventListener('change', (e) => {
        handleImageSelect(e.target.files[0], 'header');
    });
    
    headerImageArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        headerImageArea.style.borderColor = '#667eea';
    });
    
    headerImageArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        headerImageArea.style.borderColor = '#e0e0e0';
    });
    
    headerImageArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        headerImageArea.style.borderColor = '#e0e0e0';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageSelect(file, 'header');
        }
    });
}

// Processar Seleção de Imagem
function handleImageSelect(file, type) {
    if (!file) return;
    
    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande. Por favor, escolha uma imagem menor que 2MB.');
        return;
    }
    
    // Validar tipo
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        alert('Por favor, escolha uma imagem JPG, PNG ou WebP.');
        return;
    }
    
    // Armazenar arquivo
    if (type === 'card') {
        cardImageFile = file;
    } else {
        headerImageFile = file;
    }
    
    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
        if (type === 'card') {
            document.getElementById('cardImageImg').src = e.target.result;
            document.getElementById('cardImageImg').style.display = 'block';
            document.getElementById('cardImagePlaceholder').style.display = 'none';
        } else {
            document.getElementById('headerImageImg').src = e.target.result;
            document.getElementById('headerImageImg').style.display = 'block';
            document.getElementById('headerImagePlaceholder').style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

// Upload para Supabase Storage
async function uploadImage(file, fileName) {
    try {
        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) throw error;
        
        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(fileName);
        
        return publicUrl;
        
    } catch (error) {
        console.error('❌ Erro ao fazer upload da imagem:', error);
        throw error;
    }
}

// Gerar Slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/--+/g, '-') // Remove hífens duplicados
        .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
}

// Carregar Artigo (Modo Edição)
async function loadArticle(articleId) {
    showLoading('Carregando artigo...');
    
    try {
        const { data: article, error } = await supabase
            .from('artigos')
            .select('*')
            .eq('id', articleId)
            .single();
        
        if (error) throw error;
        
        // Preencher formulário
        document.getElementById('title').value = article.titulo || '';
        document.getElementById('slug').value = article.slug || '';
        document.getElementById('description').value = article.resumo || '';
        document.getElementById('subtitle').value = article.subtitulo || '';
        document.getElementById('content').value = article.conteudo || '';
        document.getElementById('author').value = article.autor || 'Karina Franzin';
        document.getElementById('metaTitle').value = article.meta_titulo || '';
        document.getElementById('metaDescription').value = article.meta_description || '';
        document.getElementById('keywords').value = article.palavras_chave ? article.palavras_chave.join(', ') : '';
        document.getElementById('published').checked = article.publicado || false;
        
        if (article.data_publicacao) {
            // Banco retorna UTC, mas queremos exibir como está (sem conversão)
            // Exemplo: Banco tem "2026-02-14T17:03:00+00" → Mostrar "2026-02-14T17:03"
            const isoString = new Date(article.data_publicacao).toISOString();
            document.getElementById('publishedAt').value = isoString.slice(0, 16);
        }
        
        // Imagens
        if (article.imagem_card) {
            document.getElementById('cardImageImg').src = article.imagem_card;
            document.getElementById('cardImageImg').style.display = 'block';
            document.getElementById('cardImagePlaceholder').style.display = 'none';
            document.getElementById('cardImageUrl').value = article.imagem_card;
        }
        
        if (article.imagem_cabecalho) {
            document.getElementById('headerImageImg').src = article.imagem_cabecalho;
            document.getElementById('headerImageImg').style.display = 'block';
            document.getElementById('headerImagePlaceholder').style.display = 'none';
            document.getElementById('headerImageUrl').value = article.imagem_cabecalho;
        }
        
        // Atualizar contadores
        document.getElementById('titleCount').textContent = article.titulo?.length || 0;
        document.getElementById('descriptionCount').textContent = article.resumo?.length || 0;
        document.getElementById('metaTitleCount').textContent = article.meta_titulo?.length || 0;
        document.getElementById('metaDescriptionCount').textContent = article.meta_description?.length || 0;
        
        // Atualizar tempo de leitura
        updateReadingTime();
        
        // Atualizar preview do slug
        document.getElementById('slugPreview').textContent = article.slug || 'seu-artigo';
        
        // Atualizar botão
        document.getElementById('btnSave').innerHTML = '💾 Atualizar Artigo';
        
        hideLoading();
        
    } catch (error) {
        console.error('❌ Erro ao carregar artigo:', error);
        alert('Erro ao carregar artigo. Redirecionando...');
        window.location.href = '/admin/index.html';
    }
}

// Salvar Artigo
async function saveArticle(e) {
    e.preventDefault();
    
    showLoading('Salvando artigo...');
    
    try {
        // Upload de imagens se houver
        let cardImageUrl = document.getElementById('cardImageUrl').value;
        let headerImageUrl = document.getElementById('headerImageUrl').value;
        
        const slug = document.getElementById('slug').value;
        
        if (cardImageFile) {
            showLoading('Fazendo upload da imagem do card...');
            const fileName = `card-${slug}-${Date.now()}.${cardImageFile.name.split('.').pop()}`;
            cardImageUrl = await uploadImage(cardImageFile, fileName);
        }
        
        if (headerImageFile) {
            showLoading('Fazendo upload da imagem do cabeçalho...');
            const fileName = `header-${slug}-${Date.now()}.${headerImageFile.name.split('.').pop()}`;
            headerImageUrl = await uploadImage(headerImageFile, fileName);
        }
        
        // Preparar dados
        // Converter data de publicação mantendo horário de Brasília
        let dataPublicacao = new Date().toISOString();
        const publishedAtValue = document.getElementById('publishedAt').value;
        if (publishedAtValue) {
            // Input datetime-local retorna: "2026-02-14T17:03"
            // Adicionar segundos e interpretar como UTC diretamente
            dataPublicacao = publishedAtValue + ':00.000Z';
        }
        
        const articleData = {
            titulo: document.getElementById('title').value,
            slug: slug,
            resumo: document.getElementById('description').value,
            subtitulo: document.getElementById('subtitle').value || null,
            conteudo: document.getElementById('content').value,
            autor: document.getElementById('author').value || 'Karina Franzin',
            imagem_card: cardImageUrl,
            imagem_cabecalho: headerImageUrl,
            meta_titulo: document.getElementById('metaTitle').value || null,
            meta_description: document.getElementById('metaDescription').value || document.getElementById('description').value || null,
            palavras_chave: document.getElementById('keywords').value ? document.getElementById('keywords').value.split(',').map(k => k.trim()) : null,
            publicado: document.getElementById('published').checked,
            data_publicacao: dataPublicacao
        };
        
        showLoading('Salvando no banco de dados...');
        
        let result;
        if (isEditMode) {
            // Atualizar
            result = await supabase
                .from('artigos')
                .update(articleData)
                .eq('id', currentArticleId);
        } else {
            // Criar novo
            result = await supabase
                .from('artigos')
                .insert([articleData]);
        }
        
        if (result.error) throw result.error;
        
        hideLoading();
        
        alert(isEditMode ? '✅ Artigo atualizado com sucesso!' : '✅ Artigo criado com sucesso!');
        window.location.href = '/admin/index.html';
        
    } catch (error) {
        console.error('❌ Erro ao salvar artigo:', error);
        hideLoading();
        alert('Erro ao salvar artigo. Verifique os dados e tente novamente.');
    }
}

// Atualizar tempo de leitura
function updateReadingTime() {
    const content = document.getElementById('content').value;
    const displayElement = document.getElementById('readingTimeDisplay');
    
    if (displayElement) {
        const minutos = calcularTempoLeitura(content);
        displayElement.textContent = formatarTempoLeitura(minutos);
    }
}

// Loading Overlay
function showLoading(text = 'Processando...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}
