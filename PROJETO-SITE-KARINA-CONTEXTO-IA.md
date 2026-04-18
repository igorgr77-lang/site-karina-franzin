# 🏃‍♀️ PROJETO SITE KARINA FRANZIN — CONTEXTO PARA IA

> **Última atualização:** 01/04/2026  
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

### 3. Artigos dinâmicos não indexados pelo Google (RESOLVIDO ✅)
- **Problema:** Como o conteúdo dos artigos é carregado via JavaScript, o Google demora ou não consegue indexar o texto dos artigos (o bot vê a página antes do JS executar).
- **Solução:** Cloudflare Worker `karina-franzin-seo` intercepta requisições de bots na rota `/blog*`, busca o artigo no Supabase e injeta os meta tags (título, descrição, OG tags, conteúdo) no HTML antes de entregar ao Google. Usuários normais recebem a página original sem interferência.
- **Commit:** 31/03/2026 (parte 3)
- **Teste confirmado:** `curl -A "Googlebot/2.1"` retornou `X-Rendered-By: Cloudflare-Worker` ✅

### 4. Background-attachment fixed (RESOLVIDO ✅)
- **Problema:** `background-attachment: fixed` causa problemas de performance e visual no mobile.
- **Solução:** Usar `background-attachment: scroll`.

### 5. Links locais vs online (RESOLVIDO ✅)
- **Problema:** Links com `./pasta/` abriam índice de diretório em ambiente local.
- **Solução:** Sempre usar `./pasta/index.html` explicitamente.

### 6. Cloudflare DNS travado (RESOLVIDO ✅)
- **Problema:** GitHub Pages travado em "DNS Check in Progress".
- **Solução:** Cloudflare SSL/TLS em modo "Full" (não Flexible, não Full Strict) + remover e re-adicionar o domínio no GitHub Pages.

### 7. Navbar transparente ao acessar pelo Instagram (RESOLVIDO ✅)
- **Problema:** Ao acessar o site pelo link do Instagram, a navbar ficava transparente no topo. Ao rolar, ficava preta — mas bloqueava o clique nos dots do carrossel.
- **Causa:** O Instagram às vezes abre links num browser interno onde o `userAgent` **não contém "Instagram"**, então a detecção por `userAgent` falhava. Além disso, a função `updateNavbar()` só usava `isWebView` para manter a navbar escura, ignorando as outras condições.
- **Solução em `js/main.js`:** Três camadas de detecção:
  1. `userAgent` → detecção original (WebView nativo)
  2. `document.referrer` → detecta quando vem de `instagram.com` / `facebook.com`
  3. Parâmetros de URL → detecta `igshid`, `utm_source=ig_web`, `utm_medium=copy_link`
  - A função `updateNavbar()` corrigida para usar as 3 condições
  - Classe `is-webview` adicionada no `document.body` para uso no CSS
- **Commit:** 31/03/2026

### 8. Foto hero cortada no mobile quando navbar está preta (RESOLVIDO ✅)
- **Problema:** Com a navbar sempre escura (WebView/Instagram), ela cobre o topo da foto da Karina na seção hero no mobile.
- **Causa:** A navbar tem `position: fixed` e `height: 64px`. Quando fica preta ela se torna visível e sobrepõe o topo da hero, cortando a cabeça da Karina na foto.
- **Solução:**
  - `js/main.js` → adiciona `document.body.classList.add('is-webview')` quando detecta Instagram/WebView
  - `css/styles.css` → regra `body.is-webview .hero { padding-top: 64px; background-position: center 64px; }` empurra o hero e ajusta a posição da foto
- **Commit:** 31/03/2026

