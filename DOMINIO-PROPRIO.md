# 🌐 Configurar Domínio Próprio no Site

## 📋 Visão Geral

Atualmente seu site está em:
- **URL atual:** https://igorgr77-lang.github.io/site-karina-franzin/

Com domínio próprio ficará:
- **URL personalizada:** https://karinafranlin.com (exemplo)
- **URL alternativa:** https://www.karinafranlin.com

---

## 💰 Passo 1: Registrar um Domínio

### Onde comprar domínios no Brasil:

#### 🇧🇷 **Registro.br** (Recomendado - Oficial brasileiro)
- **Site:** https://registro.br
- **Preço:** ~R$ 40/ano (.com.br) ou ~R$ 60/ano (.br)
- **Vantagens:** Brasileiro, barato, confiável
- **Sugestões de domínios:**
  - `karinafranlin.com.br`
  - `karinafranlin.br`
  - `karinafranzin.com.br`
  - `assessoriakarina.com.br`

#### 🌍 **Hostinger** (Domínios internacionais)
- **Site:** https://www.hostinger.com.br
- **Preço:** ~R$ 40-80/ano (.com)
- **Sugestões:**
  - `karinafranlin.com`
  - `karinafranzin.com`

#### 🌍 **GoDaddy**
- **Site:** https://www.godaddy.com/pt-br
- **Preço:** ~R$ 50-100/ano
- **Global e conhecido**

#### 🌍 **Namecheap**
- **Site:** https://www.namecheap.com
- **Preço:** ~$10-15/ano (USD)
- **Bom preço em .com**

---

## 🔧 Passo 2: Configurar DNS do Domínio

### Após comprar o domínio, você precisa configurar os DNS:

### Opção A: Domínio Apex (sem www)
**Exemplo:** `karinafranlin.com`

No painel do seu registrador (Registro.br, Hostinger, etc.), adicione estes registros DNS:

#### Registros tipo A (apontam para GitHub):
```
Tipo: A
Nome: @
Valor: 185.199.108.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.109.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.110.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.111.153
TTL: 3600
```

#### Registro CNAME (para www):
```
Tipo: CNAME
Nome: www
Valor: igorgr77-lang.github.io
TTL: 3600
```

---

### Opção B: Apenas com www
**Exemplo:** `www.karinafranlin.com`

```
Tipo: CNAME
Nome: www
Valor: igorgr77-lang.github.io
TTL: 3600
```

---

## 🎯 Passo 3: Configurar no GitHub Pages

### 1. Criar arquivo CNAME

Execute este comando no PowerShell:

```powershell
cd site-karina-franzin

# Substitua pelo seu domínio real
echo "karinafranlin.com" > CNAME

# Salvar no Git
git add CNAME
git commit -m "Adiciona domínio customizado"
git push
```

### 2. Configurar nas Settings do GitHub

1. Acesse: https://github.com/igorgr77-lang/site-karina-franzin/settings/pages

