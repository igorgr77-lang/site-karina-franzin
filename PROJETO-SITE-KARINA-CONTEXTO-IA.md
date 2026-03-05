# 🏃‍♀️ PROJETO SITE KARINA FRANZIN — CONTEXTO PARA IA

> **Última atualização:** 04/03/2026  
> **Branch ativa:** `develop`  
> **Projeto online:** https://karinafranzin.com.br  
> **Repositório:** https://github.com/igorgr77-lang/site-karina-franzin  
> **Hospedagem:** GitHub Pages + Cloudflare CDN

---

## 👤 QUEM É A KARINA FRANZIN

**Treinadora de corrida elite** com foco em assessoria online personalizada.

- **Formação:** Educação Física + Fisioterapia
- **Experiência:** 14 anos no esporte (2012–2026)
- **Instagram:** [@karina_franzin](https://www.instagram.com/karina_franzin/)
- **WhatsApp:** +55 17 99656-6908

**Conquistas:**
- 🥇 Campeã da Meia Maratona de Brasília (Elite)
- 🥇 Campeã do Pelotão Geral da São Silvestre
- 🏅 5ª melhor brasileira na SP City Marathon
- 🏅 Integrante da Elite da São Silvestre por 2 anos consecutivos
- 🏅 Tricampeã dos Jogos Regionais (5km e 10km)

**Tempos de referência:**
| Distância | Tempo |
|-----------|-------|
| 5km | 17:50 |
| 10km | 36:42 |
| 15km | 57:30 |
| 21km | 1:20:45 |

---

## 🎯 OBJETIVO DO SITE

Gerar leads qualificados via **WhatsApp** para assessoria de corrida online.

**Público-alvo:**
1. Iniciantes — querem começar a correr do zero
2. Intermediários — buscam melhorar tempos e consistência
3. Avançados — querem alta performance e recordes pessoais

**Proposta de valor:**
- Planilhas semanais personalizadas
- Acompanhamento individual via WhatsApp
- Prevenção de lesões (expertise em Fisioterapia)
- Flexibilidade total (treina onde quiser)

---

## 🏗️ ARQUITETURA DO SITE — ESTADO ATUAL (04/03/2026)

### Páginas Ativas

| Página | Arquivo | Tipo |
|--------|---------|------|
| Home (landing page) | `index.html` | Estático |
| Blog — listagem | `blog/index.html` | Dinâmico (Supabase) |
| Blog — artigo | `blog/artigo.html?slug=...` | Dinâmico (Supabase) |
| Eventos — listagem | `eventos/index.html` | Estático |
| Cãominhada 2026 | `eventos/cao-minhada-2026/index.html` | Estático |
| Dia da Mulher — Lord Lion | `eventos/dia-da-mulher-lord-lion/index.html` | Estático |
| Admin (CMS) | `admin/index.html` | CMS (Supabase) |

### Estrutura de Pastas

```
site-karina-franzin/
├── index.html                        ← Landing page principal
├── css/
│   ├── styles.css                    ← Estilos globais (navbar, footer, home)
│   └── blog.css                      ← Estilos específicos do blog
├── js/
│   ├── main.js                       ← Lógica da navbar, carrossel, formulário
│   ├── blog-list.js                  ← Lista artigos do Supabase no blog
│   ├── blog-article.js               ← Carrega artigo individual do Supabase
│   ├── supabase-config.js            ← Credenciais do Supabase (não commitar!)
│   └── utils.js                      ← Funções utilitárias
├── blog/
│   ├── index.html                    ← Listagem de artigos (dinâmica)
│   └── artigo.html                   ← ÚNICO template de artigo (dinâmico)
├── eventos/
│   ├── index.html                    ← Listagem de eventos
│   ├── cao-minhada-2026/index.html   ← Página do evento Cãominhada
│   └── dia-da-mulher-lord-lion/index.html ← Página do evento Dia da Mulher
├── admin/
│   ├── index.html                    ← Painel de gestão de artigos
│   ├── login.html
│   └── editor.html
├── assets/
│   └── img/                          ← Todas as imagens do site
│       ├── KarinaFranzin80.webp      ← Logo navbar (80x80px)
│       ├── karina-hero.jpg           ← Foto hero da home
│       ├── karina-profile.jpg        ← Foto seção "sobre"
│       ├── lordcard.webp             ← Card do evento Lord Lion
│       ├── capa_evento_2.webp        ← Card do evento Cãominhada
│       ├── logoLordLion.png          ← Logo Lord Lion (parceiro)
│       └── logoKarinaFranzin.png     ← Logo Karina (rodapé eventos)
└── .htaccess                         ← Configuração de rotas/redirects
```

---

## 📝 SISTEMA DE BLOG — LEIA COM ATENÇÃO

### Como funciona (IMPORTANTE)

O blog é **100% dinâmico** — todos os artigos são renderizados por **um único arquivo HTML**:

```
blog/artigo.html?slug=nome-do-artigo
```

**Fluxo:**
1. Usuário acessa `karinafranzin.com.br/blog/artigo.html?slug=como-comecar-a-correr`
2. O JavaScript (`blog-article.js`) lê o `slug` da URL
3. Busca os dados do artigo no **Supabase** (banco de dados)
4. Renderiza o conteúdo dinamicamente na página

**Para criar um novo artigo:** Acesse o painel admin em `/admin/` ou insira direto no Supabase (tabela `artigos`). **Não é necessário criar nenhum arquivo HTML.**

**Para alterar o layout/design dos artigos:** Edite `blog/artigo.html` ou `css/blog.css`. A mudança afeta **todos os artigos automaticamente**.

### ⚠️ Pastas legado no blog (NÃO USAR)

As pastas abaixo existem mas **não são mais utilizadas**. O sistema atual é o dinâmico via Supabase:
- `blog/como-comecar-a-correr-do-zero/`
- `blog/erros-comuns-corrida-iniciantes/`
- `blog/plano-de-treino-para-correr-5km-em-8-semanas-iniciantes/`
- `blog/run-avoa-2026-votuporanga/`

### Supabase — Tabela `artigos`

Campos principais:
- `slug` — identificador único da URL (ex: `como-comecar-a-correr`)
- `titulo` — título do artigo
- `subtitulo` — subtítulo/resumo
- `conteudo` — corpo do artigo (HTML)
- `imagem_capa` — URL da imagem de capa
- `meta_titulo` — título para SEO
- `meta_descricao` — descrição para SEO
- `publicado` — boolean (true = visível no site)

---

## 🧭 NAVBAR E RODAPÉ — REGRAS IMPORTANTES

- A **navbar é idêntica** em todas as páginas (HTML copiado manualmente em cada arquivo)
- O **rodapé é idêntico** em todas as páginas (HTML copiado manualmente em cada arquivo)
- Qualquer alteração em navbar ou rodapé **deve ser replicada em todos os arquivos HTML**
- A navbar usa o logo `assets/img/KarinaFranzin80.webp` (38x38px exibido, 80x80px real)

### Comportamento da Navbar por tipo de página

| Tipo de página | Comportamento |
|----------------|---------------|
| **Home** (`index.html`) | Transparente no topo → escurece ao rolar |
| **Páginas secundárias** | Sempre escura (`navbar-scrolled` já aplicado no HTML) |

### CSS Crítico Inline (fix FOUC)

**Todas as páginas** possuem um bloco `<style>` inline no `<head>` com os estilos mínimos da navbar. Isso evita o FOUC (Flash of Unstyled Content) — o problema onde a navbar aparecia com logo e links em coluna, sem estilo, antes do CSS externo carregar.

- **Home:** CSS crítico com `background: transparent` (navbar começa transparente)
- **Páginas secundárias:** CSS crítico com `background: rgba(20,20,20,0.96)` (navbar sempre escura)

---

## 🎨 DESIGN & IDENTIDADE VISUAL

### Cores principais

| Variável | Valor | Uso |
|----------|-------|-----|
| `--accent-orange` | `#ff6b35` | Laranja principal — CTAs, destaques, navbar |
| `--secondary-orange` | `#f7931e` | Laranja gradiente |
| `--primary-black` | `#1a1a1a` | Texto principal |
| `--white` | `#ffffff` | Backgrounds e texto claro |

⚠️ **A identidade visual é LARANJA/CORAL. Não usar roxo ou azul.**

### Tipografia

- **Font:** Inter (Google Fonts)
- **Pesos:** 300, 400, 600, 700, 800

### Responsividade

- Mobile-first
- Breakpoints: 480px / 768px / 1200px+
- Botões touch-friendly (mínimo 44px)

---

## 🔄 CONVERSÃO & WHATSAPP

**Número:** +55 17 99656-6908

**Pontos de conversão na home:**
1. Hero CTA — "Falar com a Karina no WhatsApp"
2. Botão flutuante — sempre visível, canto inferior direito
3. Formulário — coleta dados e redireciona com mensagem personalizada
4. CTA final — "Falar com a Karina agora"
5. Footer — link direto WhatsApp

**Mensagem do formulário:**
```
Olá, Karina! Meu nome é [NOME].
Vim pelo seu site e quero começar uma assessoria de corrida.
🎯 Meu objetivo: [OBJETIVO]
📊 Meu nível atual: [NÍVEL]
Pode me explicar como funciona?
```

---

## 🐛 PROBLEMAS CONHECIDOS E SOLUÇÕES

### 1. FOUC da Navbar (RESOLVIDO ✅)
- **Problema:** Em alguns celulares e navegadores, a navbar aparecia com logo e links em coluna, sem estilo, antes do CSS externo carregar. Limpar cookies resolvia pois o CSS ficava em cache.
- **Causa:** FOUC — o HTML renderizava antes do `styles.css` carregar.
- **Solução:** CSS crítico inline adicionado no `<head>` de **todas as páginas** com os estilos mínimos da navbar. A navbar sempre renderiza corretamente desde o primeiro pixel, independente de cache ou conexão.
- **Commit:** `3da34d2` (04/03/2026)

### 2. Carrossel de Feedbacks (RESOLVIDO ✅ — CUIDADO ao mexer)
- **Problema:** O carrossel de depoimentos de alunos na home apresentou vários bugs difíceis de resolver — itens duplicados, navegação quebrada, autoplay conflitando com interação do usuário, e comportamento inconsistente no mobile.
- **Solução:** Reescrito com lógica própria em `js/main.js`. Usa `translateX` para animação, controle de índice manual e listeners de touch para mobile.
- **⚠️ CUIDADO:** Não alterar a estrutura HTML do carrossel sem revisar o JS correspondente em `main.js`. O carrossel é sensível a mudanças na estrutura de classes e atributos `data-`.

### 3. Artigos dinâmicos não indexados pelo Google (PENDENTE 🔴)
- **Problema:** Como o conteúdo dos artigos é carregado via JavaScript, o Google demora ou não consegue indexar o texto dos artigos (o bot vê a página antes do JS executar).
- **Solução planejada:** Cloudflare Workers para pre-rendering para bots (SSR no edge).
- **Status:** Ainda não implementado.

### 4. Background-attachment fixed (RESOLVIDO ✅)
- **Problema:** `background-attachment: fixed` causa problemas de performance e visual no mobile.
- **Solução:** Usar `background-attachment: scroll`.

### 5. Links locais vs online (RESOLVIDO ✅)
- **Problema:** Links com `./pasta/` abriam índice de diretório em ambiente local.
- **Solução:** Sempre usar `./pasta/index.html` explicitamente.

### 6. Cloudflare DNS travado (RESOLVIDO ✅)
- **Problema:** GitHub Pages travado em "DNS Check in Progress".
- **Solução:** Cloudflare SSL/TLS em modo "Full" (não Flexible, não Full Strict) + remover e re-adicionar o domínio no GitHub Pages.

---

## 🗂️ EVENTOS

### Como adicionar um novo evento

1. Criar o card em `eventos/index.html` (seguir o padrão dos cards existentes)
2. Criar a pasta `eventos/nome-do-evento/`
3. Criar `eventos/nome-do-evento/index.html` com navbar e rodapé padrão do site

### Eventos ativos

| Evento | Arquivo | Data | Status |
|--------|---------|------|--------|
| 2ª Cãominhada Studio Ativo | `eventos/cao-minhada-2026/` | 2026 | ✅ Online |
| A Noite É Delas! (Lord Lion) | `eventos/dia-da-mulher-lord-lion/` | 08/03/2026 | ✅ Online |

### Parceiro — Lord Lion Cervejaria

- **Instagram:** [@lordlioncervejaria](https://www.instagram.com/lordlioncervejaria/)
- **Projeto standalone:** `C:\Users\oigor\PROJETOS\LordLion_Diadamulher\index.html`
- A página standalone existe separada do site da Karina e também foi adaptada para integração

---

## 🚀 WORKFLOW DE DESENVOLVIMENTO

### Git

```bash
# Desenvolvimento sempre na branch develop
git add .
git commit -m "descrição das mudanças"
git push

# Para publicar (merge develop → main)
git checkout main
git merge develop
git push
git checkout develop
```

### Teste local

```powershell
cd site-karina-franzin
python -m http.server 8080
# Acesse: http://localhost:8080/
```

### Deploy

- Deploy automático a cada push na branch `main`
- Tempo de propagação: 5–10 minutos
- GitHub Pages + Cloudflare CDN

---

## 🔍 SEO

- **Google Search Console:** Configurado (propriedade tipo "Domínio")
- **Sitemap:** https://karinafranzin.com.br/sitemap.xml (enviado)
- **Schema Markup:** ProfessionalService, Person, WebSite, FAQPage, Article
- **Meta tags:** Title, Description, OG, Twitter Cards, Canonical, Alt text
- **Google Analytics 4:** Ativo em todas as páginas

**Palavras-chave foco:**
- Assessoria de corrida online
- Treinamento de corrida personalizado
- Personal trainer corrida
- Como começar a correr
- Plano de treino 5km / 10km / meia maratona

---

## ⚡ PERFORMANCE

- **Logo navbar:** `KarinaFranzin80.webp` — 80x80px WebP (~5KB). Substituiu `logo.jpg` que era 1080x1136px / 85KB.
- **Imagens:** Formato WebP preferencial
- **CSS crítico inline:** Navbar renderiza sem depender de CSS externo
- **Google Fonts:** Carregamento assíncrono com `preconnect` e `preload`
- **Meta:** PageSpeed ~90%+

---

## 📅 HISTÓRICO DE COMMITS RELEVANTES

| Data | Hash | Descrição |
|------|------|-----------|
| 04/03/2026 | `91294a2` | Alteração da imagem do logo da navbar (logo.jpg → KarinaFranzin80.webp) |
| 04/03/2026 | `3da34d2` | Resolvido bug FOUC da navbar em todos os dispositivos |
| 04/03/2026 | `c675a36` | Página e card do evento Lord Lion (Dia da Mulher) |
| 03/03/2026 | `e330262` | Ajuste na descrição do card da Cãominhada |
| 03/03/2026 | `f776dd3` | Implantação da navbar e página de Eventos concluída |
| 03/03/2026 | `2e06304` | Navbar incluída em todo o site |
| 01/03/2026 | `d6455bb` | Implementação do sistema dinâmico de artigos (Supabase) |
| 01/03/2026 | `7e00e5d` | Criação da página da 2ª Cãominhada 2026 |

---

## ✅ ESTADO ATUAL DO PROJETO (04/03/2026)

- ✅ Landing page completa e otimizada
- ✅ Blog dinâmico via Supabase (listagem + artigos por slug)
- ✅ Cards do blog inteiramente clicáveis (card inteiro leva ao artigo)
- ✅ Painel admin (CMS) funcional
- ✅ Seção de Eventos com 2 eventos ativos
- ✅ Navbar global em todas as páginas (com CSS crítico inline — sem FOUC)
- ✅ Logo otimizado na navbar (WebP 80x80px)
- ✅ Google Analytics 4 ativo
- ✅ SEO com Schema Markup implementado
- ✅ Domínio `karinafranzin.com.br` com Cloudflare + GitHub Pages
- 🔴 **Pendente:** Indexação dos artigos dinâmicos pelo Google (aguarda Cloudflare Workers)

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 04/03/2026 (sessão 3)

### ✅ O que foi feito:

**Card do blog inteiramente clicável:**
- **Antes:** Só o botão "Ler artigo completo →" era clicável no card
- **Agora:** O card inteiro (imagem, título, resumo, data) é clicável e leva ao artigo
- **Como foi feito:**
  - `blog/index.html` — Template do card: `<article>` envolvido por `<a class="article-card-link">`. O `<a class="article-link">` interno virou `<span>` para evitar link dentro de link (HTML inválido)
  - `js/blog-list.js` — O `href` agora é atribuído ao `.article-card-link` (elemento externo) em vez do `.article-link` interno
  - `css/blog.css` — Adicionado estilo para `.article-card-link` (sem sublinhado, cursor pointer) e efeito hover suave (eleva o card 4px + sombra laranja)

**Reestruturação do arquivo de contexto:**
- Arquivo `PROJETO-SITE-KARINA-CONTEXTO-IA.md` reescrito do zero
- Removidas informações obsoletas, histórico antigo e documentação duplicada
- Arquivo enxuto (~200 linhas) com foco no estado atual do projeto

### 📁 Arquivos Modificados:
- `blog/index.html` — Template do card atualizado
- `js/blog-list.js` — Link atribuído ao card inteiro
- `css/blog.css` — Estilos do card clicável adicionados
- `PROJETO-SITE-KARINA-CONTEXTO-IA.md` — Reestruturado