### 9. Dots (bolinhas) do carrossel não clicáveis no WebView (RESOLVIDO ✅)
- **Problema:** No WebView do Instagram, clicar nos dots de navegação do carrossel de feedbacks não funcionava.
- **Causa:** O evento `click` tem delay de 300ms no WebView e pode ser engolido pelo sistema. Os dots só tinham `onclick`.
- **Solução em `js/main.js`:** Adicionado `touchstart` com `e.stopPropagation()` em cada dot (evita o track capturar o evento) com proteção contra duplo disparo (flag `dotTouched`).
- **Commit:** 31/03/2026

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
| Treinao Lord Lion e Karina Franzin | `eventos/treinao-lord-lion/` | 11/04/2026 | ✅ Online |

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
| 31/03/2026 | —  | Fix navbar transparente no Instagram + foto hero cortada + dots carrossel no WebView |
| 04/03/2026 | `91294a2` | Alteração da imagem do logo da navbar (logo.jpg → KarinaFranzin80.webp) |
| 04/03/2026 | `3da34d2` | Resolvido bug FOUC da navbar em todos os dispositivos |
| 04/03/2026 | `c675a36` | Página e card do evento Lord Lion (Dia da Mulher) |
| 03/03/2026 | `e330262` | Ajuste na descrição do card da Cãominhada |
| 03/03/2026 | `f776dd3` | Implantação da navbar e página de Eventos concluída |
| 03/03/2026 | `2e06304` | Navbar incluída em todo o site |
| 01/03/2026 | `d6455bb` | Implementação do sistema dinâmico de artigos (Supabase) |
| 01/03/2026 | `7e00e5d` | Criação da página da 2ª Cãominhada 2026 |

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 02/04/2026 — EVENTO TREINÃO LORD LION ✅

### ✅ Status: CONCLUÍDO

**Objetivo:** Criar página do evento "Treinão Lord Lion & Karina Franzin" e adicioná-lo à listagem de eventos do site.

**O que foi feito:**
- ✅ Criada pasta `eventos/treinao-lord-lion/`
- ✅ Criado `eventos/treinao-lord-lion/index.html` — página completa do evento, adaptada da versão standalone em `C:\Users\oigor\PROJETOS\TreinaoLordeKarina\index.html`
- ✅ Navbar e rodapé padrão do site integrados (com CSS crítico inline anti-FOUC)
- ✅ Logos usando `../../assets/img/logoKarinaFranzin.png` e `../../assets/img/logoLordLion.png` (já existentes)
- ✅ Card do evento adicionado em `eventos/index.html` — aparece como 1º card em "Próximos Eventos"

**Detalhes do evento:**
- **Data:** 11 de Abril de 2026
- **Local:** Em frente à Lord Lion Cervejaria — Votuporanga-SP
- **Concentração:** 17h30 | **Largada:** 18h00
- **Percurso:** 5km
- **After:** Pagode A+ na Lord Lion (entrada free + mesa gratuita para participantes)
- **Contato (reserva de mesa):** (17) 99723-6693

**Tecnologias usadas na página do evento:**
- Tailwind CSS (CDN)
- Lucide Icons
- Fontes: Montserrat + Oswald + Inter
- Mesmo padrão do evento Dia da Mulher Lord Lion

### 📁 Arquivos criados/modificados:
- `eventos/treinao-lord-lion/index.html` — página do evento (NOVO)
- `eventos/index.html` — card do Treinão adicionado (1º na seção "Próximos Eventos")

---

## ✅ ESTADO ATUAL DO PROJETO (17/04/2026)

- ✅ Landing page completa e otimizada
- ✅ Blog dinâmico via Supabase (listagem + artigos por slug)
- ✅ Cards do blog inteiramente clicáveis (card inteiro leva ao artigo)
- ✅ Painel admin (CMS) funcional
- ✅ Seção de Eventos com 3 eventos ativos
- ✅ Navbar global em todas as páginas (com CSS crítico inline — sem FOUC)
- ✅ Navbar sempre escura ao acessar pelo Instagram/WebView (3 camadas de detecção)
- ✅ Foto hero não cortada no mobile quando navbar está preta
- ✅ Dots do carrossel clicáveis no WebView do Instagram
- ✅ Logo otimizado na navbar (WebP 80x80px)
- ✅ Google Analytics 4 ativo
- ✅ SEO com Schema Markup implementado
- ✅ Domínio `karinafranzin.com.br` com Cloudflare + GitHub Pages
- ✅ Cloudflare Worker `karina-franzin-seo` deployado — blog indexável pelo Google (SSR no edge)
- ✅ Preview de links no WhatsApp/Telegram/redes sociais mostra título e imagem real do artigo
- ✅ Seção de Parceiros Oficiais (9 parceiros) — acima do CTA final
- ✅ Evento "Treinão Lord Lion & Karina Franzin" — 11/04/2026 — página criada e card na listagem
- ✅ Evento "Treinão Lord Ultra Run" — 09/05/2026 — página criada e card na listagem
- ✅ Classificação automática de eventos por data (Próximos → Passados) via JavaScript

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 17/04/2026 — EVENTO TREINÃO ULTRA LORD MAIO ✅

### ✅ Status: CONCLUÍDO

