const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================
// CONFIGURAÇÕES E CREDENCIAIS
// ============================================
const CONFIG_PATH = path.join(__dirname, 'js', 'supabase-config.js');
const IMAGES_DIR = path.join(__dirname, 'assets', 'img', 'blog');
const BLOG_DIR = path.join(__dirname, 'blog');

// Criar pastas de destino se não existirem
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// 1. Ler credenciais do Supabase
console.log('🔍 Lendo credenciais do Supabase de supabase-config.js...');
if (!fs.existsSync(CONFIG_PATH)) {
    console.error('❌ Erro: js/supabase-config.js não encontrado.');
    process.exit(1);
}

const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
const urlMatch = configContent.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = configContent.match(/SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/);

if (!urlMatch || !keyMatch) {
    console.error('❌ Erro: Não foi possível extrair as credenciais do arquivo supabase-config.js.');
    process.exit(1);
}

const SUPABASE_URL = urlMatch[1];
const SUPABASE_ANON_KEY = keyMatch[1];

console.log(`✅ Conectando à URL: ${SUPABASE_URL}`);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Fazer requisição GET HTTP/HTTPS
function fetchGet(url, headers = {}) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Erro HTTP ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', reject);
    });
}

// Baixar e salvar arquivo localmente
function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Erro ao baixar arquivo (Status ${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });
    });
}

// Formatar data em português
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
}

// Calcular tempo estimado de leitura
function calcularTempoLeitura(conteudoHtml) {
    if (!conteudoHtml) return 1;
    const textoLimpo = conteudoHtml.replace(/<[^>]*>/g, '');
    const palavras = textoLimpo.trim().split(/\s+/).filter(p => p.length > 0);
    const totalPalavras = palavras.length;
    return Math.max(1, Math.ceil(totalPalavras / 200));
}

// Processar e baixar imagens do Supabase
async function processarImagem(urlOriginal, slug, prefixo) {
    if (!urlOriginal) return '';
    
    // Verifica se a imagem é do storage do Supabase
    if (urlOriginal.includes('/storage/v1/object/public/blog-images/')) {
        try {
            // Extrai o nome do arquivo da URL original
            const urlParts = urlOriginal.split('/');
            const originalFileName = urlParts[urlParts.length - 1];
            
            // Define o nome de salvamento local
            const localFileName = originalFileName;
            const destPath = path.join(IMAGES_DIR, localFileName);
            const relativePath = `/assets/img/blog/${localFileName}`;
            
            if (!fs.existsSync(destPath)) {
                console.log(`   📥 Baixando imagem: ${originalFileName}...`);
                await downloadFile(urlOriginal, destPath);
                console.log(`   ✅ Salva em assets/img/blog/${localFileName}`);
            } else {
                console.log(`   ✔️ Imagem já existe localmente: ${localFileName}`);
            }
            
            return relativePath;
        } catch (err) {
            console.error(`   ⚠️ Falha ao baixar imagem do Supabase (${urlOriginal}):`, err.message);
            return urlOriginal; // Mantém a URL original se falhar
        }
    }
    
    return urlOriginal; // Retorna normal se não for do Supabase
}

