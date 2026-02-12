# ☁️ Configurar Cloudflare com Registro.br e GitHub Pages

## 🎯 Objetivo

Conectar o domínio **karinafranzin.com.br** (Registro.br) ao GitHub Pages usando Cloudflare como ponte.

---

## ✅ Vantagens do Cloudflare

- 🚀 **CDN Global** - Site carrega rápido em todo o mundo
- 🔒 **SSL/HTTPS Grátis** - Cadeado verde automático
- 🛡️ **Proteção DDoS** - Segurança contra ataques
- 📊 **Analytics** - Estatísticas de visitantes
- ⚡ **Cache** - Performance otimizada
- 🌐 **DNS rápido** - Propagação mais rápida

---

## 📋 Pré-requisitos

✅ Domínio comprado: `karinafranzin.com.br` (Registro.br)  
✅ Site no GitHub: https://github.com/igorgr77-lang/site-karina-franzin  
✅ GitHub Pages ativo: https://igorgr77-lang.github.io/site-karina-franzin/  

---

## 🔧 PASSO 1: Criar Conta no Cloudflare

### 1.1 Cadastro
1. Acesse: https://dash.cloudflare.com/sign-up
2. Preencha:
   - Email: `igor.gr77@gmail.com` (ou seu email preferido)
   - Senha: (escolha uma senha forte)
3. Confirme o email

### 1.2 Adicionar Site
1. No painel Cloudflare, clique em **"Add a Site"**
2. Digite: `karinafranzin.com.br`
3. Clique em **"Add site"**

### 1.3 Escolher Plano
1. Selecione: **"Free"** (gratuito)
2. Clique em **"Continue"**

---

## 🌐 PASSO 2: Configurar DNS no Cloudflare

### 2.1 Cloudflare vai escanear seu DNS atual
- Aguarde o scan terminar (1-2 minutos)
- Pode aparecer alguns registros ou nenhum (normal)

### 2.2 Adicionar/Editar Registros DNS

No painel DNS do Cloudflare, configure EXATAMENTE assim:

#### Registros para adicionar:

| Tipo | Nome | Conteúdo | Proxy Status | TTL |
|------|------|----------|--------------|-----|
| A | @ | 185.199.108.153 | 🟠 Proxied | Auto |
| A | @ | 185.199.109.153 | 🟠 Proxied | Auto |
| A | @ | 185.199.110.153 | 🟠 Proxied | Auto |
| A | @ | 185.199.111.153 | 🟠 Proxied | Auto |
| CNAME | www | igorgr77-lang.github.io | 🟠 Proxied | Auto |

**⚠️ IMPORTANTE:** Certifique-se que **Proxy status** está em **Proxied** (nuvem laranja 🟠)

### 2.3 Como adicionar cada registro:

1. Clique em **"Add record"**
2. **Type:** Selecione `A` ou `CNAME`
3. **Name:** Digite `@` (para raiz) ou `www`
4. **IPv4 address/Target:** Digite o IP ou domínio
5. **Proxy status:** Clique até ficar **laranja (Proxied)**
6. Clique em **"Save"**
7. Repita para todos os registros

### 2.4 Remover registros antigos (se houver)
- Delete qualquer registro antigo que aponte para outros lugares
- Mantenha apenas os registros listados acima

### 2.5 Continuar
- Clique em **"Continue"**

---

## 📡 PASSO 3: Mudar Nameservers no Registro.br

### 3.1 Cloudflare vai mostrar os nameservers

Você verá algo como:
```
abby.ns.cloudflare.com
aron.ns.cloudflare.com
```

**⚠️ IMPORTANTE:** Copie EXATAMENTE esses nameservers (vão ser diferentes para você)

### 3.2 Acessar Painel do Registro.br

1. Acesse: https://registro.br/
2. Faça login com sua conta
3. Vá em **"Painel de Controle"**
4. Clique no domínio: `karinafranzin.com.br`

### 3.3 Alterar DNS/Nameservers

