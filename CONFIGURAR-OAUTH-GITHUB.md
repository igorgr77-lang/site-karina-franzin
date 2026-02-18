# 🔐 GUIA: Configurar OAuth do GitHub para NetlifyCMS

Este guia mostra como configurar a autenticação do NetlifyCMS com o GitHub. **Sem isso, o painel admin não funcionará.**

⏱️ **Tempo estimado:** 5-10 minutos  
🎯 **Dificuldade:** Fácil

---

## 📋 O QUE VOCÊ VAI PRECISAR:

- ✅ Conta no GitHub (você já tem)
- ✅ Acesso ao repositório `igorgr77-lang/site-karina-franzin`
- ✅ Conta no Netlify (grátis - vamos criar)

---

## 🚀 PASSO A PASSO COMPLETO:

### **ETAPA 1: Criar Conta no Netlify** (se ainda não tiver)

1. Acesse: https://app.netlify.com/signup
2. Clique em **"Sign up with GitHub"**
3. Autorize o Netlify a acessar sua conta GitHub
4. ✅ Pronto! Conta criada

---

### **ETAPA 2: Conectar o Repositório no Netlify**

1. No painel do Netlify, clique em **"Add new site"** → **"Import an existing project"**

2. Escolha **"Deploy with GitHub"**

3. Procure e selecione o repositório: **`igorgr77-lang/site-karina-franzin`**

4. Configure o deploy:
   ```
   Branch to deploy: main
   Build command: (deixe em branco)
   Publish directory: /
   ```

5. Clique em **"Deploy site"**

6. Aguarde o deploy (1-2 minutos)

7. ✅ Seu site estará disponível em um domínio Netlify (ex: `nome-aleatorio-123.netlify.app`)

---

### **ETAPA 3: Configurar Domínio Personalizado no Netlify**

1. No painel do Netlify, vá em **"Site settings"** → **"Domain management"**

2. Clique em **"Add custom domain"**

3. Digite: `karinafranzin.com.br`

4. Clique em **"Verify"** e depois **"Add domain"**

5. O Netlify vai mostrar instruções DNS. **IMPORTANTE:**
   - Você pode manter o site no GitHub Pages
   - Só precisa do Netlify para autenticação do CMS
   - Não é obrigatório migrar o site agora

---

### **ETAPA 4: Habilitar Netlify Identity**

1. No painel do Netlify, vá em **"Site settings"** → **"Identity"**

2. Clique em **"Enable Identity"**

3. Após habilitar, vá em **"Settings and usage"**

4. Em **"Registration preferences"**, selecione:
   - **"Invite only"** (apenas pessoas convidadas podem acessar)

5. Em **"External providers"**, clique em **"Add provider"**

6. Selecione **"GitHub"** e clique em **"Enable"**

7. ✅ Identity configurado!

---

### **ETAPA 5: Habilitar Git Gateway**

1. Ainda em **"Identity"**, role para baixo até **"Services"**

2. Encontre **"Git Gateway"** e clique em **"Enable Git Gateway"**

3. Certifique-se de que está configurado para:
   ```
   Repository: igorgr77-lang/site-karina-franzin
   Branch: main
   ```

4. ✅ Git Gateway ativado!

---

### **ETAPA 6: Atualizar Configuração do NetlifyCMS**

1. Abra o arquivo `site-karina-franzin/admin/config.yml`

2. **MUDE** de:
   ```yaml
   backend:
     name: github
     repo: igorgr77-lang/site-karina-franzin
     branch: main
   ```

3. **PARA:**
   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```

4. Salve o arquivo

5. Faça commit e push:
   ```bash
   git add admin/config.yml
   git commit -m "feat: configurar Git Gateway para NetlifyCMS"
   git push origin main
   ```

---

### **ETAPA 7: Convidar a Karina**

1. No Netlify, vá em **"Identity"** → **"Invite users"**

2. Digite o **email da Karina**

3. Clique em **"Send invite"**

4. A Karina vai receber um email com um link de ativação

5. Ela deve:
   - Clicar no link
   - Criar uma senha
   - ✅ Pronto! Pode acessar o CMS

---

## 🎯 APÓS CONFIGURAR:

### **Como a Karina vai acessar:**

1. Acessa: **https://karinafranzin.com.br/admin/**

2. Clica em **"Login with Netlify Identity"**

3. Faz login com email e senha

4. ✅ Acessa o painel e pode criar artigos!

---

## 🔄 ALTERNATIVA MAIS SIMPLES (Recomendada):

Se você achar complexo, existe uma alternativa mais simples:

### **Usar GitHub OAuth App Diretamente:**

1. Acesse: https://github.com/settings/developers

2. Clique em **"OAuth Apps"** → **"New OAuth App"**

3. Preencha:
   ```
   Application name: Karina Franzin Blog CMS
   Homepage URL: https://karinafranzin.com.br
   Authorization callback URL: https://api.netlify.com/auth/done
   ```

4. Clique em **"Register application"**

5. Copie o **Client ID** e **Client Secret**

6. No Netlify, vá em **"Site settings"** → **"Access control"** → **"OAuth"**

7. Clique em **"Install provider"**

8. Escolha **"GitHub"** e cole o Client ID e Client Secret

9. ✅ Pronto!

---

## ❓ PROBLEMAS COMUNS:

### **Erro: "Failed to load settings from config.yml"**
- ✅ Certifique-se que o arquivo `config.yml` tem sintaxe YAML correta
- ✅ Verifique se não há espaços extras

### **Erro: "Not Authorized"**
- ✅ Verifique se o Git Gateway está habilitado
- ✅ Confirme que a Karina aceitou o convite

### **Erro: "Config file not found"**
- ✅ Certifique-se que `admin/config.yml` está no repositório
- ✅ Faça push das mudanças

---

## 📞 PRECISA DE AJUDA?

Se tiver alguma dificuldade, me avise e eu te ajudo!

---

## 📚 DOCUMENTAÇÃO OFICIAL:

- NetlifyCMS: https://www.netlifycms.org/docs/
- Netlify Identity: https://docs.netlify.com/visitor-access/identity/
- Git Gateway: https://docs.netlify.com/visitor-access/git-gateway/

---

**Depois de configurar, a Karina poderá escrever artigos independentemente!** 🚀