// ============================================
// CORE BUILD PIPELINE
// ============================================
async function build() {
    try {
        console.log('\n🚀 Iniciando carregamento de artigos do Supabase...');
        const apiHeaders = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        };
        
        // Buscar artigos ordenados por data
        const queryUrl = `${SUPABASE_URL}/rest/v1/artigos?publicado=eq.true&order=data_publicacao.desc`;
        const artigos = await fetchGet(queryUrl, apiHeaders);
        
        console.log(`✅ Carregados ${artigos.length} artigos publicados.`);
        
        // Ler templates
        const artigoTemplatePath = path.join(BLOG_DIR, 'artigo.template.html');
        const indexTemplatePath = path.join(BLOG_DIR, 'index.template.html');
        
        if (!fs.existsSync(artigoTemplatePath) || !fs.existsSync(indexTemplatePath)) {
            console.error('❌ Erro: Templates artigo.template.html ou index.template.html não encontrados em /blog/');
            process.exit(1);
        }
        
        const artigoTemplate = fs.readFileSync(artigoTemplatePath, 'utf8');
        const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf8');
        
        const cardsHtmlArray = [];
        
        // Processar cada artigo
        for (const artigo of artigos) {
            console.log(`\n📦 Processando artigo: "${artigo.titulo}" (slug: ${artigo.slug})...`);
            
            // 1. Processar imagens de cabeçalho e card
            const localCardImg = await processarImagem(artigo.imagem_card, artigo.slug, 'card');
            const localHeaderImg = await processarImagem(artigo.imagem_cabecalho, artigo.slug, 'header');
            
            // 2. Processar imagens no corpo do conteúdo
            let conteudoProcessado = artigo.conteudo || '';
            const imgRegex = /https:\/\/[a-z0-9.]+\/storage\/v1\/object\/public\/blog-images\/[a-zA-Z0-9._%-]+/g;
            const matches = conteudoProcessado.match(imgRegex) || [];
            
            if (matches.length > 0) {
                console.log(`   🖼️ Encontradas ${matches.length} imagens no corpo do artigo.`);
                for (const imgUrl of matches) {
                    const localUrl = await processarImagem(imgUrl, artigo.slug, 'body');
                    conteudoProcessado = conteudoProcessado.replace(imgUrl, localUrl);
                }
            }
            
            // 3. Informações de Data e Leitura
            const dataFormatada = formatarData(artigo.data_publicacao);
            const tempoLeitura = calcularTempoLeitura(artigo.conteudo);
            const categoria = (artigo.palavras_chave && artigo.palavras_chave[0]) 
                ? artigo.palavras_chave[0].toUpperCase() 
                : 'CORRIDA';
            const keywords = (artigo.palavras_chave) ? artigo.palavras_chave.join(', ') : 'corrida, assessoria';
            const metaDescription = artigo.meta_description || artigo.resumo;
            const autor = artigo.autor || 'Karina Franzin';
            
            // Schema JSON
            const schemaObj = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": artigo.titulo,
                "description": metaDescription,
                "image": `https://karinafranzin.com.br${localCardImg}`,
                "author": {
                    "@type": "Person",
                    "name": autor
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Karina Franzin Assessoria de Corrida",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://karinafranzin.com.br/assets/img/KarinaFranzin80.webp"
                    }
                },
                "datePublished": artigo.data_publicacao,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://karinafranzin.com.br/blog/${artigo.slug}/`
                }
            };
            const schemaJson = JSON.stringify(schemaObj, null, 2);
            
            // 4. Substituir placeholders no artigo
            let htmlArtigo = artigoTemplate
                .replace(/{{TITULO}}/g, artigo.titulo)
                .replace(/{{SLUG}}/g, artigo.slug)
                .replace(/{{META_DESCRIPTION}}/g, metaDescription)
                .replace(/{{KEYWORDS}}/g, keywords)
                .replace(/{{CATEGORIA}}/g, categoria)
                .replace(/{{DATA_FORMATADA}}/g, dataFormatada)
                .replace(/{{TEMPO_LEITURA}}/g, tempoLeitura)
                .replace(/{{AUTOR}}/g, autor)
                .replace(/{{CONTEUDO}}/g, conteudoProcessado)
                .replace(/{{IMAGEM_CARD}}/g, `https://karinafranzin.com.br${localCardImg}`)
                .replace(/{{SCHEMA_JSON}}/g, schemaJson);
                
            // Subtítulo
            if (artigo.subtitulo) {
                htmlArtigo = htmlArtigo
                    .replace(/{{SUBTITLE}}/g, artigo.subtitulo)
                    .replace(/{{SUBTITLE_STYLE}}/g, '');
            } else {
                htmlArtigo = htmlArtigo
                    .replace(/{{SUBTITLE}}/g, '')
                    .replace(/{{SUBTITLE_STYLE}}/g, 'display: none;');
            }
            
            // 5. Salvar arquivo estático do artigo
            const artigoPasta = path.join(BLOG_DIR, artigo.slug);
            if (!fs.existsSync(artigoPasta)) {
                fs.mkdirSync(artigoPasta, { recursive: true });
            }
            fs.writeFileSync(path.join(artigoPasta, 'index.html'), htmlArtigo, 'utf8');
            console.log(`   💾 Artigo estático gerado em: blog/${artigo.slug}/index.html`);
            
            // 6. Gerar markup do card para a listagem
            const cardHtml = `
        <a href="/blog/${artigo.slug}/" class="article-card-link">
            <article class="article-card">
                <div class="article-image">
                    <img src="${localCardImg}" alt="${artigo.titulo}" loading="lazy">
                </div>
                <div class="article-content">
                    <span class="article-category">${categoria.charAt(0) + categoria.slice(1).toLowerCase()}</span>
                    <h2 class="article-title">${artigo.titulo}</h2>
                    <p class="article-excerpt">${artigo.resumo}</p>
                    <div class="article-meta">
                        <span class="article-date">📅 ${dataFormatada}</span>
                        <span class="article-reading-time">⏱️ ${tempoLeitura} min de leitura</span>
                    </div>
                    <span class="article-link">Ler artigo completo →</span>
                </div>
            </article>
        </a>`;
            cardsHtmlArray.push(cardHtml);
        }
        
        // ============================================
        // GERAR PÁGINA DE LISTAGEM (blog/index.html)
        // ============================================
        console.log('\n🗂️ Gerando página principal do blog...');
        
        let htmlIndex = indexTemplate
            .replace('<!-- ARTICLES_GRID_PLACEHOLDER -->', cardsHtmlArray.join('\n'));
            
        if (artigos.length === 0) {
            htmlIndex = htmlIndex.replace(
                '<!-- ARTICLES_NO_ARTICLES_PLACEHOLDER -->',
                `<div id="noArticles" class="no-articles">
                    <p>Nenhum artigo publicado no momento. Volte em breve!</p>
                </div>`
            );
        } else {
            htmlIndex = htmlIndex.replace('<!-- ARTICLES_NO_ARTICLES_PLACEHOLDER -->', '');
        }
        
        fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), htmlIndex, 'utf8');
        console.log('💾 Listagem estática atualizada em: blog/index.html');
        
        // ============================================
        // GERAR SITEMAP.XML
        // ============================================
        console.log('\n🗺️ Atualizando sitemap.xml...');
        const hoje = new Date().toISOString().split('T')[0];
        
        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://karinafranzin.com.br/</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://karinafranzin.com.br/#performance</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://karinafranzin.com.br/#como-funciona</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://karinafranzin.com.br/#sobre</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://karinafranzin.com.br/blog/</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://karinafranzin.com.br/eventos/</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://karinafranzin.com.br/cupons/</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
