# 📝 GUIA: Migração Manual dos Artigos

## ⚠️ Por que Manual?

O script automático deu erro 400 (Bad Request) ao tentar atualizar via API.
A forma mais rápida e segura é fazer via painel admin (já está funcionando perfeitamente!).

---

## 🎯 PASSO A PASSO:

### **Artigo 1: Como Começar a Correr do Zero**

1. **Abra no painel admin:**
   - http://localhost:8080/admin/
   - Clique em "Editar" no artigo "Como Começar a Correr do Zero"

2. **Abra o HTML original:**
   - `blog/como-comecar-a-correr-do-zero/index.html`
   - Procure o conteúdo dentro de `<article>...</article>`

3. **Copie e cole:**
   - Copie todo o HTML do artigo (h2, p, ul, etc.)
   - Cole no campo "Conteúdo do Artigo" no painel
   - Salve

---

### **Artigo 2: 10 Erros Comuns na Corrida**

1. Edite: "10 Erros Comuns que Iniciantes Cometem na Corrida"
2. Abra: `blog/erros-comuns-corrida-iniciantes/index.html`
3. Copie o conteúdo entre `<article>` e `</article>`
4. Cole e salve

---

### **Artigo 3: Plano de Treino 5km**

1. Edite: "Plano de Treino de 5km para Iniciantes"
2. Abra: `blog/plano-de-treino-5km-para-iniciantes/index.html`
3. Copie o conteúdo entre `<article>` e `</article>`
4. Cole e salve

---

### **Artigo 4: RUN AVOA 2026**

1. Edite: "RUN AVOA 2026 Votuporanga"
2. Abra: `blog/run-avoa-2026-votuporanga/index.html`
3. Copie o conteúdo entre `<article>` e `</article>`
4. Cole e salve

---

## ⏱️ **Tempo Estimado:**

- **Por artigo:** 2-3 minutos
- **Total:** 10-15 minutos

---

## ✅ **Como Saber que Está Completo?**

Após migrar todos os 4 artigos:
1. Vá no Supabase → Table Editor → `artigos`
2. Verifique que a coluna `conteudo` tem HTML em todos os 4 artigos originais

---

## 💡 **DICA:**

Enquanto migra, aproveite para:
- Revisar o conteúdo
- Verificar se as imagens estão corretas
- Confirmar se os links funcionam
- Testar o "Tempo de Leitura" automático

---

**Quer que eu te ajude durante o processo?** Posso ir te orientando artigo por artigo! 🚀