1. Procure por **"DNS"** ou **"Alterar Servidores DNS"**
2. Selecione **"Usar outros servidores DNS"** ou **"Custom DNS"**
3. **Remova os nameservers atuais** do Registro.br
4. **Adicione os nameservers do Cloudflare:**
   - Nameserver 1: `abby.ns.cloudflare.com` (substitua pelo seu)
   - Nameserver 2: `aron.ns.cloudflare.com` (substitua pelo seu)
5. Clique em **"Salvar"** ou **"Alterar"**

### 3.4 Confirmar no Registro.br
- Pode pedir confirmação por email ou token
- Confirme a alteração

---

## ⏱️ PASSO 4: Aguardar Propagação

### 4.1 Voltar ao Cloudflare
1. No painel do Cloudflare, clique em **"Done, check nameservers"**
2. Cloudflare vai verificar periodicamente (pode levar até 24h)

### 4.2 Tempo de espera:
- **Mínimo:** 15 minutos
- **Normal:** 2-4 horas
- **Máximo:** 24-48 horas

### 4.3 Cloudflare vai te avisar por email quando ativar! 📧

---

## 🔧 PASSO 5: Criar arquivo CNAME no GitHub

### 5.1 Executar no PowerShell:

```powershell
cd site-karina-franzin

# Criar arquivo CNAME com o domínio
echo "karinafranzin.com.br" > CNAME

# Adicionar ao Git
git add CNAME

# Commitar
git commit -m "Adiciona domínio karinafranzin.com.br"

# Enviar para GitHub
git push
```

---

## 🎯 PASSO 6: Configurar Custom Domain no GitHub Pages

### 6.1 Acessar Settings
1. Vá para: https://github.com/igorgr77-lang/site-karina-franzin/settings/pages

### 6.2 Configurar Custom Domain
1. Em **"Custom domain"**, digite: `karinafranzin.com.br`
2. Clique em **"Save"**
3. Aguarde a verificação (pode levar alguns minutos)
4. Quando verificar, aparecerá: ✅ **DNS check successful**

### 6.3 Enforce HTTPS
1. ⚠️ **AGUARDE** a verificação DNS terminar primeiro
2. Depois marque: ✅ **"Enforce HTTPS"**
3. Se não conseguir marcar ainda, aguarde mais alguns minutos

---

## ⚙️ PASSO 7: Configurações Extras do Cloudflare (Recomendado)

### 7.1 SSL/TLS

1. No painel Cloudflare, vá em **"SSL/TLS"**
2. Em **"Overview"**, selecione: **"Full"** ou **"Full (strict)"**
3. Isso garante HTTPS end-to-end

### 7.2 Always Use HTTPS

1. Vá em **"SSL/TLS"** > **"Edge Certificates"**
2. Ative: ✅ **"Always Use HTTPS"**
3. Isso força HTTPS em todas as páginas

### 7.3 Auto Minify (Otimização)

1. Vá em **"Speed"** > **"Optimization"**
2. Em **"Auto Minify"**, marque:
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML
3. Isso reduz o tamanho dos arquivos

### 7.4 Brotli (Compressão)

1. Em **"Speed"** > **"Optimization"**
2. Ative: ✅ **"Brotli"**
3. Compressão melhor que Gzip

### 7.5 Cache Level

1. Vá em **"Caching"** > **"Configuration"**
2. **Caching Level:** Standard
3. **Browser Cache TTL:** Respect Existing Headers

---

## ✅ PASSO 8: Testar o Site

### 8.1 Depois que Cloudflare ativar (email de confirmação):

**Teste estes URLs:**

1. **http://karinafranzin.com.br**
   - Deve redirecionar para HTTPS automaticamente

2. **https://karinafranzin.com.br**
   - Deve carregar o site com cadeado verde 🔒

3. **https://www.karinafranzin.com.br**
   - Deve funcionar também

### 8.2 Verificar HTTPS

1. Clique no cadeado verde na barra de endereço
2. Deve mostrar: **"Connection is secure"**
3. Certificado emitido por: **Cloudflare**

