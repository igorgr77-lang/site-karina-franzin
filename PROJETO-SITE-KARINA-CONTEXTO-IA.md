# 🏃‍♀️ PROJETO SITE KARINA FRANZIN - CONTEXTO PARA IA

## 📋 RESUMO DO PROJETO
Site profissional para **Karina Franzin**, treinadora de corrida elite, oferecendo assessoria online personalizada.

**URL Final:** https://karinafranzin.com.br  
**Repositório:** https://github.com/igorgr77-lang/site-karina-franzin  
**Hospedagem:** GitHub Pages + Cloudflare CDN

---

## 👤 PERFIL DA CLIENTE

### **Karina Franzin - Treinadora de Corrida Elite**
- **Formação:** Educação Física + Fisioterapia
- **Experiência:** 14 anos no esporte (2012-2026)
- **Especialidade:** Assessoria online de corrida para todos os níveis

### **Conquistas Principais:**
- 🏆 Campeã da Meia Maratona de Brasília (Elite)
- 🏆 Campeã do Pelotão Geral da São Silvestre
- 🏆 5ª melhor brasileira na SP City Marathon
- 🏆 Integrante da Elite da São Silvestre por 2 anos consecutivos
- 🏆 Tricampeã dos Jogos Regionais (5km e 10km)

### **Tempos de Referência:**
- **5km:** 17:50
- **10km:** 36:42  
- **15km:** 57:30
- **21km:** 1:20:45

---

## 🎯 OBJETIVO DO SITE

### **Conversão Principal:**
Gerar leads qualificados via **WhatsApp** para assessoria de corrida online.

### **Público-Alvo:**
1. **Iniciantes** - Querem começar a correr do zero
2. **Intermediários** - Buscam melhorar tempos e consistência  
3. **Avançados** - Querem alta performance e recordes pessoais

### **Proposta de Valor:**
- Planilhas semanais personalizadas
- Acompanhamento individual via WhatsApp
- Prevenção de lesões (expertise em Fisioterapia)
- Treinamento mental e estratégico
- Flexibilidade total (treina onde quiser)

---

## 🏗️ ARQUITETURA DO SITE

### ⚡ **IMPORTANTE: SISTEMA DE ARTIGOS DINÂMICO**

**🔴 ATENÇÃO - LEIA ANTES DE FAZER QUALQUER ALTERAÇÃO NO BLOG:**

Os artigos do blog são **100% DINÂMICOS** e carregados de um **ÚNICO ARQUIVO HTML**:

📄 **Arquivo Principal:** `site-karina-franzin/blog/artigo.html`

**Como funciona:**
- **Todos os artigos** são renderizados a partir de `blog/artigo.html`
- Os dados vêm do **Supabase** (banco de dados)
- O conteúdo é carregado dinamicamente via JavaScript (`blog-article.js`)
- URL pattern: `https://karinafranzin.com.br/blog/artigo.html?slug=nome-do-artigo`

**❌ NÃO EXISTEM múltiplos arquivos HTML para cada artigo**
- As pastas `blog/como-comecar-a-correr-do-zero/`, `blog/run-avoa-2026-votuporanga/`, etc. são **antigas** e **NÃO SÃO MAIS USADAS**
- O sistema atual é **CMS dinâmico com Supabase**

**✅ Para alterar qualquer elemento visual/layout dos artigos:**
- **SEMPRE edite:** `site-karina-franzin/blog/artigo.html`
- **CSS dos artigos:** `site-karina-franzin/css/blog.css`
- **JavaScript:** `site-karina-franzin/js/blog-article.js`
- **A mudança será aplicada AUTOMATICAMENTE em TODOS os artigos**

**✅ Para adicionar/editar conteúdo dos artigos:**
- Use o **Painel Administrativo:** `https://karinafranzin.com.br/admin/`
- Ou edite diretamente no **Supabase** (tabela `artigos`)

**📋 Exemplo prático:**
- ✅ Alterar banner da Cãominhada → Edite `blog/artigo.html` (afeta todos os artigos)
- ✅ Mudar cores do CTA → Edite `css/blog.css` (afeta todos os artigos)
- ✅ Adicionar novo artigo → Use `/admin/` ou Supabase
- ❌ **NUNCA** crie arquivos HTML individuais para artigos

---

### **Estrutura de Pastas:**
```
site-karina-franzin/
├── index.html (página principal - landing page)
├── blog/
│   ├── index.html (listagem de artigos - carrega do Supabase)
│   ├── artigo.html ⭐ ÚNICO TEMPLATE USADO POR TODOS OS ARTIGOS
│   ├── como-comecar-a-correr-do-zero/ ❌ ANTIGO - NÃO USADO
│   ├── plano-de-treino-5km-para-iniciantes/ ❌ ANTIGO - NÃO USADO
│   ├── erros-comuns-corrida-iniciantes/ ❌ ANTIGO - NÃO USADO
│   └── run-avoa-2026-votuporanga/ ❌ ANTIGO - NÃO USADO
├── admin/ ⭐ PAINEL ADMINISTRATIVO (CMS)
│   ├── index.html (dashboard - lista artigos)
│   ├── editor.html (editor de artigos)
│   ├── login.html (autenticação)
│   ├── css/
│   └── js/
├── css/
│   ├── styles.css (estilos do site principal)
│   └── blog.css ⭐ ESTILOS DOS ARTIGOS DINÂMICOS
├── js/
│   ├── main.js (interatividade do site principal)
│   ├── blog-list.js ⭐ CARREGA LISTA DE ARTIGOS DO SUPABASE
│   ├── blog-article.js ⭐ CARREGA ARTIGO INDIVIDUAL DO SUPABASE
│   ├── utils.js (funções auxiliares)
│   └── supabase-config.js (configuração do banco de dados)
├── assets/
│   ├── img/ 
│   │   ├── banner_caminhada.png ⭐ BANNER CTA CÃOMINHADA
│   │   ├── cabecalho-*.jpg (imagens dos artigos)
│   │   ├── karina-hero.jpg
│   │   ├── karina-profile.jpg
│   │   ├── logo.jpg
│   │   └── alunos-podio-*.jpg
│   └── icons/ (WhatsApp em .webp)
├── .htaccess (cache e compressão)
├── sw.js (service worker para performance)
├── robots.txt (URL correta: karinafranzin.com.br)
├── sitemap.xml (inclui blog - URL correta)
└── CNAME (karinafranzin.com.br)
```

### **Seções do Site Principal:**
1. **Hero** - CTA principal com background da Karina
2. **Performance** - Tempos e autoridade no esporte
3. **Como Funciona** - Processo da assessoria (6 cards)
4. **Para Quem É** - Segmentação por nível (iniciante/intermediário/avançado)
5. **Prova Social** - Fotos de alunos no pódio + depoimentos
6. **Sobre** - História e credenciais da Karina
7. **FAQ** - Dúvidas frequentes (accordion)
8. **Contato** - Formulário que redireciona para WhatsApp
9. **CTA Final** - Chamada forte para ação
10. **Footer** - Links sociais (Instagram, Strava, WhatsApp, **BLOG**)

### **Blog:**
- **4 Artigos SEO-otimizados** (800-1200 palavras cada)
- **Footer completo em todos os artigos** (Blog, Instagram, Strava, WhatsApp + Copyright)
- **Imagens personalizadas** em todos os cards do blog

#### **Artigos Publicados:**

1. **RUN AVOA 2026 Votuporanga: Tudo Sobre a Prova + Dicas de Preparação** 🆕
   - **Data publicação:** 17 de fevereiro de 2026
   - **Categoria:** Eventos
   - **Data da prova:** 15/03/2026
   - **Palavras-chave SEO:** run avoa 2026, run avoa votuporanga, corrida votuporanga
   - **Imagem:** `cabecalho-run-avoa-2026.jpg`
   - **Estratégia:** SEO local para capturar buscas antes/durante/depois da prova
   - **Conteúdo:** Informações da prova, Parque da Cultura como ponto central, dicas de preparação
   
2. **Como Começar a Correr do Zero - Guia Completo para Iniciantes**
   - **Categoria:** Iniciantes
   - **Imagem:** `cabecalho-correr-do-zero.jpg`
   - **Conteúdo:** Guia completo para quem nunca correu

3. **Plano de Treino 5km em 8 Semanas (Iniciantes)**
   - **Categoria:** Treinos
   - **Imagem:** `cabecalho-plano-treino-5km.jpg`
   - **Conteúdo:** Progressão segura e estruturada

4. **10 Erros Comuns de Iniciantes na Corrida (e Como Evitá-los)**
   - **Categoria:** Dicas
   - **Imagem:** `cabecalho-10-erros-comuns.jpg`
   - **Conteúdo:** Como evitar lesões e erros comuns