2. Em **"Custom domain"**, digite seu domínio:
   - `karinafranlin.com` (sem https://)

3. Clique em **"Save"**

4. Aguarde a verificação (pode levar alguns minutos)

5. Depois que verificar, marque:
   - ✅ **"Enforce HTTPS"** (SSL grátis!)

---

## ⏱️ Passo 4: Aguardar Propagação

### Tempo de espera:
- **Mínimo:** 15-30 minutos
- **Normal:** 2-4 horas
- **Máximo:** 24-48 horas

### Como verificar se propagou:
1. Acesse: https://dnschecker.org/
2. Digite seu domínio
3. Veja se os IPs do GitHub aparecem

---

## 📋 Guia Passo a Passo por Registrador

### 🇧🇷 Registro.br

1. **Comprar domínio:**
   - Acesse: https://registro.br
   - Pesquise: `karinafranlin.com.br`
   - Siga o processo de compra

2. **Configurar DNS:**
   - Acesse: https://registro.br/painel
   - Clique no domínio
   - Vá em **"DNS"** ou **"Editar Zona"**
   - Adicione os registros A e CNAME listados acima
   - Salve

3. **Aguarde propagação** (2-4 horas)

---

### 🌍 Hostinger

1. **Comprar domínio:**
   - Acesse: https://www.hostinger.com.br
   - Pesquise seu domínio
   - Complete a compra

2. **Configurar DNS:**
   - Painel Hostinger > **Domínios**
   - Clique no domínio > **DNS/Nameservers**
   - **Gerenciar DNS**
   - Adicione os registros A e CNAME
   - Salve

3. **Aguarde propagação**

---

### 🌍 GoDaddy

1. **Comprar domínio:**
   - Acesse: https://www.godaddy.com/pt-br
   - Pesquise e compre

2. **Configurar DNS:**
   - Meus Produtos > **Domínios**
   - Clique no domínio > **Gerenciar DNS**
   - Adicione os registros A e CNAME
   - Salve

3. **Aguarde propagação**

---

## ✅ Verificar se Funcionou

### Depois de 2-4 horas:

1. **Teste o domínio:**
   - Acesse: `https://seudominio.com`
   - Deve aparecer o site da Karina!

2. **Teste com www:**
   - Acesse: `https://www.seudominio.com`
   - Deve redirecionar e funcionar

3. **Verifique HTTPS:**
   - O cadeado verde deve aparecer
   - Se não aparecer, aguarde mais um pouco

---

## 🔒 HTTPS/SSL Grátis

O GitHub Pages oferece **SSL grátis** via Let's Encrypt!

**Depois que o domínio propagar:**
1. Vá em: https://github.com/igorgr77-lang/site-karina-franzin/settings/pages
2. Marque: ✅ **"Enforce HTTPS"**
3. Aguarde 10-20 minutos
4. Site com HTTPS funcionando!

---

## 💡 Dicas e Recomendações

### ✅ Sugestões de domínios:

**Opção 1 - Nome da Karina:**
- `karinafranlin.com.br` ⭐ (Recomendado)
- `karinafranzin.com.br`
- `karinafranlin.com`

**Opção 2 - Foco no serviço:**
- `assessoriakarina.com.br`
- `treinarcomkarina.com.br`
- `corredoraelite.com.br`

**Opção 3 - Curto e direto:**
- `kfranlin.com.br`
- `karina.run`
- `karinarun.com.br`

### 💰 Custos anuais:
- `.com.br`: ~R$ 40/ano
- `.br`: ~R$ 60/ano
- `.com`: ~R$ 60-100/ano

### 🎯 Melhor opção:
**`karinafranlin.com.br`** no Registro.br
- ✅ Barato (R$ 40/ano)
- ✅ Brasileiro e confiável
- ✅ Profissional
- ✅ Fácil de lembrar

---

## 📝 Exemplo Completo de Configuração

### Domínio escolhido: `karinafranlin.com.br`

#### 1. No Registro.br (DNS):
```
Tipo: A     | Nome: @   | Valor: 185.199.108.153
Tipo: A     | Nome: @   | Valor: 185.199.109.153
Tipo: A     | Nome: @   | Valor: 185.199.110.153
Tipo: A     | Nome: @   | Valor: 185.199.111.153
Tipo: CNAME | Nome: www | Valor: igorgr77-lang.github.io
```

#### 2. Criar arquivo CNAME:
```powershell
cd site-karina-franzin
echo "karinafranlin.com.br" > CNAME
git add CNAME
git commit -m "Adiciona domínio karinafranlin.com.br"
git push
```

#### 3. No GitHub Pages:
- Custom domain: `karinafranlin.com.br`
- Enforce HTTPS: ✅

#### 4. Aguardar 2-4 horas

#### 5. Testar:
- https://karinafranlin.com.br ✅
- https://www.karinafranlin.com.br ✅

---

## 🆘 Problemas Comuns

### Site não carrega (404)
- Verifique se o arquivo CNAME foi criado
- Confirme que fez o push: `git push`
- Aguarde mais tempo (até 24h)

### "DNS_PROBE_FINISHED_NXDOMAIN"
- DNS ainda não propagou
- Verifique os registros no registrador
- Aguarde mais tempo

### HTTPS não funciona
- Aguarde a propagação completa do DNS
- Depois marque "Enforce HTTPS" no GitHub
- Aguarde mais 10-20 minutos

### www não funciona
- Verifique o registro CNAME para www
- Valor deve ser: `igorgr77-lang.github.io`

---

## 🎉 Resultado Final

Depois de configurado, você terá:

✅ **Domínio profissional:** https://karinafranlin.com.br
✅ **HTTPS grátis** (cadeado verde)
✅ **www funcionando:** https://www.karinafranlin.com.br
✅ **Fácil de compartilhar** nas redes sociais
✅ **Credibilidade profissional**

---

## 📞 Próximos Passos

1. **Decidir qual domínio comprar**
2. **Comprar no registrador** (Registro.br recomendado)
3. **Configurar DNS** (seguir este guia)
4. **Criar arquivo CNAME** (comando pronto acima)
5. **Configurar GitHub Pages**
6. **Aguardar propagação**
7. **Testar e compartilhar!** 🚀

---

**Precisa de ajuda em algum passo específico? Me chame!** 😊