**Objetivo:** Criar página do evento "Treinão Lord Ultra Run" (09/05/2026) e implementar classificação automática de eventos por data.

**O que foi feito:**
- ✅ Criada pasta `eventos/treinao-ultra-lord-maio/`
- ✅ Criado `eventos/treinao-ultra-lord-maio/index.html` — adaptado do standalone `C:\Users\oigor\PROJETOS\TreinaoUltraLord_Maio\index.html`
- ✅ Navbar e rodapé padrão do site integrados (CSS crítico inline anti-FOUC)
- ✅ Logos usando `../../assets/img/logoKarinaFranzin.png` e `../../assets/img/logoLordLion.png`
- ✅ Card adicionado em `eventos/index.html` com `data-date="2026-05-09"` — aparece como 1º em "Próximos Eventos"

**Como funciona a classificação automática:**
- Cada card tem `data-date="YYYY-MM-DD"` com a data do evento
- O JS em `eventos/index.html` (~linha 840) compara cada data com a data atual
- Se `dataEvento < hoje` → move o card para `#gridPassados` automaticamente ao carregar
- Zero edição manual necessária — funciona para todos os eventos futuros também

**Detalhes do evento:**
- **Data:** 09 de Maio de 2026 | **Concentração:** 17h30 | **Largada:** 18h00
- **Local:** Em frente à Lord Lion Cervejaria — Votuporanga-SP
- **Percurso:** Trilha na terra (Ultra Run)
- **After:** Pós-treino elite na Lord Lion (entrada free para atletas)
- **Contato:** (17) 99723-6693 (WhatsApp)

### 📁 Arquivos criados/modificados:
- `eventos/treinao-ultra-lord-maio/index.html` — página do evento (NOVO)
- `eventos/index.html` — card do Treinão Ultra Run adicionado
- `PROJETO-SITE-KARINA-CONTEXTO-IA.md` — atualizado

### ⚠️ Observações:
- Card usa placeholder emoji — quando houver capa real, salvar em `assets/img/treinao-ultra-lord-maio/` e trocar `div.evento-card-img-placeholder` por `<img class="evento-card-img">`
- Link do Strava no botão é provisório — atualizar quando o evento real for criado no Strava

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 01/04/2026 — SEÇÃO PARCEIROS OFICIAIS ✅



- ✅ Landing page completa e otimizada
- ✅ Blog dinâmico via Supabase (listagem + artigos por slug)
- ✅ Cards do blog inteiramente clicáveis (card inteiro leva ao artigo)
- ✅ Painel admin (CMS) funcional
- ✅ Seção de Eventos com 2 eventos ativos
- ✅ Navbar global em todas as páginas (com CSS crítico inline — sem FOUC)
- ✅ Navbar sempre escura ao acessar pelo Instagram/WebView (3 camadas de detecção)
- ✅ Foto hero não cortada no mobile quando navbar está preta
- ✅ Dots do carrossel clicáveis no WebView do Instagram
- ✅ Logo otimizado na navbar (WebP 80x80px)
- ✅ Google Analytics 4 ativo
- ✅ SEO com Schema Markup implementado
- ✅ Domínio `karinafranzin.com.br` com Cloudflare + GitHub Pages
- ✅ Cloudflare Worker `karina-franzin-seo` deployado — blog indexável pelo Google (SSR no edge)
- ✅ Preview de links no WhatsApp/Telegram/redes sociais mostra título e imagem real do artigo
- ✅ URL inspecionada no Google Search Console — aguardando indexação (1–7 dias)
- ✅ Seção de Parceiros Oficiais com marquee infinito (9 parceiros) — acima do CTA final
- ✅ Evento "Treinão Lord Lion & Karina Franzin" — 11/04/2026 — página criada e card na listagem

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 01/04/2026 — SEÇÃO PARCEIROS OFICIAIS ✅

### ✅ Status: CONCLUÍDO

**Objetivo:** Criar seção de Parceiros Oficiais no site principal com grid fixa de logos e links para cada parceiro.

**Decisões de arquitetura:**
- Tentativa inicial com marquee infinito CSS + drag JS foi abandonada por instabilidade no Instagram/WebView
- Solução final: **grid fixa com flexbox** — zero JavaScript, 100% estável em qualquer ambiente