#### **Melhorias Recentes (17/02/2026):**
- ✅ **Botão CTA otimizado:** "Falar com a Karina no WhatsApp" 
  - Fundo: branco (#ffffff)
  - Texto: laranja forte (#ff6b35)
  - Font-weight: 800 (extra bold)
  - Hover: inverte cores (fundo laranja, texto branco)
- ✅ **Imagens profissionais:** Todos os cards do blog com fotos personalizadas
- ✅ **Footer completo:** Adicionado em todos os 4 artigos (antes só tinha "Voltar ao Blog")
- ✅ **SEO local:** Estratégia de conteúdo sobre eventos regionais implementada

**Design:** Cores laranjas (#ff6b35, #f7931e) - identidade visual
**SEO:** Schema Markup, meta tags, alt text otimizado
**Navegação:** Links funcionando corretamente com index.html explícito

---

## 🚀 OTIMIZAÇÕES DE PERFORMANCE

### **PageSpeed Insights: 81% → 90%+**

### **Implementadas:**
- ✅ **Cache de longa duração** (.htaccess) - economia 249 KiB
- ✅ **Service Worker** para cache estratégico
- ✅ **DNS prefetching** para domínios externos
- ✅ **Preload de recursos críticos** (CSS, JS, imagem hero)
- ✅ **JavaScript defer** loading
- ✅ **Fonts assíncronas** (Google Fonts)
- ✅ **Lazy loading** em imagens
- ✅ **Compressão GZIP** habilitada

### **Métricas-Chave:**
- **First Contentful Paint:** 2.6s → ~2.0s
- **Largest Contentful Paint:** 3.8s → ~2.8s  
- **Total Blocking Time:** 0ms (mantido)

---

## 🎨 DESIGN & UX

### **Cores Principais (IDENTIDADE VISUAL):**
- `--primary-black: #1a1a1a` (texto principal)
- `--primary-red: #ff4444` (CTAs principais)
- `--accent-orange: #ff6b35` (laranja principal - identidade)
- `--secondary-orange: #f7931e` (laranja gradiente)
- `--white: #ffffff` (backgrounds/texto claro)

**⚠️ IMPORTANTE:** Paleta de cores **LARANJA/CORAL** - NÃO usar roxo/azul!
- Blog usa gradientes laranjas: `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`
- Todos os links, CTAs e destaques devem ser em tons de laranja

### **Tipografia:**
- **Font:** Inter (Google Fonts)
- **Pesos:** 300, 400, 600, 700, 800

### **Responsividade:**
- **Mobile-first** design
- Breakpoints: 480px (mobile), 768px (tablet), 1200px+ (desktop)
- **Touch-friendly** (botões 44px+)

### **Elementos Interativos:**
- FAQ accordion
- Smooth scroll entre seções
- Hover effects nos botões
- WhatsApp button pulsante
- Formulário → WhatsApp integration

---

## 📱 CONVERSÃO & WHATSAPP

### **Número:** +55 17 99656-6908

### **Pontos de Conversão:**
1. **Hero CTA** - "Falar com a Karina no WhatsApp"
2. **Botão flutuante** - Sempre visível, canto inferior direito
3. **Formulário** - Coleta dados e redireciona com mensagem personalizada
4. **CTA final** - "Falar com a Karina agora"
5. **Footer** - Link direto para WhatsApp

### **Mensagem do Formulário:**
```
Olá, Karina! Meu nome é [NOME].

Vim pelo seu site e quero começar uma assessoria de corrida.

📌 Meu objetivo: [OBJETIVO SELECIONADO]
📊 Meu nível atual: [NÍVEL SELECIONADO]

Pode me explicar como funciona?
```

---

## 🔧 WORKFLOW DE DESENVOLVIMENTO

### **Git Commands Padrão:**
```bash
cd site-karina-franzin
git add .
git commit -m "descrição das mudanças"
git push
```

**⚠️ IMPORTANTE:** Apenas o desenvolvedor Igor realiza commits no repositório.

### **Deploy Automático:**
- GitHub Pages ativo
- Deploy automático a cada push na branch `main`
- Tempo de propagação: 5-10 minutos
- **Branch de trabalho atual:** `develop`

### **Testes Locais:**
```powershell
cd site-karina-franzin
Start-Process "index.html"  # Abre no navegador
```

---

## 📊 MÉTRICAS & MONITORAMENTO

### **Ferramentas de Análise:**
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** Para análise técnica detalhada
- **Google Analytics:** (a implementar se necessário)

### **KPIs Importantes:**
- Performance Score (meta: 90%+)
- Conversion rate (formulário → WhatsApp)
- Bounce rate
- Core Web Vitals (LCP, FID, CLS)

---

## 🛠️ FERRAMENTAS & TECNOLOGIAS

### **Stack Técnico:**
- **HTML5** semântico
- **CSS3** puro (sem frameworks)
- **JavaScript** vanilla (sem dependências)
- **Service Worker** para cache
- **GitHub Pages** para hospedagem

### **Editores Recomendados:**
- VS Code com extensões HTML/CSS/JS
- Live Server para desenvolvimento local

### **Browsers Testados:**
- Chrome/Edge (principais)
- Firefox
- Safari (iOS)
- Mobile browsers

---

## 🚨 PROBLEMAS CONHECIDOS & SOLUÇÕES

### **Lazy Loading Issues:**
- ❌ **Problema:** CSS `loading="lazy"` muito agressivo quebrava imagens
- ✅ **Solução:** Usar apenas JavaScript lazy loading básico

### **Background-attachment fixed:**
- ❌ **Problema:** Causa problemas de performance mobile
- ✅ **Solução:** Usar `background-attachment: scroll`

### **Service Worker Cache:**
- ⚠️ **Cuidado:** Pode cachear recursos excessivamente
- ✅ **Solução:** Cache strategy bem definida (cache-first para assets, network-first para HTML)

### **Navegação Local vs Online:**
- ❌ **Problema:** Links com `./pasta/` abrem índice de diretório em ambiente local
- ✅ **Solução:** Sempre usar `./pasta/index.html` explicitamente em todos os links
- **Exemplos corrigidos:**
  - `href="./blog/"` → `href="./blog/index.html"`
  - `href="../../"` → `href="../../index.html"`

### **Cloudflare DNS:**
- ❌ **Problema:** GitHub Pages travado em "DNS Check in Progress"
- ✅ **Solução:** 
  1. Cloudflare SSL/TLS em modo "Full" (não Flexible, não Full Strict)
  2. Remover e re-adicionar domínio no GitHub Pages
  3. Aguardar propagação (5-15 min)

---

## 🔍 SEO & GOOGLE

### **Google Search Console:**
- ✅ **Configurado:** Propriedade tipo "Domínio" (karinafranzin.com.br)
- ✅ **Sitemap enviado:** https://karinafranzin.com.br/sitemap.xml
- ✅ **Indexação solicitada:** Homepage + artigos do blog
- ⏳ **Aguardando:** Primeiras métricas (7-14 dias)

### **Schema Markup Implementado:**
- ✅ **ProfessionalService** - Dados da assessoria
- ✅ **Person** - Perfil da Karina (credenciais, prêmios)
- ✅ **WebSite** - Informações do site
- ✅ **WebPage** - Página principal
- ✅ **FAQPage** - Perguntas frequentes
- ✅ **Article** - Artigos do blog (JSON-LD em cada post)

### **Meta Tags Otimizadas:**
- ✅ Title, Description, Keywords
- ✅ Open Graph (Facebook/LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Alt text em todas as imagens

### **Palavras-chave Foco:**
- Assessoria de corrida
- Treinamento de corrida personalizado
- Planilha de corrida
- Personal trainer corrida
- Como começar a correr
- Plano de treino 5km, 10km, meia maratona

### **Sitemap.xml Atualizado:**
```xml
- Homepage (priority 1.0)
- Blog index (priority 0.9)
- Artigo 1 (priority 0.8)
- Artigo 2 (priority 0.8)
- Artigo 3 (priority 0.8)
- Seções (#performance, #como-funciona, #sobre)
```

### **Robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://karinafranzin.com.br/sitemap.xml
Disallow: /assets/icons/
Disallow: /*.js$
Disallow: /*.css$
```

---

## 📝 PRÓXIMOS PASSOS SUGERIDOS

### **Curto Prazo:**
- [x] ~~Implementar HTTPS~~ ✅ Feito (Cloudflare + GitHub Pages)
- [x] ~~Configurar domínio próprio~~ ✅ karinafranzin.com.br
- [x] ~~Google Search Console~~ ✅ Configurado e sitemap enviado
- [x] ~~Adicionar schema markup (SEO)~~ ✅ JSON-LD implementado
- [x] ~~Criar blog com conteúdo~~ ✅ 4 artigos publicados
- [x] ~~Implementar Google Analytics~~ ✅ GA4 configurado (ID: G-J488T0R72B) - 18/02/2026
- [x] ~~Rastreamento de conversões (cliques WhatsApp)~~ ✅ Eventos GA4 implementados - 18/02/2026
- [x] ~~Rastreamento de engajamento (Instagram e Strava)~~ ✅ Eventos GA4 implementados - 18/02/2026
- [x] ~~Página da 2ª Cãominhada 2026~~ ✅ Publicada em https://karinafranzin.com.br/cao-minhada-2026/
- [ ] **Implementar Cloudflare Workers para SEO dinâmico** (planejado - ver seção abaixo)
- [ ] Adicionar testimoniais reais de clientes
- [ ] Otimizar imagens para formato WebP/AVIF
- [ ] Substituir imagens placeholder do blog
- [ ] Criar mais 3-5 artigos para o blog
- [ ] Configurar metas no Google Analytics

### **Médio Prazo:**
- [x] ~~Blog de conteúdo sobre corrida~~ ✅ Blog funcional com 4 artigos
- [ ] Formulário de contato/avaliação
- [ ] FAQ (Perguntas Frequentes)
- [ ] Sistema de agendamento online
- [ ] Chat bot no WhatsApp
- [ ] Newsletter signup
- [ ] Página de casos de sucesso/transformações

### **Longo Prazo:**
- [ ] App mobile para alunos
- [ ] Portal do aluno (área logada)
- [ ] E-commerce para produtos digitais (e-books, planilhas)
- [ ] Integração com Strava
- [ ] Sistema de pagamento online
- [ ] Calculadora de pace/ritmo

---

## 💡 DICAS PARA NOVA IA

### **Comandos Essenciais:**
1. `open_files` para ver código atual
2. `powershell` para comandos Git
3. `find_and_replace_code` para edições
4. `create_file` para novos arquivos

### **⚠️ REGRAS CRÍTICAS:**

#### **1. NÃO PUBLICAR SEM AUTORIZAÇÃO:**
- **NUNCA** fazer `git push` sem o cliente solicitar
- Sempre perguntar antes: "Posso publicar online?"
- Cliente testa local primeiro, depois autoriza deploy

#### **2. Links e Navegação:**
- **SEMPRE** usar `index.html` explicitamente em links
- ❌ ERRADO: `href="./blog/"`
- ✅ CORRETO: `href="./blog/index.html"`
- Isso evita erro de "índice de diretório" em ambiente local

#### **3. Cores (IDENTIDADE VISUAL):**
- **OBRIGATÓRIO:** Usar tons de **LARANJA/CORAL**
- Cores principais: `#ff6b35` e `#f7931e`
- ❌ **NUNCA** usar roxo, azul ou outras cores
- Gradientes: `linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)`

#### **4. Cloudflare + GitHub Pages:**
- SSL/TLS: Modo **"Full"** (não Flexible, não Full Strict)
- Sempre limpar cache do Cloudflare após mudanças
- Propagação: aguardar 5-15 minutos

### **Sempre Verificar:**
- Responsividade mobile
- Performance (PageSpeed)
- Links do WhatsApp funcionando
- Imagens carregando corretamente
- **Todos os links com index.html**
- **Cores laranjas (não roxo!)**

### **Backup Disponível:**
- Pasta `backup/` contém versão funcional
- Use se algo quebrar irreversivelmente

### **Personalização Cliente:**
- Karina é muito técnica e focada em resultados
- Gosta de dados e métricas concretas
- Público-alvo valoriza profissionalismo e autoridade
- Conversão é prioridade #1
- **Testa local antes de aprovar deploy**

---

## 📞 CONTATOS IMPORTANTES

- **Cliente:** Karina Franzin
- **WhatsApp:** +55 17 99656-6908
- **Instagram:** @karina_franzin
- **Strava:** /athletes/158868084

---

---

## 📚 DOCUMENTAÇÃO ADICIONAL

### **Arquivos de Referência:**
- `GOOGLE-SEARCH-CONSOLE-TUTORIAL.md` - Tutorial completo do Google Search Console
- `GUIA-METRICAS-SEO.md` - Como interpretar métricas de SEO
- `SEO-CHECKLIST-ACOMPANHAMENTO.md` - Checklist e rotina de acompanhamento
- `CLOUDFLARE-SETUP.md` - Configuração do Cloudflare
- `DEPLOY-GITHUB.md` - Deploy no GitHub Pages
- `GIT-COMANDOS.md` - Comandos Git essenciais

### **Assets Importantes:**
- **Logo:** `assets/img/logo.jpg` (fundo preto - usar com padding branco)
- **Placeholder:** `assets/img/placeholder.jpg` (cards do blog)
- **WhatsApp Icon:** `assets/icons/WhatsApp.svg.webp`

---

**Data da Última Atualização:** 03 de Março de 2026  
**Versão do Projeto:** v4.4 (Site + Blog + CMS + Navbar Global + Página de Eventos)  
**Status:** ✅ Produção - Site 100% funcional com todas as otimizações SEO e Performance implementadas  
**URL:** https://karinafranzin.com.br  
**HTTPS:** ✅ Ativo (Cloudflare SSL Full)  
**Branch Atual:** develop (commits realizados apenas pelo desenvolvedor Igor)

---

## 📋 CHANGELOG - 17/02/2026 (v3.1)

### ✅ **Novo Artigo Publicado:**
- RUN AVOA 2026 Votuporanga: Tudo Sobre a Prova + Dicas de Preparação
- Estratégia de SEO local implementada para eventos regionais
- Data da prova: 15/03/2026
- Parque da Cultura como ponto central (largada e chegada)

### ✅ **Melhorias no Blog:**
- Botão CTA "Falar com a Karina no WhatsApp" otimizado (branco + texto laranja bold)
- Todas as 4 imagens dos cards do blog substituídas por fotos profissionais personalizadas
- Footer completo adicionado em todos os artigos (Blog, Instagram, Strava, WhatsApp)

### ✅ **Imagens Adicionadas:**
- `cabecalho-run-avoa-2026.jpg`
- `cabecalho-correr-do-zero.jpg`
- `cabecalho-plano-treino-5km.jpg`
- `cabecalho-10-erros-comuns.jpg`

### ⚠️ **Pendente:**
- [ ] Atualizar sitemap.xml com novo artigo RUN AVOA 2026
- [ ] Solicitar indexação no Google Search Console do novo artigo

---

## 📋 CHANGELOG - 18/02/2026 (v4.0) 🎉 ATUALIZAÇÃO MAJOR

### ✅ **CARROSSEL DE FEEDBACKS IMPLEMENTADO:**

**Funcionalidades:**
- [x] Carrossel com 10 imagens de feedbacks reais dos alunos
- [x] Layout responsivo:
  - Desktop: 3 feedbacks lado a lado
  - Tablet: 2 feedbacks lado a lado
  - Mobile: 1 feedback por vez
- [x] Navegação cíclica infinita (última → primeira, primeira → última)
- [x] Dots dinâmicos criados automaticamente pelo JavaScript
- [x] Setas de navegação sempre ativas
- [x] Suporte a swipe/touch para mobile
- [x] Lightbox para ampliar feedbacks ao clicar
  - Facilita leitura dos textos
  - Overlay escuro (95% preto)
  - Múltiplas formas de fechar (X, clique fora, ESC)
  - Animações suaves de zoom

**Correções de Navegação:**
- [x] Correção de bug: carrossel não carregava ao voltar do blog
- [x] Implementado evento `visibilitychange` para reinicialização
- [x] Suporte a navegação back/forward do navegador
- [x] Função `initFeedbackCarousel()` com destruição de instância anterior

**Arquivos:**
- `site-karina-franzin/assets/img/feedbacks/` - 10 imagens (1.jpg até 10.jpg)
- Código no `main.js` e `styles.css`

---

### ✅ **URLS LIMPAS - PROBLEMA RESOLVIDO:**

**Problema:** URLs mostravam `/index.html` ao navegar (ex: `karinafranzin.com.br/index.html`)

**Solução implementada:**
- [x] Corrigidos **19 links** em 6 arquivos:
  - `site-karina-franzin/index.html` - Link do footer para blog
  - `site-karina-franzin/blog/index.html` - Links "Voltar" e artigos
  - 4 artigos individuais - Breadcrumb, navegação e footer

**Resultados:**
- ✅ Site principal: `karinafranzin.com.br` (sem /index.html)
- ✅ Blog: `karinafranzin.com.br/blog/` (sem /index.html)
- ✅ Artigos: `karinafranzin.com.br/blog/nome-artigo/` (sem /index.html)

**Benefícios:**
- URLs mais profissionais e limpas
- Melhor SEO (URLs canônicas corretas)
- Melhor UX (aparência mais limpa)
- Links mais bonitos para compartilhamento

---

### ✅ **SISTEMA DE GERAÇÃO DE ARTIGOS MARKDOWN → HTML:**

**Contexto:**
- NetlifyCMS **REMOVIDO** - Conflitava com Cloudflare
- Solução 100% local sem dependências externas

**Sistema Implementado:**

**1. Script PowerShell:** `gerar-artigo.ps1`
- Converte Markdown → HTML automaticamente
- Usa template completo com layout correto
- Adiciona meta tags SEO automaticamente
- Calcula tempo de leitura
- Gera breadcrumb, categoria, data
- Inclui CTA do WhatsApp
- Footer completo com ícones sociais

**2. Template HTML:** `template-artigo.html`
- Copiado de artigo existente (layout 100% igual)
- Placeholders para todos os campos
- Header com breadcrumb
- Meta tags (título, descrição, keywords)
- Categoria em laranja
- Informações do artigo (data, tempo, autor)
- CTA laranja "Falar com a Karina no WhatsApp"
- Footer com ícones (Blog, Instagram, Strava, WhatsApp)
- Todos os SVGs corretos

**3. Estrutura de Pastas:**
```
site-karina-franzin/
├── gerar-artigo.ps1           → Script conversor
├── template-artigo.html       → Template HTML
├── artigos-rascunhos/         → Rascunhos em Markdown
│   └── exemplo-artigo.md      → Exemplo
├── GUIA-ESCREVER-ARTIGOS.md   → Guia para Karina
└── COMO-ADICIONAR-CARD-BLOG.md → Como adicionar card no blog
```

**Como Usar:**

**Karina escreve (em Markdown):**
```markdown
---
titulo: 5 Dicas Para Correr Seu Primeiro 10km
slug: dicas-correr-primeiro-10km
descricao: Descubra as 5 dicas essenciais para completar sua primeira corrida de 10km
imagem: cabecalho-10km-iniciantes.jpg
categoria: Iniciantes
keywords: corrida 10km, primeira corrida 10km
data: 2026-02-18
autor: Karina Franzin
---

# 5 Dicas Para Correr Seu Primeiro 10km

Completar sua primeira corrida de 10km é um marco incrível...

## 1. Siga um Plano de Treino Estruturado

Não improvise! Um plano de treino adequado...
```

**Você executa:**
```powershell
.\gerar-artigo.ps1 -ArquivoMarkdown "artigos-rascunhos\nome-artigo.md"
```

**Resultado:**
- ✅ HTML gerado em `blog/slug-do-artigo/index.html`
- ✅ Layout perfeito (igual aos artigos existentes)
- ✅ Meta tags completas
- ✅ CTA do WhatsApp
- ✅ Footer com ícones

**Documentação Criada:**
- `GUIA-ESCREVER-ARTIGOS.md` - Tutorial completo para Karina
- `COMO-ADICIONAR-CARD-BLOG.md` - Como adicionar card no blog/index.html

**Vantagens:**
- ✅ 100% compatível com Cloudflare + GitHub Pages
- ✅ Zero conflitos ou dependências externas
- ✅ Karina escreve em Markdown (simples como WhatsApp)
- ✅ Geração automática de HTML completo
- ✅ Layout garantidamente correto
- ✅ Gratuito e offline

---

### ✅ **ARQUIVOS E CONFIGURAÇÕES IMPORTANTES:**

**Hosting & Deploy:**
- **Hosting:** GitHub Pages (gratuito)
- **Domínio:** karinafranzin.com.br (Cloudflare)
- **DNS:** Configurado no Cloudflare
- **SSL:** Full (Cloudflare)
- **Deploy:** Automático via push para branch `main`

**Repositório Git:**
- **URL:** https://github.com/igorgr77-lang/site-karina-franzin
- **Branch principal:** `main`
- **GitHub Pages:** Ativo

**Estrutura de Pastas Atualizada:**
```
site-karina-franzin/
├── index.html                  → Página principal
├── gerar-artigo.ps1           → Script gerador de artigos
├── template-artigo.html       → Template para artigos
├── artigos-rascunhos/         → Rascunhos Markdown
├── assets/
│   ├── img/
│   │   ├── feedbacks/         → 10 imagens de feedbacks
│   │   ├── karina-hero.jpg
│   │   ├── karina-profile.jpg
│   │   ├── logo.jpg
│   │   ├── cabecalho-*.jpg    → Imagens dos artigos
│   └── icons/
│       └── WhatsApp.svg.webp
├── blog/
│   ├── index.html             → Índice do blog
│   ├── como-comecar-a-correr-do-zero/
│   ├── erros-comuns-corrida-iniciantes/
│   ├── plano-de-treino-5km-para-iniciantes/
│   └── run-avoa-2026-votuporanga/
├── css/
│   ├── styles.css             → CSS principal + carrossel
│   └── blog.css
├── js/
│   └── main.js                → JS principal + carrossel + lightbox
└── [documentação]
    ├── GUIA-ESCREVER-ARTIGOS.md
    ├── COMO-ADICIONAR-CARD-BLOG.md
    ├── GOOGLE-SEARCH-CONSOLE-TUTORIAL.md
    ├── GUIA-METRICAS-SEO.md
    └── [outros guias...]
```

---

### 🎯 **PRÓXIMAS AÇÕES RECOMENDADAS:**

**Curto Prazo (Semana):**
- [ ] Karina testar sistema de geração de artigos
- [ ] Publicar novo artigo real usando o script
- [ ] Atualizar sitemap.xml com todos os artigos
- [ ] Solicitar indexação no Google Search Console

**Médio Prazo (Mês):**
- [ ] Estabelecer rotina semanal de publicação
- [ ] Coletar mais feedbacks dos alunos
- [ ] Adicionar Google Analytics
- [ ] Monitorar métricas de SEO

**Longo Prazo (3-6 meses):**
- [ ] Avaliar criação de newsletter
- [ ] Considerar expansão do blog (mais categorias)
- [ ] Avaliar integração com redes sociais
- [ ] Analisar conversões (cliques no WhatsApp)

---

### 🐛 **BUGS CORRIGIDOS:**

1. ✅ **Carrossel não carregava ao voltar do blog**
   - Problema: JavaScript não reinicializava na navegação back/forward
   - Solução: Evento `visibilitychange` + função de reinicialização

2. ✅ **URLs com /index.html aparecendo**
   - Problema: Links relativos apontando para arquivos .html
   - Solução: Todos os links convertidos para URLs limpas (/, /blog/, etc.)

3. ✅ **Layout do artigo gerado diferente**
   - Problema: Template incompleto, faltava CTA e ícones
   - Solução: Template copiado de artigo existente com todos os elementos

---

### 📞 **INFORMAÇÕES TÉCNICAS:**

**Tecnologias Usadas:**
- HTML5, CSS3, JavaScript (Vanilla)
- PowerShell (script de geração)
- Markdown (escrita de artigos)
- Git/GitHub (versionamento e deploy)
- Cloudflare (DNS e SSL)
- GitHub Pages (hosting)

**Compatibilidade:**
- ✅ Desktop (Chrome, Firefox, Edge, Safari)
- ✅ Tablet (iPad, Android)
- ✅ Mobile (iOS, Android)
- ✅ Navegadores modernos (últimas 2 versões)

**Performance:**
- Lazy loading de imagens
- CSS e JS minificados
- Imagens otimizadas
- Service Worker (PWA básico)

---

**🎉 PROJETO ATUALIZADO E TOTALMENTE FUNCIONAL! 🎉**

---

## 📊 GOOGLE ANALYTICS 4 - IMPLEMENTADO E OTIMIZADO

**Data de Implementação:** 18/02/2026  
**ID de Medição:** `G-J488T0R72B`  
**Status:** ✅ **TOTALMENTE FUNCIONAL**

---

### ✅ Analytics Básico - ATIVO em todas as páginas

O Google Analytics 4 foi implementado com sucesso em **6 páginas**:
1. ✅ Página principal (`/index.html`)
2. ✅ Blog - Lista de artigos (`/blog/index.html`)
3. ✅ Artigo: Como Começar a Correr do Zero
4. ✅ Artigo: 10 Erros Comuns de Iniciantes
5. ✅ Artigo: Plano de Treino 5km
6. ✅ Artigo: RUN AVOA 2026 Votuporanga

### 📈 Métricas Básicas Rastreadas:
- ✅ Visitantes únicos e recorrentes
- ✅ Páginas mais visualizadas
- ✅ Origem do tráfego (Google, redes sociais, direto)
- ✅ Dispositivos (mobile/desktop)
- ✅ Localização geográfica
- ✅ Tempo de permanência
- ✅ Taxa de rejeição

---

### 🎯 EVENTOS PERSONALIZADOS - RASTREAMENTO DE CONVERSÕES E ENGAJAMENTO

**Código:** `site-karina-franzin/js/main.js`

---

#### ✅ **1. Cliques no WhatsApp** - ATIVO (Implementado 18/02/2026)

O site rastreia **automaticamente** todos os cliques nos botões do WhatsApp!

**Função:** `trackWhatsAppClicks()`  
**Evento:** `click_whatsapp`

**O que é rastreado:**
- 📍 **Localização do botão:** De onde o usuário clicou
  - `botao_flutuante` - Botão fixo no canto inferior direito
  - `secao_hero` - Botão na seção principal (topo da página)
  - `secao_depoimentos` - Botão na área de feedbacks
  - `cta_blog` - Chamada para ação na página do blog
  - `cta_artigo` - CTA dentro dos artigos
  - `footer_artigo` - Footer dos artigos
  - `outro` - Outros locais
  
- 📄 **Página atual:** URL da página onde ocorreu o clique
- 🔤 **Texto do botão:** Conteúdo do link clicado
- 💰 **Valor de conversão:** Cada clique = 1 ponto

**Benefícios:**
- 📊 Medir taxa de conversão (visitantes → leads)
- 🎯 Identificar quais botões convertem mais
- 📝 Descobrir quais artigos geram mais contatos
- ⏰ Ver horários de pico de conversão

---

#### ✅ **2. Cliques no Instagram** - ATIVO (Implementado 18/02/2026)

Rastreia cliques no perfil @karina_franzin no rodapé do site.

**Função:** `trackSocialMediaClicks()`  
**Evento:** `click_instagram`

**O que é rastreado:**
- 📍 **Localização:** `footer` (rodapé)
- 📄 **Página atual:** De qual página veio o clique
- 🔗 **Rede social:** `instagram`
- 💰 **Valor:** Cada clique = 1 ponto

**Benefícios:**
- 📊 Medir interesse em seguir nas redes sociais
- 📄 Identificar quais páginas geram mais seguidores
- 📈 Acompanhar crescimento de engajamento social

---

#### ✅ **3. Cliques no Strava** - ATIVO (Implementado 18/02/2026)

Rastreia cliques no perfil do Strava no rodapé do site.

**Função:** `trackSocialMediaClicks()`  
**Evento:** `click_strava`

**O que é rastreado:**
- 📍 **Localização:** `footer` (rodapé)
- 📄 **Página atual:** De qual página veio o clique
- 🔗 **Rede social:** `strava`
- 💰 **Valor:** Cada clique = 1 ponto

**Benefícios:**
- 📊 Medir interesse em acompanhar treinos
- 🎯 Identificar visitantes mais engajados (runners)
- 📈 Potenciais alunos interessados em assessoria

---

### 📊 Como ver todos os eventos:

1. Google Analytics → "Relatórios" → "Engajamento" → "Eventos"
2. Você verá **3 eventos principais:**
   - `click_whatsapp` - **Conversões** (interesse em contratar)
   - `click_instagram` - **Engajamento social**
   - `click_strava` - **Interesse em acompanhar treinos**
3. Clique em cada um para analisar:
   - Total de cliques
   - Páginas que geram mais engajamento
   - Evolução temporal
   - Taxa de conversão

---

### 📋 Documentação Completa:
- **Guia Geral:** `site-karina-franzin/GOOGLE-ANALYTICS-GUIA.md`
- **Seção de Eventos Personalizados:** Inclui tutorial de teste e análise
- **Como testar:** Console do navegador + Tempo Real do Analytics

### 🎯 Como acessar:
https://analytics.google.com/

**Tempo Real:** Veja visitantes e eventos acontecendo AGORA  
**Relatórios Gerais:** Disponíveis após 24-48h  
**Relatórios de Eventos:** Dados disponíveis após alguns cliques

---

### 🚀 Commits Git:
- `6ffcfa7` - Implementa Google Analytics 4 em todas as páginas
- `d409279` - Adiciona rastreamento de cliques no WhatsApp via Google Analytics
- `e662b7e` - Adiciona rastreamento de cliques no Instagram e Strava via Google Analytics

---

## 📈 RESUMO DAS ÚLTIMAS ATUALIZAÇÕES (18/02/2026)

### ✅ O que foi implementado hoje:

1. **📊 Google Analytics 4 - Rastreamento Completo**
   - ID de medição: `G-J488T0R72B`
   - Implementado em todas as 6 páginas do site
   - Rastreamento de visitantes, origem, dispositivos, localização
   - Relatórios disponíveis em tempo real

2. **🎯 Rastreamento de Conversões e Engajamento - 3 Eventos Ativos**
   - **WhatsApp:** Rastreamento automático de todos os botões
     - Identificação da localização do clique (botão flutuante, hero, artigos, etc.)
     - Dados de página, texto do botão e valor de conversão
   - **Instagram:** Rastreamento de cliques no perfil @karina_franzin
     - Mede interesse em seguir nas redes sociais
   - **Strava:** Rastreamento de cliques no perfil do Strava
     - Identifica visitantes interessados em acompanhar treinos
   - Visualização no Analytics: Engajamento → Eventos → `click_whatsapp`, `click_instagram`, `click_strava`

3. **📚 Documentação Completa**
   - `GOOGLE-ANALYTICS-GUIA.md` - Guia completo de uso e análise
   - Tutorial de teste (Console + Tempo Real)
   - Exemplos de análise de conversão
   - Como tomar decisões baseadas em dados

### 💡 Benefícios Implementados:

- ✅ **Visibilidade total** do tráfego do site
- ✅ **Medição de conversão** (visitantes → cliques no WhatsApp)
- ✅ **Medição de engajamento social** (Instagram e Strava)
- ✅ **Identificação de conteúdo que converte**
- ✅ **Análise de comportamento do usuário**
- ✅ **Tomada de decisões baseada em dados**
- ✅ **ROI mensurável** do site e blog

### 📊 Próximas Análises Possíveis:

Com os dados coletados, você poderá:
- Calcular taxa de conversão do site
- Identificar artigos que geram mais leads
- Descobrir quais botões convertem melhor
- Otimizar horários de publicação de conteúdo
- Ajustar estratégia de conteúdo baseado no que funciona

### 🎯 Status do Projeto:

**Site:** ✅ 100% Funcional  
**Blog:** ✅ Sistema dinâmico 100% funcional + 4 artigos publicados  
**SEO:** ✅ Schema Markup JSON-LD completo + Canonical URLs + Sitemap atualizado  
**Analytics:** ✅ Completo com rastreamento de conversões  
**Performance:** ✅ Otimizada (PWA, lazy loading, cache)  
**Deploy:** ✅ Automatizado via GitHub Pages  
**Domínio:** ✅ karinafranzin.com.br (Cloudflare)  
**Carrossel:** ✅ 100% Funcional (Dots, Setas, Swipe/Touch Mobile, Lightbox, Imagens Completas)  
**Cãominhada 2026:** ✅ Página publicada em https://karinafranzin.com.br/cao-minhada-2026/  
**CMS/Painel Admin:** ✅ Sistema completo e funcional (CRUD + Upload + Publicação dinâmica)  
**Blog Dinâmico:** ✅ Artigos do Supabase renderizados automaticamente (sem editar HTML)

---

**🎉 SITE TOTALMENTE FUNCIONAL COM ANALYTICS COMPLETO! 🎉**

**Rastreamento Implementado:**
- ✅ Google Analytics 4 (visitantes, páginas, origem)
- ✅ Conversões (cliques no WhatsApp)
- ✅ Engajamento Social (Instagram e Strava)

**Última atualização:** 19/02/2026 às 22:45 (horário de Brasília)

---

## 📋 CHANGELOG - 19/02/2026 (v4.2) 🎉 MELHORIAS DE UX E PERFORMANCE

### ✅ **CARROSSEL DE FEEDBACKS - SWIPE/TOUCH PARA MOBILE:**

**Funcionalidades Implementadas:**
- [x] **Navegação por swipe/touch** em dispositivos móveis
  - Deslize o dedo horizontalmente nas imagens para navegar
  - Detecção inteligente de movimento (threshold de 50px)
  - Feedback visual durante o arraste
  
- [x] **Navegação por drag** em desktop
  - Clique e arraste as imagens com o mouse
  - Experiência similar ao mobile
  
- [x] **Lightbox otimizado**
  - Clique rápido abre a imagem expandida
  - Diferenciação inteligente entre clique e swipe
  - Tempo de detecção: <300ms = clique, >300ms = swipe
  - Movimento mínimo: <5px = clique, >5px = swipe
  - Múltiplas formas de fechar (X, ESC, clique fora)
  - Atributo `aria-hidden` dinâmico para acessibilidade
  
- [x] **Imagens completas (não cortadas)**
  - `object-fit: contain` (antes era `cover`)
  - Altura aumentada de 300px para 400px
  - Fundo cinza claro (#f0f0f0) em espaços vazios
  - Todas as imagens de feedbacks visíveis por completo

**Arquivos Modificados:**
- `site-karina-franzin/js/main.js` - Lógica de swipe/touch e lightbox
- `site-karina-franzin/css/styles.css` - Ajustes de layout das imagens
- `site-karina-franzin/index.html` - Atributos de otimização

**Benefícios UX:**
- ✅ Navegação mais intuitiva no mobile (swipe natural)
- ✅ Desktop pode arrastar como em galerias modernas
- ✅ Feedbacks legíveis em tela cheia (lightbox)
- ✅ Imagens completas sem cortar conteúdo importante
- ✅ Acessibilidade melhorada (aria-hidden)

---

### ✅ **OTIMIZAÇÃO PAGESPEED - ÍCONE WHATSAPP:**

**Problema Identificado:**
- ❌ Ícone WhatsApp: 78,9 KiB (960x962 pixels)
- ❌ Exibido em apenas 60x60 pixels
- ❌ PageSpeed Insights: "Economia estimada de 109 KiB"

**Solução Implementada:**
- [x] Redimensionamento usando Squoosh.app
  - Tamanho original: 960x962 (78,9 KiB)
  - Tamanho otimizado: 120x120 (4,95 KiB)
  - **Redução: 93,7%** (73,95 KiB economizados)
  
- [x] Configuração de compressão:
  - Formato: WebP
  - Quality: 85.4
  - Method: Lanczos3 (melhor qualidade)
  - Effort: 4
  
- [x] Atributos de otimização adicionados:
  - `loading="eager"` - Carrega imediatamente (botão importante)
  - `decoding="async"` - Decodificação assíncrona

**Arquivo Otimizado:**
- `site-karina-franzin/assets/icons/WhatsApp.svg.webp`

**Resultados:**
- ✅ Visual idêntico ao original (mantém fundo branco e círculo verde)
- ✅ Tamanho 93,7% menor
- ✅ Melhoria significativa no PageSpeed Insights
- ✅ Carregamento mais rápido da página

---

### ✅ **MELHORIAS DE PERFORMANCE IMPLEMENTADAS:**

**Favicons com caminhos relativos:**
- [x] Corrigidos caminhos de `/favicon.png` para `./favicon.png`
- [x] Elimina erros de CORS ao testar localmente
- [x] Funciona tanto offline quanto online

**Arquivos Afetados:**
- `site-karina-franzin/index.html` - Links de favicon, apple-touch-icon, manifest

---

### 🚀 **COMMITS GIT:**

**Commit 1:** `79d6d3a`
```
Implementa swipe touch no carrossel de feedbacks + lightbox ao clicar

- Adiciona funcionalidade de swipe/drag para navegação no carrossel (mobile e desktop)
- Implementa lightbox para expandir imagens dos feedbacks ao clicar
- Ajusta object-fit de cover para contain (mostra imagens completas sem cortar)
- Aumenta altura das imagens de feedbacks para 400px
- Corrige caminhos dos favicons para funcionar localmente
- Adiciona aria-hidden dinâmico no lightbox para acessibilidade
- Detecta diferença entre clique rápido (lightbox) e swipe (navegação)
```

**Commit 2:** `af20551`
```
Otimiza ícone WhatsApp para melhor performance

- Reduz tamanho do ícone WhatsApp de 78,9 KiB para 4,95 KiB (93,7% menor)
- Redimensiona imagem de 960x962 para 120x120 pixels
- Mantém qualidade visual e características originais
- Adiciona atributos loading e decoding para otimização
- Melhora pontuação no PageSpeed Insights
```

---

### 📊 **MÉTRICAS DE PERFORMANCE:**

**Antes das otimizações:**
- Ícone WhatsApp: 78,9 KiB
- Erro no PageSpeed: "Melhorar a entrega de imagens - Economia estimada de 109 KiB"

**Depois das otimizações:**
- Ícone WhatsApp: 4,95 KiB
- Economia total: ~74 KiB (93,7%)
- PageSpeed: Erro do WhatsApp eliminado ✅

**Próximas otimizações sugeridas:**
- [ ] Comprimir `karina-hero.jpg` (274,6 KiB → pode economizar ~30 KiB)
- [ ] Considerar conversão de imagens para WebP/AVIF
- [ ] Otimizar imagens de feedbacks se necessário

---

### 🎯 **EXPERIÊNCIA DO USUÁRIO MELHORADA:**

**Mobile:**
- ✅ Navegação intuitiva por swipe (como Instagram/Stories)
- ✅ Clique rápido abre imagem expandida
- ✅ Feedbacks legíveis em tela cheia
- ✅ Imagens completas sem cortes

**Desktop:**
- ✅ Navegação por drag (arrastar mouse)
- ✅ Clique abre lightbox
- ✅ Setas de navegação funcionando
- ✅ Dots indicadores clicáveis

**Acessibilidade:**
- ✅ Atributo `aria-hidden` dinâmico no lightbox
- ✅ Navegação por teclado (ESC fecha lightbox)
- ✅ Feedback visual durante interações

---

### 🛠️ **FERRAMENTAS UTILIZADAS:**

**Otimização de Imagens:**
- **Squoosh.app** (Google) - Redimensionamento e compressão
  - URL: https://squoosh.app
  - Configuração: Lanczos3, WebP, Quality 85.4
  - Resultado: Redução de 93,7% mantendo qualidade visual

**Testes de Performance:**
- **PageSpeed Insights** - Identificação de problemas
  - URL: https://pagespeed.web.dev/
  - Análise de imagens, cache, carregamento

---

### 📝 **PROCESSO DE OTIMIZAÇÃO MANUAL:**

**Workflow estabelecido para otimização de imagens:**

1. **Identificar problema** no PageSpeed Insights
2. **Abrir imagem** no Squoosh.app
3. **Configurar otimização:**
   - Resize: Tamanho apropriado (2x do uso real para retina)
   - Format: WebP (melhor compressão)
   - Quality: 80-85 (equilíbrio qualidade/tamanho)
   - Method: Lanczos3 (melhor qualidade)
4. **Baixar imagem otimizada**
5. **Substituir arquivo original**
6. **Testar visualmente** - Confirmar que mantém qualidade
7. **Commit e deploy**

**Cliente (Karina) agora sabe:**
- ✅ Como usar Squoosh.app
- ✅ Configurações ideais de otimização
- ✅ Como manter qualidade visual
- ✅ Workflow de otimização manual

---

### 🎉 **RESUMO DA VERSÃO v4.2:**

**Implementado:**
- ✅ Swipe/touch no carrossel (mobile e desktop)
- ✅ Lightbox com detecção inteligente de clique vs. swipe
- ✅ Imagens completas sem cortes (object-fit: contain)
- ✅ Ícone WhatsApp otimizado (93,7% menor)
- ✅ Favicons com caminhos relativos
- ✅ Acessibilidade melhorada (aria-hidden)

**Melhorias de Performance:**
- ✅ Redução de 74 KiB no carregamento da página
- ✅ PageSpeed Insights: Erro do WhatsApp eliminado
- ✅ Carregamento mais rápido em mobile

**Experiência do Usuário:**
- ✅ Navegação mais intuitiva e moderna
- ✅ Feedbacks legíveis em tela cheia
- ✅ Interações fluidas e responsivas

**Status Geral:**
- ✅ Site 100% funcional
- ✅ Performance otimizada
- ✅ SEO completo
- ✅ Analytics rastreando conversões
- ✅ Carrossel com todas as funcionalidades

---

## 🔮 MELHORIAS FUTURAS PLANEJADAS

### **SEO Dinâmico com Cloudflare Workers** (Planejado)

#### **🔴 Problema Identificado:**
Artigos do blog aparecem incorretamente nas pesquisas do Google:
- **Título exibido:** "Carregando... | Blog Karina Franzin"
- **Descrição exibida:** Fragmentos do template vazio
- **Causa:** Google indexa a página antes do JavaScript carregar dados do Supabase

**Exemplo real:**
- Busca: "karina franzin corrida de lourdes 2026"
- Google mostra: "Carregando..." ao invés do título real do artigo
- Ao clicar: Artigo abre corretamente (problema é só no preview do Google)

#### **✅ Solução: Cloudflare Workers com Pre-rendering**

**Conceito:**
- **Usuários normais** → Recebem site JavaScript normal (atual)
- **Bots (Google, Bing)** → Recebem HTML pré-renderizado com conteúdo completo

**Fluxo:**
```
Googlebot acessa artigo
    ↓
Cloudflare Worker detecta (User-Agent = bot)
    ↓
Worker renderiza página com Puppeteer/Chrome Headless
    ↓
JavaScript executa e carrega dados do Supabase
    ↓
HTML completo (título, descrição, conteúdo) enviado ao Google
    ↓
Google indexa corretamente! ✅
```

#### **💰 Custos:**
- **Cloudflare Workers (Free tier):**
  - ✅ 100.000 requisições/dia (grátis)
  - ✅ Suficiente para o projeto
  - 💵 Se ultrapassar: $5/mês para 10 milhões de requests

#### **✅ Vantagens:**
- ✅ **GitHub Pages continua** sendo a hospedagem
- ✅ **Git continua** funcionando igual (add, commit, push)
- ✅ **Cloudflare continua** com DNS + SSL
- ✅ **ZERO mudanças** no código do site
- ✅ **ZERO mudanças** no workflow de desenvolvimento
- ✅ `/admin` continua funcionando igual
- ✅ Supabase continua funcionando igual
- ✅ Deploy automático (`git push`) continua igual
- ✅ Branches (develop, main) continuam iguais
- ✅ **SEO 100% dinâmico** - cada artigo indexado corretamente

#### **🚫 O que NÃO muda:**
- Hospedagem continua no GitHub Pages
- Versionamento Git preservado
- Workflow de commits/push não muda
- Estrutura de arquivos não muda
- Código do site não muda
- Admin não muda
- Supabase não muda

#### **🔧 Implementação Planejada:**

**Arquivos a criar:**
```
site-karina-franzin/
└── cloudflare/
    ├── worker.js           ← Código do Worker (detecção de bots + rendering)
    ├── wrangler.toml       ← Configuração do Cloudflare
    └── README.md           ← Instruções de deploy
```

**Passos:**
1. Criar Cloudflare Worker com detecção de User-Agent (Googlebot, Bingbot, etc)
2. Integrar biblioteca de pre-rendering (Puppeteer Cloudflare)
3. Configurar rotas para artigos do blog (`/blog/artigo.html?slug=*`)
4. Testar com Google Search Console
5. Deploy no Cloudflare (não afeta GitHub Pages)

**Workflow final:**
```bash
# Desenvolvedor continua fazendo:
git add .
git commit -m "feat: novo artigo"
git push origin main

# GitHub Pages faz deploy automático (como sempre)
# Cloudflare Worker intercepta bots automaticamente (transparente)
# Usuários normais continuam vendo site normal (como sempre)
```

#### **📊 Resultado Esperado:**

**Antes (atual):**
```
Google Search:
[Carregando... | Blog Karina Franzin]
Desculpe, não conseguimos encontrar este artigo. ← Voltar para...
```

**Depois (com Worker):**
```
Google Search:
[Run Avoa 2026: Tudo sobre a corrida | Blog Karina Franzin]
Participe da Run Avoa 2026 em Votuporanga! Conheça o percurso,
inscrições, dicas de treino e como se preparar para esta corrida...
```

#### **⏱️ Estimativa:**
- Implementação: 2-3 horas
- Testes: 1 hora
- Deploy e configuração: 30 minutos
- **Total:** ~4 horas de trabalho

#### **🎯 Status:**
- ⏳ **Planejado** (não iniciado)
- Aguardando decisão do desenvolvedor Igor
- Documentação completa criada para implementação futura

---

## 📊 HISTÓRICO DETALHADO DE ALTERAÇÕES

### **01/03/2026 - Sessão 1 - Atualização de Contexto:**
**Status do Projeto:**
- ✅ Site principal 100% funcional em https://karinafranzin.com.br
- ✅ Página da 2ª Cãominhada 2026 no ar: https://karinafranzin.com.br/cao-minhada-2026/
- ✅ Blog com 4 artigos publicados
- ✅ **Sistema de CMS 100% FUNCIONAL** (Supabase + Painel Admin + Frontend Dinâmico)
- ✅ **FASE 3 CONCLUÍDA:** Blog totalmente dinâmico - artigos criados no `/admin` aparecem automaticamente
- ✅ Google Analytics 4 rastreando conversões e engajamento
- ✅ SEO otimizado com Schema Markup JSON-LD
- ✅ Working tree limpo na branch `develop`
- ⚠️ Commits realizados exclusivamente pelo desenvolvedor Igor

### **01/03/2026 - Sessão 2 - CTA Cãominhada nos Artigos:**
**Implementação:**
- ✅ Adicionado card promocional da 2ª Cãominhada nos artigos do blog
- ✅ Posicionamento: Entre CTA do WhatsApp e rodapé do artigo
- ✅ Design: Card verde (#4CAF50) com badge "🐕 EVENTO ESPECIAL"
- ✅ Texto final: "Passos que alimentam, patinhas que agradecem! / Uma experiência inesquecível com seu melhor amigo!"
- ✅ Link: https://karinafranzin.com.br/cao-minhada-2026/
- ✅ Google Analytics: Evento `click_caominhada_cta` (category: blog)
- ✅ Responsivo para mobile

**Arquivos Modificados:**
- `blog/artigo.html` - Adicionado HTML do card da Cãominhada
- `css/blog.css` - Adicionado CSS `.event-cta` e `.event-box` com responsividade

**Workflow:**
- Commits feitos na branch `develop`
- Merge de `develop` para `main` realizado
- Retorno para `develop` para continuar desenvolvimento

---

### **01/03/2026 - Sessão 3 - Ícone Treinus no Rodapé:**
**Implementação:**
- ✅ Adicionado ícone do Treinus no rodapé do site (2 páginas)
- ✅ Páginas modificadas:
  - `index.html` (página principal)
  - `blog/artigo.html` (página de artigos)
- ✅ Ordem dos ícones: Blog → Instagram → Strava → WhatsApp → **Treinus**
- ✅ Logo: `treinus.png` (versão sem fundo otimizada - logo_sem_fundo_6.png)
- ✅ Link: https://karinafranzin.treinus.com.br/
- ✅ Efeito hover: Branco → Laranja (igual aos outros ícones)
- ✅ Google Analytics: Evento `click_treinus` (category: footer / footer_blog)

**Arquivos Modificados:**
- `index.html` - Adicionado link do Treinus no rodapé
- `blog/artigo.html` - Adicionado link do Treinus no rodapé
- `css/styles.css` - Adicionado CSS `.treinus-icon` e `.treinus-link` com filtro de cor
- `assets/icons/treinus.png` - Novo ícone adicionado

**Detalhes Técnicos:**
- Imagem PNG com fundo transparente
- Filtro CSS para mudança de cor: `brightness(0) invert(1)` (branco)
- Hover: Filtro complexo para transformar em laranja (#FF6B35)
- Transição suave com `transition: var(--transition)`

**Workflow:**
- Commits feitos na branch `develop`
- Merge de `develop` para `main` realizado
- **Deploy concluído:** Mudanças online em produção
- Retorno para `develop` para continuar desenvolvimento

**🎯 Sistema de Publicação Dinâmica:**
1. Admin acessa `/admin/login.html`
2. Cria novo artigo no `/admin/editor.html`
3. Faz upload de imagens (Supabase Storage)
4. Publica artigo (checkbox "Publicado")
5. **Artigo aparece automaticamente em `/blog/`** (sem mexer em HTML)
6. URL individual gerada: `/blog/artigo.html?slug=nome-do-artigo`
7. Meta tags, Open Graph e SEO aplicados dinamicamente

**Arquivos do Sistema Dinâmico:**
- `blog/index.html` - Lista dinâmica de artigos (template HTML)
- `blog/artigo.html` - Página individual dinâmica (template único para todos os artigos)
- `js/blog-list.js` - Carrega artigos do Supabase
- `js/blog-article.js` - Renderiza artigo individual com SEO
- `js/utils.js` - Funções auxiliares (tempo de leitura, formatação)

---

## 🔧 COMO FUNCIONA O SISTEMA DE URL DINÂMICA (Solução do Erro 404)

### **🔴 Problema Original:**
Ao criar artigos pelo `/admin`, tentávamos acessar URLs como:
```
https://karinafranzin.com.br/blog/como-comecar-a-correr/
```
Mas o GitHub Pages retornava **404 (página não encontrada)** porque esse arquivo HTML não existia fisicamente no repositório.

### **✅ Solução Implementada: Template Único com Query String**

**Conceito:** Ao invés de criar um arquivo HTML para cada artigo, usamos **1 único arquivo template** (`blog/artigo.html`) que carrega dinamicamente o conteúdo do Supabase.

### **Fluxo Completo:**

**1. Criação do Artigo no Admin:**
- Usuário cria artigo com título: "Como Começar a Correr do Zero"
- Sistema gera slug automaticamente: `como-comecar-a-correr-do-zero`
- Artigo é salvo no Supabase com todos os metadados

**2. URL Dinâmica Gerada:**
```
https://karinafranzin.com.br/blog/artigo.html?slug=como-comecar-a-correr-do-zero
```
- `blog/artigo.html` → Arquivo físico único (existe no repositório)
- `?slug=como-comecar-a-correr-do-zero` → Parâmetro (não é arquivo/pasta)

**3. JavaScript Carrega o Conteúdo:**
```javascript
// blog-article.js (simplificado)
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug'); // Pega 'como-comecar-a-correr-do-zero'

// Busca artigo no Supabase
const { data, error } = await supabase
  .from('artigos')
  .select('*')
  .eq('slug', slug)
  .eq('publicado', true)
  .single();

// Preenche o template HTML
document.getElementById('articleTitle').textContent = data.titulo;
document.getElementById('articleContent').innerHTML = data.conteudo;
document.getElementById('articleImage').src = data.imagem_destaque;
// ... meta tags, Open Graph, Schema Markup dinâmicos
```

**4. Template HTML (blog/artigo.html):**
```html
<article>
  <h1 id="articleTitle"></h1>
  <img id="articleImage" alt="">
  <div id="articleMeta"></div>
  <div id="articleContent"></div>
</article>
```

### **🎯 Vantagens desta Solução:**

✅ **Sem Erro 404:** O arquivo `artigo.html` sempre existe  
✅ **Sem Commits:** Criar artigo não requer push no Git  
✅ **Instantâneo:** Artigo publicado aparece imediatamente  
✅ **SEO Preservado:** Meta tags e Schema Markup dinâmicos  
✅ **Layout Consistente:** Todos os artigos usam o mesmo template  
✅ **Escalável:** Suporta milhares de artigos sem criar arquivos  

### **📂 Estrutura Final:**

```
site-karina-franzin/
├── blog/
│   ├── index.html           ← Lista de artigos (dinâmica)
│   └── artigo.html          ← Template único (dinâmico)
│
├── js/
│   ├── blog-list.js         ← Carrega lista do Supabase
│   ├── blog-article.js      ← Carrega artigo individual
│   └── utils.js             ← Funções auxiliares
│
└── admin/
    ├── editor.html          ← CRUD de artigos
    └── ...
```

### **🔗 Exemplos de URLs Reais:**

```
Lista:    https://karinafranzin.com.br/blog/
Artigo 1: https://karinafranzin.com.br/blog/artigo.html?slug=como-comecar-a-correr-do-zero
Artigo 2: https://karinafranzin.com.br/blog/artigo.html?slug=plano-treino-5km
Artigo 3: https://karinafranzin.com.br/blog/artigo.html?slug=erros-comuns-corrida
```

**Todos usam o mesmo `artigo.html`, mas exibem conteúdo diferente!**

**Último Commit:**
- `7e00e5d feat: adiciona página da 2ª Cãominhada 2026`

---

### **18/02/2026 - Sessão 2 (19h00):**
**Carrossel de Feedbacks - Correção Completa:**
- ✅ Identificado e corrigido problema de codificação (emojis causavam "Script error")
- ✅ Reescrito código JavaScript sem caracteres especiais
- ✅ Carrossel 100% funcional: dots, navegação por setas, lightbox
- ✅ Código migrado de ES6 para ES5 (maior compatibilidade)
- ✅ Deploy realizado com sucesso

**SEO - Melhorias Avançadas:**
- ✅ Schema Markup JSON-LD adicionado em todas as páginas:
  - Person (Karina Franzin)
  - ProfessionalService (Assessoria de Corrida)
  - Article (todos os 4 artigos do blog)
- ✅ Canonical URLs implementados em todas as páginas
- ✅ Sitemap.xml atualizado com artigo Run Avoa 2026
- ✅ Meta tags corrigidas (removidos acentos para evitar problemas de encoding)
- ✅ Guia completo criado: `GUIA-MELHORIAS-SEO-2026.md`

**Conteúdo:**
- ✅ Artigo "Como Começar a Correr do Zero" atualizado:
  - Removida dica sobre análise de pisada
  - Ajustado texto final (removido "de elite")

**Arquivos Criados:**
- `SOLUCAO-FINAL-CARROSSEL.md` - Documentação técnica da correção
- `GUIA-MELHORIAS-SEO-2026.md` - Guia completo de SEO e próximos passos
- `DEPLOY-SUCESSO.md` - Confirmação dos deploys

### **18/02/2026 - Sessão 1 (03h20):**
- ✅ Artigo "RUN AVOA 2026 Votuporanga" publicado
- ✅ Google Analytics 4 configurado
- ✅ Google Search Console configurado
- ✅ Sitemap enviado ao Google

---

## 🚀 DESENVOLVIMENTO DO CMS (SISTEMA DE GERENCIAMENTO DE CONTEÚDO)

### **20/02/2026 - FASE 1 E FASE 2: PAINEL ADMINISTRATIVO COMPLETO**

**🎯 OBJETIVO:**
Criar um sistema para a Karina gerenciar os artigos do blog sem precisar mexer no código HTML.

**🏗️ ARQUITETURA ESCOLHIDA:**
- **Backend:** Supabase (PostgreSQL + Storage + Auth)
- **Frontend:** HTML/CSS/JavaScript puro
- **Hospedagem:** GitHub Pages (site) + Cloudflare (DNS)
- **Custo:** R$ 0,00/mês (tier gratuito do Supabase)

---

### ✅ **FASE 1 CONCLUÍDA: ESTRUTURA DO BANCO DE DADOS**

**Arquivos Criados:**
- `supabase-schema.sql` - SQL completo para criar toda estrutura
- `SUPABASE-SETUP.md` - Guia passo a passo de configuração
- `SUPABASE-CREDENCIAIS.template.txt` - Template para anotar credenciais
- `FASE-1-CONCLUIDA.md` - Resumo da fase

**🗄️ Estrutura do Banco (Tabela `artigos`):**
```sql
- id (UUID, primary key)
- slug (text, único, indexado)
- titulo (text)
- resumo (text)
- conteudo (text)
- imagem_card (text, URL)
- imagem_cabecalho (text, URL)
- autor (text, default: 'Karina Franzin')
- publicado (boolean, default: false)
- meta_titulo (text, SEO)
- meta_descricao (text, SEO)
- meta_keywords (text, SEO)
- visualizacoes (integer, default: 0)
- created_at (timestamp)
- updated_at (timestamp)
- user_id (UUID, foreign key para auth.users)
```

**🔒 Segurança Implementada:**
- Row Level Security (RLS) ativado
- Políticas de acesso:
  - ✅ Leitura pública (apenas artigos publicados)
  - ✅ Admin completo (usuários autenticados)
  - ✅ Proteção contra edição não autorizada

**📦 Storage Configurado:**
- Bucket `artigos` para imagens
- Políticas de acesso público para leitura
- Upload restrito a usuários autenticados

**⚙️ Funcionalidades Automáticas:**
- Trigger para atualizar `updated_at` automaticamente
- Função `gerar_slug()` para criar URLs amigáveis
- Função `incrementar_visualizacoes()` para analytics
- Índices para performance (slug, publicado, created_at)

**📊 Dados Iniciais:**
- 4 artigos existentes pré-cadastrados no SQL
- Prontos para migração do sistema estático

---

### ✅ **FASE 2 CONCLUÍDA: PAINEL ADMINISTRATIVO**

**Arquivos Criados:**
- `admin/login.html` - Página de login
- `admin/index.html` - Dashboard principal (lista de artigos)
- `admin/editor.html` - Editor de artigos (criar/editar)
- `admin/css/admin.css` - Estilos do dashboard
- `admin/css/editor.css` - Estilos do editor
- `admin/js/admin.js` - Lógica do dashboard
- `admin/js/editor.js` - Lógica do editor + upload
- `js/supabase-config.js` - Configuração de conexão
- `FASE-2-PAINEL-ADMIN-COMPLETO.md` - Documentação completa
- `GUIA-RAPIDO-ADMIN.md` - Guia rápido para Karina
- `GUIA-TESTE-LOCAL.md` - Roteiro de testes
- `testar-admin.ps1` - Script para rodar servidor local
- `abrir-site.ps1` - Script atualizado com servidor HTTP

**🎨 Interface do Painel Admin:**

**1. Login (`/admin/login.html`):**
- ✅ Design moderno e clean
- ✅ Autenticação segura via Supabase
- ✅ Recuperação de senha
- ✅ Validação de campos
- ✅ Loading states

**2. Dashboard (`/admin/index.html`):**
- ✅ Listagem de todos os artigos
- ✅ Cards com preview de imagem
- ✅ Indicadores visuais:
  - Badge de status (Publicado/Rascunho)
  - Data de criação
  - Número de visualizações
- ✅ Botões de ação:
  - ➕ Criar novo artigo
  - ✏️ Editar artigo
  - 🗑️ Excluir artigo
- ✅ Modal de confirmação para exclusão
- ✅ Botão de logout
- ✅ Proteção de rota (redireciona se não autenticado)

**3. Editor (`/admin/editor.html`):**
- ✅ Formulário completo para criar/editar artigos
- ✅ Campos principais:
  - Título do artigo
  - Resumo (para cards)
  - Conteúdo completo (textarea)
  - Checkbox "Publicado" (rascunho por padrão)
- ✅ Upload de imagens:
  - Imagem do Card (preview na lista)
  - Imagem do Cabeçalho (topo do artigo)
  - Drag & Drop funcional
  - Preview antes de salvar
  - Compressão automática
- ✅ Campos SEO:
  - Meta Título
  - Meta Descrição
  - Meta Keywords
- ✅ Geração automática de slug
- ✅ Validações em tempo real
- ✅ Loading states durante salvamento
- ✅ Feedback visual de sucesso/erro

**🔧 Funcionalidades Técnicas:**

**CRUD Completo:**
- ✅ **Create:** Criar novos artigos com upload de imagens
- ✅ **Read:** Listar e visualizar artigos
- ✅ **Update:** Editar artigos existentes
- ✅ **Delete:** Remover artigos (com remoção de imagens do storage)

**Upload de Imagens:**
- ✅ Supabase Storage integrado
- ✅ Drag & Drop de arquivos
- ✅ Preview antes de enviar
- ✅ Validação de tipo (apenas imagens)
- ✅ Validação de tamanho (máx 5MB)
- ✅ Nomes únicos (timestamp + nome original)
- ✅ URLs públicas automáticas
- ✅ Remoção automática ao excluir artigo

**Autenticação e Segurança:**
- ✅ Login via Supabase Auth
- ✅ Sessão persistente
- ✅ Logout funcional
- ✅ Proteção de rotas (redirect se não autenticado)
- ✅ Credenciais protegidas no `.gitignore`

**UX/UI:**
- ✅ Design responsivo (mobile-friendly)
- ✅ Loading spinners durante operações
- ✅ Mensagens de feedback (sucesso/erro)
- ✅ Confirmação antes de excluir
- ✅ Navegação intuitiva
- ✅ Cores e identidade visual do site principal

---

Tool call argument 'replace' pruned from message history.

---

### 🧪 **AMBIENTE DE TESTE LOCAL:**

**Scripts Criados:**
- `testar-admin.ps1` - Inicia servidor HTTP + abre painel admin
- `abrir-site.ps1` - Inicia servidor HTTP + abre site principal

**Requisito:**
- ✅ Python 3.x OU Node.js instalado
- ⏳ **PENDENTE:** Usuário instalar Python

**Como testar:**
```powershell
cd site-karina-franzin
.\testar-admin.ps1
```

**URLs de teste:**
- Login: `http://localhost:8080/admin/login.html`
- Dashboard: `http://localhost:8080/admin/`
- Site: `http://localhost:8080/`

---

### 🎯 **PRÓXIMAS FASES (APÓS TESTES):**

**✅ FASE 3 CONCLUÍDA: Integração Frontend Dinâmica**
- ✅ `blog/index.html` modificado para consumir API Supabase
- ✅ Template dinâmico para artigos individuais (`blog/artigo.html`)
- ✅ SEO mantido (Meta tags dinâmicas, Open Graph, Schema Markup)
- ✅ Sistema totalmente funcional: criar artigo no `/admin` → publicar → aparece automaticamente no blog
- ✅ Scripts criados:
  - `js/blog-list.js` - Carrega lista de artigos do Supabase
  - `js/blog-article.js` - Carrega artigo individual por slug
  - `js/utils.js` - Funções utilitárias (tempo de leitura, formatação)

**FASE 4: Melhorias e Otimizações**
- Editor de texto rico (WYSIWYG)
- Categorias e tags
- Busca de artigos
- Analytics integrado
- Preview antes de publicar

**FASE 5: Treinamento**
- Criar vídeo tutorial para Karina
- Documentar processo de criação de artigos
- Guia de boas práticas de SEO

---

### 📊 **TECNOLOGIAS UTILIZADAS NO CMS:**

**Backend:**
- Supabase (PostgreSQL + Storage + Auth)
- Row Level Security (RLS)
- Triggers e Functions SQL

**Frontend:**
- HTML5 semântico
- CSS3 (Flexbox, Grid, Responsivo)
- JavaScript ES6+ (Vanilla)
- Supabase JavaScript SDK (CDN)

**Segurança:**
- Autenticação JWT via Supabase
- Políticas de acesso RLS
- Validações client-side e server-side
- Credenciais protegidas (.gitignore)

**Hospedagem:**
- Painel Admin: GitHub Pages (mesmo repositório)
- Banco de Dados: Supabase Cloud
- Storage: Supabase Storage
- Site: GitHub Pages + Cloudflare

---

### 📝 **DOCUMENTAÇÃO CRIADA:**

**Guias Técnicos:**
- `SUPABASE-SETUP.md` - Setup completo do Supabase (6 etapas)
- `supabase-schema.sql` - Schema completo do banco
- `FASE-1-CONCLUIDA.md` - Resumo da Fase 1
- `FASE-2-PAINEL-ADMIN-COMPLETO.md` - Resumo da Fase 2

**Guias de Uso:**
- `GUIA-RAPIDO-ADMIN.md` - Guia rápido para Karina usar o painel
- `GUIA-TESTE-LOCAL.md` - Roteiro de testes (8 cenários)

**Troubleshooting:**
- Erros comuns e soluções
- Checklist de aprovação
- Verificações no Supabase

---

### 🔐 **SEGURANÇA E PROTEÇÃO DE DADOS:**

**Arquivos Protegidos no `.gitignore`:**
```
SUPABASE-CREDENCIAIS.txt
js/supabase-config.js
tmp_rovodev_*
```

**Políticas de Segurança:**
- Apenas usuários autenticados podem criar/editar/excluir
- Leitura pública apenas de artigos publicados
- Upload de imagens restrito a autenticados
- Validações de tipo e tamanho de arquivo

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 03/03/2026

### 🚀 Commits do Dia (8 commits):

| Hash | Horário | Descrição |
|------|---------|-----------|
| `e330262` | 23:11 | Arrumando descrição do card da Cãominhada |
| `f776dd3` | 22:47 | Implantação do navbar e página de Eventos concluída |
| `e701aaf` | 22:39 | Layout da página funcionando |
| `adfcea0` | 21:38 | Botão Eventos criado na navbar |
| `87f376a` | 21:11 | Ajustando o laranja do botão como funciona |
| `2e06304` | 18:56 | Incluindo navbar em todo o site |
| `e0ee314` | 13:28 | Atualização arquivo contexto |
| `c873bd1` | 13:11 | Troca do banner Cãominhada na página dos blogs |

### ✅ O que foi feito nesta sessão:

**Navbar Global (commits `2e06304` e `87f376a`):**
- Navbar implementada em todas as páginas do site: `index.html`, `blog/index.html`, `blog/artigo.html` e todos os artigos individuais
- Novo botão **"Eventos"** adicionado na navbar (commit `adfcea0`)
- Cor laranja do botão ativo ajustada no `js/main.js`
- Novos estilos adicionados em `css/styles.css` (+229 linhas)
- Lógica de navbar expandida em `js/main.js` (+106 linhas)

**Página de Eventos (commit `e701aaf`):**
- Criada nova página de listagem de eventos em `eventos/index.html` (+598 linhas)
- Card do evento **Cãominhada 2026** adicionado na listagem
- Página dedicada do evento em `eventos/cao-minhada-2026/index.html` (+348 linhas)
- Adicionada imagem `assets/img/capa_evento_2.webp`
- Redirects/rewrites configurados no `.htaccess`
- Antiga página `cao-minhada-2026/index.html` simplificada (redirecionamento para nova estrutura)

**Ajustes Finais:**
- Descrição do card da Cãominhada corrigida em `eventos/index.html` (commit `e330262`)
- Banner da Cãominhada atualizado na página de blog (commit `c873bd1`)
- `assets/img/banner_caminhada.png` adicionado ao repositório

### 📁 Arquivos Criados/Modificados:

**Novos arquivos:**
- `eventos/index.html` — Página de listagem de eventos
- `eventos/cao-minhada-2026/index.html` — Página dedicada da Cãominhada 2026
- `assets/img/capa_evento_2.webp` — Imagem de capa do evento
- `assets/img/banner_caminhada.png` — Banner da Cãominhada

**Arquivos modificados:**
- `index.html` — Navbar atualizada com botão Eventos
- `blog/index.html` — Navbar atualizada
- `blog/artigo.html` — Navbar atualizada + banner
- `blog/como-comecar-a-correr-do-zero/index.html` — Navbar
- `blog/erros-comuns-corrida-iniciantes/index.html` — Navbar
- `blog/plano-de-treino-para-correr-5km-em-8-semanas-iniciantes/index.html` — Navbar
- `blog/run-avoa-2026-votuporanga/index.html` — Navbar
- `css/styles.css` — Estilos da navbar global (+229 linhas)
- `css/blog.css` — Ajuste no banner do blog
- `js/main.js` — Lógica da navbar e cor do botão ativo (+106 linhas)
- `.htaccess` — Configuração de rotas/redirects
- `cao-minhada-2026/index.html` — Simplificado (redirecionamento)

### 📌 Estado do Projeto após 03/03/2026:
- ✅ Navbar global funcionando em **todas as páginas**
- ✅ Seção de **Eventos** criada e funcional (`/eventos/`)
- ✅ Evento **Cãominhada 2026** com página dedicada em `/eventos/cao-minhada-2026/`
- ✅ Estrutura de rotas organizada com `.htaccess`

---

## 🏗️ ARQUITETURA DO SITE — DECISÕES DEFINITIVAS (04/03/2026)

### Blog — Funcionamento Definitivo:
- **Uma única página HTML** serve todos os artigos: `blog/artigo.html?slug=nome-do-artigo`
- O JavaScript (`js/blog-article.js`) lê o `slug` da URL e busca o conteúdo no **Supabase**
- As pastas estáticas `blog/nome-artigo/index.html` são **legado** e não são mais utilizadas
- A listagem do blog (`blog/index.html`) também é dinâmica via `js/blog-list.js` + Supabase
- Para criar um novo artigo: basta inserir no Supabase via painel admin (`/admin/`)

### Navbar e Rodapé — Padrão Global:
- A **navbar é idêntica** em todas as páginas do site (HTML copiado em cada arquivo)
- O **rodapé é idêntico** em todas as páginas do site (HTML copiado em cada arquivo)
- Qualquer alteração na navbar ou rodapé deve ser replicada em **todos os arquivos HTML**
- Arquivos que contêm a navbar: `index.html`, `blog/index.html`, `blog/artigo.html`, `eventos/index.html`, `eventos/cao-minhada-2026/index.html`, e todos os artigos estáticos legado

### Estrutura de Páginas Ativas:
| Página | Arquivo | Tipo |
|--------|---------|------|
| Home | `index.html` | Estático |
| Blog (listagem) | `blog/index.html` | Dinâmico (Supabase) |
| Blog (artigo) | `blog/artigo.html?slug=...` | Dinâmico (Supabase) |
| Eventos | `eventos/index.html` | Estático |
| Cãominhada 2026 | `eventos/cao-minhada-2026/index.html` | Estático |
| Admin | `admin/index.html` | CMS (Supabase) |

### ⚠️ Importante para a IA:
- Ao criar/modificar qualquer página, sempre incluir a **mesma navbar e rodapé** das outras páginas
- Novos artigos do blog **não precisam de arquivo HTML** — apenas inserir no Supabase
- Novos eventos precisam de: card em `eventos/index.html` + nova pasta `eventos/nome-evento/index.html`

---

## 📅 SESSÃO DE DESENVOLVIMENTO — 04/03/2026

### 🚀 Commits do Dia (2 commits):

| Hash | Horário | Descrição |
|------|---------|-----------|
| `c675a36` | 21:26 | Página do evento Lord Lion concluída, card do evento também |
| `3da34d2` | 21:56 | Resolvido erro da navbar que não carregava corretamente |

### ✅ O que foi feito nesta sessão:

**Evento "A Noite É Delas!" - Dia da Mulher Lord Lion:**
- Card do evento criado em `eventos/index.html` com imagem `lordcard.webp`, data 08/03/2026 e link para `/eventos/dia-da-mulher-lord-lion/`
- Nova página dedicada criada em `eventos/dia-da-mulher-lord-lion/index.html` com:
  - Hero com título "A Noite É Delas!", foto do evento (Unsplash) e botão WhatsApp
  - Seção sobre o evento com destaque para atração Maria Paula
  - Bloco de entrada gratuita para alunos da Karina Franzin (4 passos)
  - Aviso especial para alunos homens (podem doar a entrada para uma mulher)
  - Rodapé com logos da Lord Lion e Karina Franzin com links para Instagram
- Navbar padrão do site da Karina incluída (com "Eventos" ativo)
- Imagens copiadas para `assets/img/`: `logoLordLion.png`, `logoKarinaFranzin.png`, `lordcard.webp`, `banner-dia-da-mulher-lord-lion.jpg`

**Projeto LordLion_Diadamulher (página standalone):**
- Logo Lord Lion: link atualizado para `https://www.instagram.com/lordlioncervejaria/`, texto `@lordlioncervejaria`
- Logo Karina Franzin: link atualizado para `https://www.instagram.com/karina_franzin/`, texto `@karina_franzin`
- Removida barra superior "Portal de Eventos | Treinadora Karina Franzin"
- Removido texto de copyright do rodapé

**Correção do bug da Navbar (commit `3da34d2`):**
- **Problema:** Em alguns celulares e navegadores, a navbar não carregava corretamente — o logo e os links apareciam em coluna abaixo uns dos outros. Limpando cookies resolvia, pois o CSS ficava em cache.
- **Causa:** FOUC (Flash of Unstyled Content) — o HTML renderizava antes do `styles.css` carregar, sem estilos de layout
- **Solução:** Adicionado **CSS crítico inline** no `<head>` do `index.html` com os estilos mínimos da navbar (posicionamento, flex, hamburger, responsivo). Navbar começa transparente no topo e escurece ao rolar (comportamento original mantido).
- **Resultado:** Navbar sempre renderiza corretamente desde o primeiro pixel, independente do cache ou velocidade de conexão

### 📁 Arquivos Criados/Modificados:
**Novos:**
- `eventos/dia-da-mulher-lord-lion/index.html` — Página dedicada do evento
- `assets/img/logoLordLion.png`
- `assets/img/logoKarinaFranzin.png`
- `assets/img/lordcard.webp`
- `assets/img/banner-dia-da-mulher-lord-lion.jpg`

**Modificados:**
- `index.html` — CSS crítico inline adicionado no `<head>` (fix navbar FOUC)
- `eventos/index.html` — Card do evento Dia da Mulher adicionado

### 📌 Estado do Projeto após 04/03/2026:
- ✅ Evento **"A Noite É Delas!" (Lord Lion x Karina Franzin)** com card e página dedicada
- ✅ Bug da navbar corrigido — sem mais FOUC em nenhum dispositivo
- ✅ Projeto online em `karinafranzin.com.br` (branch main)
- 🔧 Desenvolvimento ativo na branch **develop**

### 🗂️ Parceiro de Projeto:
- **Lord Lion Cervejaria** — Instagram: `@lordlioncervejaria`
- Projeto standalone da página do evento em: `C:\Users\oigor\PROJETOS\LordLion_Diadamulher\`
- Futuramente a página será integrada ao site da Karina como evento oficial