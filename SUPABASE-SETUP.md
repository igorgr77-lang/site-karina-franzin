# 🗄️ SUPABASE SETUP - CMS BLOG KARINA FRANZIN

## 📋 PASSO A PASSO COMPLETO

### **ETAPA 1: Criar Conta e Projeto**

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado) ou email
4. Clique em **"New Project"**
5. Preencha:
   - **Name:** `blog-karina-franzin`
   - **Database Password:** (ANOTE ESSA SENHA! Você vai precisar)
   - **Region:** `South America (São Paulo)` (melhor performance)
   - **Pricing Plan:** Free
6. Clique em **"Create new project"**
7. Aguarde 2-3 minutos (criação do banco)

---

### **ETAPA 2: Executar SQL de Estrutura**

1. No painel do Supabase, vá em **SQL Editor** (ícone de banco de dados na lateral)
2. Clique em **"New query"**
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor
5. Clique em **"RUN"** (canto inferior direito)
6. Aguarde mensagem: ✅ **"Success. No rows returned"**

---

### **ETAPA 3: Configurar Storage**

1. Vá em **Storage** (ícone de pasta na lateral)
2. Clique em **"Create a new bucket"**
3. Preencha:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ **MARCAR** (imagens públicas)
4. Clique em **"Create bucket"**
5. Clique no bucket `blog-images`
6. Vá em **"Policies"** (aba superior)
7. Clique em **"New Policy"**
8. Escolha **"For full customization"**
9. Preencha:
   - **Policy name:** `Public Access`
   - **Allowed operation:** `SELECT`
   - **Policy definition:** 
   ```sql
   true
   ```
10. Clique em **"Review"** → **"Save policy"**

11. Criar política de Upload (apenas autenticados):
    - Clique em **"New Policy"**
    - **Policy name:** `Authenticated Upload`
    - **Allowed operation:** `INSERT`
    - **Policy definition:**
    ```sql
    auth.role() = 'authenticated'
    ```
    - Clique em **"Review"** → **"Save policy"**

12. Criar política de Delete (apenas autenticados):
    - Clique em **"New Policy"**
    - **Policy name:** `Authenticated Delete`
    - **Allowed operation:** `DELETE`
    - **Policy definition:**
    ```sql
    auth.role() = 'authenticated'
    ```
    - Clique em **"Review"** → **"Save policy"**

---

### **ETAPA 4: Criar Conta da Karina**

1. Vá em **Authentication** → **Users** (lateral esquerda)
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email:** (email da Karina)
   - **Password:** (senha forte, ANOTAR!)
   - **Auto Confirm User:** ✅ **MARCAR**
4. Clique em **"Create user"**

---

### **ETAPA 5: Obter Credenciais da API**

1. Vá em **Project Settings** (ícone de engrenagem, canto inferior esquerdo)
2. Clique em **API** (menu lateral)
3. **COPIE E ANOTE:**
   - ✅ **Project URL** (exemplo: `https://xyzabc.supabase.co`)
   - ✅ **anon public** key (chave pública - pode expor no site)
   - ✅ **service_role** key (chave secreta - NUNCA expor!)

---

### **ETAPA 6: Configurar Variáveis no Projeto**

Após obter as credenciais, você vai criar um arquivo de configuração:

1. Crie o arquivo `site-karina-franzin/js/supabase-config.js`
2. Cole o conteúdo:
```javascript
// Configuração Supabase
const SUPABASE_URL = 'SUA_PROJECT_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

// Inicializar cliente
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

3. **SUBSTITUA** os valores pelas suas credenciais reais

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de prosseguir para Fase 2, confirme:

- [ ] Projeto Supabase criado
- [ ] SQL executado sem erros
- [ ] Bucket `blog-images` criado e público
- [ ] Políticas de storage configuradas
- [ ] Usuário da Karina criado
- [ ] Credenciais copiadas (URL + anon key)
- [ ] Arquivo `supabase-config.js` criado

---

## 🆘 TROUBLESHOOTING

### **Erro ao executar SQL:**
- Verifique se copiou TODO o conteúdo do arquivo
- Certifique-se de que não há queries anteriores no editor

### **Erro ao criar bucket:**
- Nome deve ser minúsculo e sem espaços
- Use apenas letras, números e hífens

### **Não consigo fazer upload:**
- Verifique se políticas de INSERT foram criadas
- Confirme que usuário está autenticado

---

## 📞 CONTATO

Qualquer dúvida, me avise que te ajudo! 🚀

**Próxima Fase:** Desenvolvimento do Painel Admin