**O que foi feito:**
- ✅ Criada seção `#parceiros` no `index.html` — posicionada acima do CTA "Pronto para transformar sua corrida?"
- ✅ Grid flexbox com 9 logos — `flex-wrap: wrap` organiza automaticamente em linhas
- ✅ Logos em cards brancos (200×110px desktop, 140×80px mobile, 120×68px small mobile)
- ✅ Fundo claro `#f8f8f8` — funciona com logos de qualquer formato (PNG, WebP, JPEG)
- ✅ Logos em escala de cinza (50%) → coloridas no hover com transição suave
- ✅ CSS crítico inline no HTML — garante layout correto mesmo com cache antigo do CSS externo (mesmo padrão da navbar)
- ✅ `display: flex !important` e dimensões com `!important` — previne sobrescrita pelo WebView do Instagram
- ✅ Responsivo para mobile e telas pequenas
- ✅ Cada logo com link abrindo em nova aba

**9 Parceiros (em ordem):**
1. Lord Lion Cervejaria → https://www.instagram.com/lordlioncervejaria/ (1-LordLion.png)
2. Jorrovi Calçados → https://www.instagram.com/jorrovicalcadosoficial/ (2-JORROVICALCADOS.webp)
3. Studio Ativo → https://www.instagram.com/studioativo/ (3-studio ativo.png)
4. Equilíbrio Esportes → https://equilibrio.esp.br/ (4-EQUILIBRIO ESPORTES.png)
5. Essencial Votu → https://loja.essencialvotu.com.br/ (5-ESSENCIAL VOTU.png)
6. Thallys Freitas Fisio → https://www.instagram.com/fisiothallysfreitas/ (6-THALLYS FREITAS.png)
7. Renan Rodrigues Nutri → https://www.instagram.com/renanrodriguesnutri/ (7-RENAN RODRIGUES.jpeg)
8. Protege Cuidados → https://www.instagram.com/protegecuidadosoficial/ (8-Protege Cuidados.png)
9. Pizzaria Veneza → https://pizzariavenezavotuporanga.saipos.com/home (9-Pizzaria Veneza.png)

**Logos em:** `assets/img/parceiros/`

### 📁 Arquivos Modificados:
- `index.html` — seção parceiros com CSS crítico inline
- `css/styles.css` — estilos da seção parceiros
- `assets/img/parceiros/` — 9 logos dos parceiros

### ⚠️ Observações para próximas sessões:
- Para adicionar novo parceiro: adicionar um bloco `<a class="parceiro-item">` dentro de `.parceiros-grid` no HTML e atualizar o CSS inline no `<style>` acima da seção
- O CSS crítico inline está logo antes da `<section class="parceiros">` — SEMPRE manter em sincronia com o `styles.css`
- Logos com espaço no nome (ex: `3-studio ativo.png`) funcionam normalmente no HTML
- O `!important` no flexbox é necessário para o WebView do Instagram não sobrescrever o layout

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 31/03/2026 (parte 4) — FIX PREVIEW WHATSAPP ✅

### ✅ Status: CONCLUÍDO

**Objetivo:** Corrigir o preview de links dos artigos do blog ao compartilhar no WhatsApp (e outros apps sociais). Antes aparecia *"Carregando... | Blog Karina Franzin"* em vez do título real do artigo.

**Causa raiz (dois problemas simultâneos):**
1. A regex de remoção do `<title>` no Worker não cobria o atributo `id` → `<title id="pageTitle">Carregando...</title>` não era removido e permanecia no HTML
2. Os secrets do Supabase no Worker (`SUPABASE_URL` e `SUPABASE_KEY`) estavam desatualizados → artigo retornava `not-found` e o Worker usava apenas o slug convertido como fallback do título

**O que foi feito:**
- ✅ Regex corrigida: `/<title>[^<]*<\/title>/gi` → `/<title[^>]*>[^<]*<\/title>/gi` (cobre atributos no `<title>`)
- ✅ Secrets `SUPABASE_URL` e `SUPABASE_KEY` re-configurados via `wrangler secret put`
- ✅ Lista de bots sociais expandida: adicionados `facebot`, `slackbot`, `discordbot`, `skype`, `iframely`, `embedly`, `outbrain`, `pinterest`
- ✅ Busca no Supabase agora acontece **antes** de buscar o HTML (evita race condition/timeout)
- ✅ Cache reativado: `Cache-Control: public, max-age=3600`
- ✅ Header de debug adicionado: `X-Debug-UA` (primeiros 80 chars do User-Agent)
- ✅ Deploy realizado — Version ID: `7692cad1-551a-4fd4-b4b3-f79a64935de7`

