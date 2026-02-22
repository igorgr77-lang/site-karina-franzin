# 📝 MIGRAÇÃO RÁPIDA DOS 4 ARTIGOS

## 🎯 Objetivo

Copiar o conteúdo dos artigos HTML estáticos para o banco de dados via painel admin.

---

## ⚡ PROCESSO SIMPLIFICADO

### **ARTIGO 1: Como Começar a Correr do Zero**

**Passo a passo:**
1. Abra o painel admin: http://localhost:8080/admin/
2. Faça login
3. Clique em "Editar" no artigo "Como Começar a Correr do Zero"
4. Abra o arquivo: `blog/como-comecar-a-correr-do-zero/index.html`
5. Copie TODO o conteúdo entre as tags `<article>` e `</article>` (linhas ~70-250)
6. Cole no campo "Conteúdo do Artigo"
7. Verifique se o **Subtítulo** está preenchido (se não, copie do HTML)
8. Salve

---

### **ARTIGO 2: Plano de Treino 5km**

1. Clique em "Editar" no artigo "Plano de Treino de 5km para Iniciantes"
2. Abra: `blog/plano-de-treino-5km-para-iniciantes/index.html`
3. Copie o conteúdo entre `<article>` e `</article>`
4. Cole no painel admin
5. Preencha o subtítulo
6. Salve

---

### **ARTIGO 3: 10 Erros Comuns**

1. Clique em "Editar" no artigo "10 Erros Comuns de Iniciantes na Corrida"
2. Abra: `blog/erros-comuns-corrida-iniciantes/index.html`
3. Copie o conteúdo entre `<article>` e `</article>`
4. Cole no painel admin
5. Preencha o subtítulo
6. Salve

---

### **ARTIGO 4: RUN AVOA 2026**

1. Clique em "Editar" no artigo "RUN AVOA 2026 Votuporanga"
2. Abra: `blog/run-avoa-2026-votuporanga/index.html`
3. Copie o conteúdo entre `<article>` e `</article>`
4. Cole no painel admin
5. Preencha o subtítulo
6. Salve

---

## 📋 DICA PARA COPIAR O CONTEÚDO

No HTML de cada artigo, procure por:

```html
<article>
    <!-- COPIE DAQUI -->
    <h2>Título da Seção</h2>
    <p>Conteúdo...</p>
    ...
    <!-- ATÉ AQUI -->
</article>
```

**NÃO copie** as tags `<article>` e `</article>`, apenas o conteúdo interno!

---

## ✅ CHECKLIST

Após migrar cada artigo, verifique no painel:
- [ ] Título correto
- [ ] Slug correto
- [ ] Resumo preenchido
- [ ] **Subtítulo preenchido** (novo campo!)
- [ ] **Conteúdo completo** (não vazio!)
- [ ] Imagens carregando
- [ ] Status "Publicado"

---

## ⏱️ Tempo estimado: 10-15 minutos

---

## 🚨 IMPORTANTE

Depois de migrar os 4 artigos:
1. Teste acessar: http://localhost:8080/blog/
2. Deve listar os 4 artigos dinamicamente
3. Clique em cada um e veja se carrega corretamente
4. Verifique se o tempo de leitura aparece

---

## 💡 ALTERNATIVA RÁPIDA

Se preferir, posso extrair o conteúdo dos HTMLs e te passar em formato texto para você colar diretamente!

Quer que eu faça isso?
