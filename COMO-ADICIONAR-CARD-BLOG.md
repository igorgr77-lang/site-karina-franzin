# 📝 Como Adicionar Card do Artigo no Blog

Depois de gerar o artigo com o script `gerar-artigo.ps1`, você precisa adicionar o card manualmente no `blog/index.html`.

---

## 🎯 Passo a Passo

### 1. Abrir o arquivo

Abra o arquivo: `site-karina-franzin/blog/index.html`

### 2. Localizar a seção de artigos

Procure por `<div class="articles-grid">` (aproximadamente linha 40)

### 3. Adicionar o novo card

**Cole este código ANTES dos outros artigos** (para aparecer primeiro):

```html
<article class="article-card">
    <img src="../assets/img/SEU-CABECALHO.jpg" 
         alt="Descrição da imagem" 
         class="article-image"
         loading="lazy">
    <div class="article-content">
        <span class="article-category">CATEGORIA</span>
        <h2><a href="./seu-slug/">Título do Seu Artigo</a></h2>
        <p>Breve descrição do artigo que aparece no card do blog.</p>
        <div class="article-meta">
            <span>📅 DD de mês, 2026</span>
            <span>⏱️ X min de leitura</span>
        </div>
        <a href="./seu-slug/" class="article-link">Ler artigo completo →</a>
    </div>
</article>
```

### 4. Personalizar o card

Substitua:
- `SEU-CABECALHO.jpg` → Nome da imagem
- `Descrição da imagem` → Alt text da imagem
- `CATEGORIA` → INICIANTES, TREINOS, EVENTOS, DICAS, etc.
- `Título do Seu Artigo` → Título completo
- `seu-slug` → Slug do artigo (nome da pasta)
- Descrição breve
- Data e tempo de leitura

---

## 📌 Exemplo Real

Supondo que você gerou o artigo "5 Dicas Para Correr Seu Primeiro 10km":

```html
<article class="article-card">
    <img src="../assets/img/cabecalho-10km-iniciantes.jpg" 
         alt="Corredor cruzando linha de chegada de uma prova de 10km" 
         class="article-image"
         loading="lazy">
    <div class="article-content">
        <span class="article-category">INICIANTES</span>
        <h2><a href="./dicas-correr-primeiro-10km/">5 Dicas Para Correr Seu Primeiro 10km</a></h2>
        <p>Descubra as 5 dicas essenciais para completar sua primeira corrida de 10km com sucesso e segurança.</p>
        <div class="article-meta">
            <span>📅 18 de fevereiro, 2026</span>
            <span>⏱️ 5 min de leitura</span>
        </div>
        <a href="./dicas-correr-primeiro-10km/" class="article-link">Ler artigo completo →</a>
    </div>
</article>
```

---

## ✅ Checklist

- [ ] Card adicionado em `blog/index.html`
- [ ] Imagem do cabeçalho adicionada em `assets/img/`
- [ ] Slug correto nos links
- [ ] Categoria em MAIÚSCULAS
- [ ] Data e tempo de leitura corretos
- [ ] Testado localmente
- [ ] Commit e push feitos

---

## 🎨 Categorias Disponíveis

Use uma dessas categorias (em MAIÚSCULAS):

- **INICIANTES** - Para quem está começando
- **TREINOS** - Planos e dicas de treino
- **EVENTOS** - Provas e competições
- **DICAS** - Dicas gerais de corrida
- **NUTRIÇÃO** - Alimentação para corredores
- **LESÕES** - Prevenção e recuperação

---

## 💡 Dica

Coloque os artigos mais novos **primeiro** na lista para aparecerem no topo do blog!

---

**Pronto!** Agora é só fazer commit e push que o artigo aparecerá no blog! 🚀