`;

        // 1. Adicionar eventos existentes fisicamente
        const eventosDir = path.join(__dirname, 'eventos');
        if (fs.existsSync(eventosDir)) {
            const itensEventos = fs.readdirSync(eventosDir);
            for (const item of itensEventos) {
                const itemPath = path.join(eventosDir, item);
                if (fs.statSync(itemPath).isDirectory() && fs.existsSync(path.join(itemPath, 'index.html'))) {
                    sitemapXml += `    <url>
        <loc>https://karinafranzin.com.br/eventos/${item}/</loc>
        <lastmod>${hoje}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>\n`;
                }
            }
        }

        // 2. Adicionar artigos dinâmicos processados
        for (const artigo of artigos) {
            sitemapXml += `    <url>
        <loc>https://karinafranzin.com.br/blog/${artigo.slug}/</loc>
        <lastmod>${artigo.data_atualizacao ? artigo.data_atualizacao.split('T')[0] : hoje}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>\n`;
        }

        sitemapXml += '</urlset>';
        
        fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml, 'utf8');
        console.log('💾 sitemap.xml atualizado com todas as novas páginas e eventos!');

        console.log('\n✨ BUILD DO BLOG CONCLUÍDO COM SUCESSO! ✨\n');
        
    } catch (err) {
        console.error('\n❌ Erro durante o processo de build do blog:', err.message);
        process.exit(1);
    }
}

// Rodar o build
build();
