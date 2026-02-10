# 🚀 Deploy do Site no GitHub Pages

## Passo a Passo Completo

### 📋 Pré-requisitos

1. **Conta no GitHub** - Se não tiver, crie em: https://github.com/signup
2. **Git instalado** - Verifique com: `git --version`
   - Se não tiver, baixe em: https://git-scm.com/downloads

---

## 🎯 Método 1: Via Interface do GitHub (Mais Fácil)

### Passo 1: Criar Repositório no GitHub
1. Acesse https://github.com
2. Clique em **"New repository"** (botão verde +)
3. Preencha:
   - **Repository name:** `site-karina-franzin`
   - **Description:** "Site institucional da treinadora Karina Franzin"
   - **Visibilidade:** Public (para usar GitHub Pages grátis)
   - **NÃO** marque "Add a README file"
4. Clique em **"Create repository"**

### Passo 2: Fazer Upload dos Arquivos
1. Na página do repositório criado, clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos da pasta `site-karina-franzin` para a área de upload
   - OU clique em "choose your files" e selecione todos
3. Adicione uma mensagem: `Initial commit - Site Karina Franzin`
4. Clique em **"Commit changes"**

### Passo 3: Ativar GitHub Pages
1. No repositório, clique em **"Settings"** (engrenagem)
2. No menu lateral esquerdo, clique em **"Pages"**
3. Em **"Source"**, selecione:
   - Branch: `main` (ou `master`)
   - Folder: `/ (root)`
4. Clique em **"Save"**
5. Aguarde 1-2 minutos
6. Recarregue a página e verá o link do site publicado!
   - Será algo como: `https://seu-usuario.github.io/site-karina-franzin/`

---

## 🎯 Método 2: Via Git/PowerShell (Recomendado)

### Passo 1: Criar Repositório no GitHub
(Mesmos passos do Método 1, Passo 1)

### Passo 2: Configurar Git Local
Abra o PowerShell na pasta raiz do workspace e execute:

```powershell
# Navegar até a pasta do site
cd site-karina-franzin

# Inicializar repositório Git
git init

# Configurar seu nome e email (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - Site Karina Franzin"

# Adicionar o repositório remoto (substitua SEU-USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU-USUARIO/site-karina-franzin.git

# Renomear branch para main (se necessário)
git branch -M main

# Enviar para o GitHub
git push -u origin main
```

**Nota:** Quando pedir autenticação, use:
- **Username:** Seu username do GitHub
- **Password:** Use um **Personal Access Token** (não a senha)
  - Crie um token em: https://github.com/settings/tokens
  - Permissions: Marque `repo` (full control)

### Passo 3: Ativar GitHub Pages
(Mesmos passos do Método 1, Passo 3)

---

## 🌐 Domínio Customizado (Opcional)

### Se você tiver um domínio próprio (ex: karinafranlin.com):

1. No GitHub Pages settings, adicione seu domínio em **"Custom domain"**
2. No seu provedor de domínio (Registro.br, GoDaddy, etc.), adicione:
   - **Tipo A** apontando para:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME** `www` apontando para: `seu-usuario.github.io`

3. Marque **"Enforce HTTPS"** no GitHub

---

## 🔄 Atualizar o Site (Após Mudanças)

### Método 1 (Interface):
1. Vá até o repositório no GitHub
2. Clique no arquivo que quer editar
3. Clique no ícone de lápis (editar)
4. Faça as mudanças
5. Commit changes

### Método 2 (Git/PowerShell):
```powershell
cd site-karina-franzin

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push
```

Aguarde 1-2 minutos e as mudanças estarão no ar!

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Arquivos enviados
- [ ] GitHub Pages ativado
- [ ] Site acessível via URL
- [ ] Testado em mobile e desktop
- [ ] Links de WhatsApp funcionando
- [ ] Imagens carregando corretamente
- [ ] (Opcional) Domínio customizado configurado

---

## 🆘 Problemas Comuns

### Site não carrega (404)
- Verifique se GitHub Pages está ativado
- Confirme que o arquivo se chama `index.html` (minúsculo)
- Aguarde alguns minutos após ativar

### Imagens não aparecem
- Verifique os caminhos: devem ser relativos `./assets/img/`
- Confirme que as imagens foram commitadas

### CSS/JS não carrega
- Verifique os caminhos no HTML: `./css/styles.css` e `./js/main.js`
- Limpe o cache do navegador (Ctrl + Shift + R)

---

## 🎉 Pronto!

Seu site estará no ar em:
**https://seu-usuario.github.io/site-karina-franzin/**

Compartilhe esse link nas redes sociais da Karina! 🚀

---

**Precisa de ajuda?** Volte aqui e me pergunte!