**Teste confirmado (PowerShell):**
```
X-Debug-Article: found
X-Debug-Slug: como-comecar-a-correr-do-zero
<title>Como Começar a Correr do Zero: Guia Completo para Iniciantes</title>
og:title: "Como Começar a Correr do Zero: Guia Completo para Iniciantes"
og:image: (imagem real do artigo do Supabase)
```

### 📁 Arquivos Modificados:
- `cloudflare-worker/src/index.js` — Fix regex title, lista bots expandida, busca Supabase antecipada, cache reativado

### ⚠️ Observações:
- O WhatsApp cacheia previews de links. Se testar com um link já enviado antes, pode aparecer o preview antigo. Testar com link novo ou aguardar expiração do cache.
- Secrets do Supabase no Worker: sempre usar `wrangler secret put NOME` via CMD (não PowerShell)

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 31/03/2026 (parte 3) — CLOUDFLARE WORKER CONCLUÍDO ✅

### ✅ Status: CONCLUÍDO

**Objetivo:** Configurar Cloudflare Worker para que o Googlebot consiga indexar os artigos dinâmicos do blog (carregados via Supabase/JavaScript).

**O que foi feito:**
- ✅ Secrets configurados no Worker via CMD:
  - `wrangler secret put SUPABASE_URL`
  - `wrangler secret put SUPABASE_KEY`
- ✅ Deploy realizado com `wrangler deploy`
- ✅ Rota ativa: `karinafranzin.com.br/blog*` → Worker `karina-franzin-seo`
- ✅ Teste confirmado: `curl -A "Googlebot/2.1"` retornou `X-Rendered-By: Cloudflare-Worker`
- ✅ URL inspecionada no Google Search Console (aguardando indexação: 1–7 dias)

**Como funciona o Worker:**
- Usuários normais → passa direto para o GitHub Pages (sem interferência)
- Googlebot/crawlers → busca o artigo no Supabase, injeta título, descrição, OG tags e conteúdo no HTML antes de entregar ao Google
- Intercepta apenas rotas `/blog*` (o resto do site não é afetado)
- Cache de 1 hora (`Cache-Control: public, max-age=3600`)

**Version ID do deploy:** `9eded03c-ff5d-4021-b5a3-209dc9666270`

### 📁 Arquivos do Worker:
- `cloudflare-worker/src/index.js` — lógica principal do Worker
- `cloudflare-worker/wrangler.toml` — configuração (nome, rota, zona)
- `cloudflare-worker/package.json` — scripts de deploy

### ⚠️ Observações para próximas sessões:
- Para redeploy após editar o Worker: `cd cloudflare-worker && wrangler deploy` (usar CMD, não PowerShell — política de execução de scripts)
- Para atualizar secrets: `wrangler secret put NOME_DO_SECRET` (também via CMD)
- Verificar indexação no Google Search Console após 7–14 dias

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 31/03/2026

### ✅ O que foi feito:

**Fix: Navbar transparente ao acessar pelo Instagram:**
- Problema reportado: navbar ficava transparente ao abrir o site pelo link do Instagram
- Adicionadas 3 camadas de detecção no `js/main.js`: `userAgent`, `document.referrer` e parâmetros de URL (`igshid`, `utm_source=ig_web`, `utm_medium=copy_link`)
- Função `updateNavbar()` corrigida para usar todas as 3 condições

**Fix: Foto da Karina cortada no mobile:**
- Com a navbar sempre escura no WebView, ela cobria o topo da foto hero
- Solução: `document.body.classList.add('is-webview')` no JS + CSS `body.is-webview .hero { padding-top: 64px; background-position: center 64px; }`

**Fix: Dots (bolinhas) do carrossel não clicáveis no WebView:**
- Adicionado evento `touchstart` com `e.stopPropagation()` em cada dot
- Proteção contra duplo disparo com flag `dotTouched`

### 📁 Arquivos Modificados:
- `js/main.js` — Detecção Instagram, updateNavbar, is-webview no body, touchstart nos dots
- `css/styles.css` — Regra `body.is-webview .hero` adicionada
- `PROJETO-SITE-KARINA-CONTEXTO-IA.md` — Atualizado

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
- Arquivo enxuto com foco no estado atual do projeto

### 📁 Arquivos Modificados:
- `blog/index.html` — Template do card atualizado
- `js/blog-list.js` — Link atribuído ao card inteiro
- `css/blog.css` — Estilos do card clicável adicionados
- `PROJETO-SITE-KARINA-CONTEXTO-IA.md` — Reestruturado
