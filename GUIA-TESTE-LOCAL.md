# 🧪 GUIA DE TESTE LOCAL - PAINEL ADMIN

## 🎯 **OBJETIVO:**
Testar o painel administrativo localmente antes de publicar online.

---

## 📋 **PRÉ-REQUISITOS:**

### **Você precisa de um servidor HTTP local**

**Opção 1: Python (Recomendado)** ✅
- Baixar: https://www.python.org/downloads/
- Durante instalação: marcar "Add Python to PATH"
- Verificar: `python --version`

**Opção 2: Node.js**
- Baixar: https://nodejs.org/
- Instalar versão LTS
- Verificar: `node --version`

---

## 🚀 **COMO RODAR O SERVIDOR LOCAL:**

### **Método 1: Script Automático (Mais Fácil)**

1. Abra o **PowerShell** na pasta do projeto
2. Execute:
   ```powershell
   cd site-karina-franzin
   .\testar-admin.ps1
   ```

3. O navegador abrirá automaticamente em: `http://localhost:8080/admin/login.html`

---

### **Método 2: Manual (Se o script não funcionar)**

**Com Python:**
```powershell
cd site-karina-franzin
python -m http.server 8080
```

**Com Node.js:**
```powershell
cd site-karina-franzin
npx http-server -p 8080
```

Depois abra: `http://localhost:8080/admin/login.html`

---

## 🔐 **ROTEIRO DE TESTES:**

### **Teste 1: Login**
1. Acesse: `http://localhost:8080/admin/login.html`
2. Digite o email cadastrado no Supabase
3. Digite a senha
4. Clique em "Entrar"
5. ✅ **Deve redirecionar para `/admin/`**

---

### **Teste 2: Visualizar Artigos Existentes**
1. No painel admin, veja a lista de artigos
2. ✅ **Deve mostrar os 4 artigos pré-cadastrados**
3. Verifique se aparecem: título, resumo, status, data

---

### **Teste 3: Criar Novo Artigo**
1. Clique em **"+ Novo Artigo"**
2. Preencha todos os campos:
   - Título: "Teste de Artigo Local"
   - Resumo: "Este é um teste do painel admin"
   - Conteúdo: "Conteúdo de teste..."
   - Upload de imagem do card
   - Upload de imagem do cabeçalho
3. Deixe em **"Rascunho"** (não publicar ainda)
4. Clique em **"Salvar Artigo"**
5. ✅ **Deve mostrar mensagem de sucesso**
6. ✅ **Deve voltar para lista de artigos**
7. ✅ **Artigo deve aparecer na lista**

---

### **Teste 4: Upload de Imagens**
1. No formulário de criar/editar
2. Arraste uma imagem para a área "Imagem do Card"
3. ✅ **Deve mostrar preview da imagem**
4. Arraste outra imagem para "Imagem do Cabeçalho"
5. ✅ **Deve mostrar preview**
6. Salve o artigo
7. ✅ **Imagens devem aparecer no Supabase Storage**

**Verificar no Supabase:**
- Vá em: Storage → Bucket `artigos`
- ✅ Deve ter 2 imagens novas

---

### **Teste 5: Editar Artigo**
1. Na lista de artigos, clique em **"Editar"** de um artigo
2. Modifique o título: adicione " - EDITADO"
3. Altere o conteúdo
4. Clique em **"Salvar Artigo"**
5. ✅ **Deve mostrar mensagem de sucesso**
6. Volte para lista
7. ✅ **Título deve estar atualizado**

---

### **Teste 6: Publicar/Despublicar**
1. Edite um artigo em rascunho
2. Marque **"Publicado"**
3. Salve
4. ✅ **Status deve mudar para "Publicado"**
5. Edite novamente
6. Desmarque **"Publicado"**
7. ✅ **Status deve voltar para "Rascunho"**

---

### **Teste 7: Excluir Artigo**
1. No artigo de teste criado, clique em **"Excluir"**
2. ✅ **Deve abrir modal de confirmação**
3. Clique em **"Sim, Excluir"**
4. ✅ **Artigo deve sumir da lista**
5. ✅ **Imagens devem ser removidas do Storage**

**Verificar no Supabase:**
- Vá em: Table Editor → `artigos`
- ✅ Artigo não deve estar mais lá

---

### **Teste 8: Logout**
1. Clique no botão **"Sair"** no topo
2. ✅ **Deve voltar para tela de login**
3. Tente acessar: `http://localhost:8080/admin/`
4. ✅ **Deve redirecionar para login (proteção de rota)**

---

## 🐛 **PROBLEMAS COMUNS:**

### **Erro: "Supabase is not defined"**
**Causa:** CDN do Supabase não carregou
**Solução:** Verifique sua conexão com internet

### **Erro: "CORS policy"**
**Causa:** Abriu HTML direto (file://)
**Solução:** Use servidor HTTP local (script)

### **Erro: "Unauthorized"**
**Causa:** Credenciais erradas ou RLS não configurado
**Solução:** 
1. Verifique email/senha no Supabase
2. Verifique se executou o SQL completo

### **Imagens não aparecem**
**Causa:** Bucket ou políticas não configuradas
**Solução:**
1. Verifique se bucket `artigos` existe
2. Verifique políticas de acesso público

---

## ✅ **CHECKLIST DE APROVAÇÃO:**

Antes de aprovar para produção, confirme:

- [ ] ✅ Login funciona
- [ ] ✅ Lista artigos existentes
- [ ] ✅ Cria novo artigo
- [ ] ✅ Upload de imagens funciona
- [ ] ✅ Preview de imagens aparece
- [ ] ✅ Edita artigo existente
- [ ] ✅ Exclui artigo
- [ ] ✅ Imagens são removidas ao excluir
- [ ] ✅ Publicar/Despublicar funciona
- [ ] ✅ Logout funciona
- [ ] ✅ Proteção de rotas funciona
- [ ] ✅ Slug é gerado automaticamente
- [ ] ✅ Data de criação/atualização corretas

---

## 📊 **VERIFICAR NO SUPABASE:**

Após os testes, verifique no painel do Supabase:

1. **Table Editor → artigos**
   - ✅ Artigos criados aparecem
   - ✅ Campos preenchidos corretamente
   - ✅ Timestamps corretos

2. **Storage → artigos**
   - ✅ Imagens foram enviadas
   - ✅ Nomes de arquivo corretos
   - ✅ Imagens excluídas foram removidas

3. **Authentication → Users**
   - ✅ Seu usuário está ativo
   - ✅ Login registrado

---

## 🎉 **PRÓXIMO PASSO:**

Quando todos os testes passarem, me avise:

**"Testes locais aprovados!"**

Aí partimos para **Fase 3: Integração com Frontend** (fazer o blog consumir os dados do Supabase).

---

**Última atualização:** 20/02/2026