### 8.3 Verificar DNS

1. Acesse: https://dnschecker.org/
2. Digite: `karinafranzin.com.br`
3. Tipo: `A`
4. Deve mostrar IPs do Cloudflare (não do GitHub)

---

## 📊 PASSO 9: Configurar Analytics (Opcional)

### 9.1 Analytics do Cloudflare

1. No painel Cloudflare, vá em **"Analytics"**
2. Veja estatísticas de:
   - Visitas
   - Bandwidth
   - Requests
   - Países de origem

### 9.2 Google Analytics (Recomendado)

Para métricas mais detalhadas:

1. Crie conta em: https://analytics.google.com/
2. Crie uma propriedade para `karinafranzin.com.br`
3. Copie o código de tracking (GA4)
4. Adicione no `<head>` do `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔍 Verificação Final - Checklist

Depois de tudo configurado, verifique:

- [ ] Nameservers do Cloudflare ativos no Registro.br
- [ ] DNS configurado no Cloudflare (4 A + 1 CNAME)
- [ ] Proxy status em Proxied (🟠 laranja)
- [ ] Arquivo CNAME criado e enviado para GitHub
- [ ] Custom domain configurado no GitHub Pages
- [ ] Enforce HTTPS ativado no GitHub
- [ ] SSL/TLS em "Full" no Cloudflare
- [ ] Always Use HTTPS ativado no Cloudflare
- [ ] Site acessível em https://karinafranzin.com.br
- [ ] Site acessível em https://www.karinafranzin.com.br
- [ ] HTTPS funcionando (cadeado verde)
- [ ] Auto Minify e Brotli ativos (performance)

---

## 🆘 Problemas Comuns

### Site não carrega (DNS_PROBE_FINISHED_NXDOMAIN)
- **Causa:** Nameservers ainda não propagaram
- **Solução:** Aguarde mais tempo (até 24h)
- **Verificar:** Confira nameservers no Registro.br

### Site carrega mas sem HTTPS
- **Causa:** SSL ainda não ativou
- **Solução:** 
  1. Cloudflare: SSL/TLS → Full
  2. GitHub: Enforce HTTPS
  3. Aguarde 10-20 minutos

### "Too many redirects"
- **Causa:** Configuração SSL errada
- **Solução:** Cloudflare → SSL/TLS → Mudar para "Full"

### www não funciona
- **Causa:** Falta registro CNAME
- **Solução:** Adicionar CNAME www → igorgr77-lang.github.io

### GitHub não aceita custom domain
- **Causa:** Arquivo CNAME não foi enviado
- **Solução:** Verificar se arquivo CNAME existe e fazer git push

---

## 📈 Benefícios Finais

Depois de configurado, você terá:

✅ **Domínio profissional:** https://karinafranzin.com.br  
✅ **HTTPS grátis e automático** (Cloudflare SSL)  
✅ **Site super rápido** (CDN global)  
✅ **Proteção contra ataques** (DDoS protection)  
✅ **Analytics grátis** (estatísticas de visitas)  
✅ **Otimização automática** (minify, brotli, cache)  
✅ **Credibilidade profissional** (domínio próprio)  

---

## 🎉 Resultado Final

**URL antiga:**
https://igorgr77-lang.github.io/site-karina-franzin/

**URL nova:**
https://karinafranzin.com.br

Muito mais profissional e fácil de compartilhar! 🚀

---

## 📞 Próximos Passos

1. ☁️ Criar conta no Cloudflare
2. 🌐 Adicionar site karinafranzin.com.br
3. 📡 Configurar DNS no Cloudflare
4. 🔄 Mudar nameservers no Registro.br
5. ⏱️ Aguardar propagação (2-4 horas)
6. 📝 Criar arquivo CNAME (comando pronto abaixo)
7. ⚙️ Configurar GitHub Pages
8. ✅ Testar e compartilhar!

---

**Precisa de ajuda em algum passo? Me chame!** 😊