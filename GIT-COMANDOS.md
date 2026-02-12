# 🔧 Git - Comandos Úteis para Atualizar o Site

## 📝 Workflow Normal (Use sempre que fizer mudanças)

```powershell
# 1. Navegar até a pasta
cd site-karina-franzin

# 2. Ver o que mudou
git status

# 3. Adicionar arquivos modificados
git add .

# 4. Salvar com descrição
git commit -m "Descrição clara do que mudou"

# 5. Enviar para GitHub
git push
```

**Aguarde 1-2 minutos → Site atualizado! 🚀**

---

## 🔄 Exemplos Práticos

### Trocar uma foto:
```powershell
cd site-karina-franzin
# (faça a troca da foto)
git add .
git commit -m "Atualizou foto do hero"
git push
```

### Mudar texto no HTML:
```powershell
cd site-karina-franzin
# (edite o index.html)
git add .
git commit -m "Atualizou texto da seção Sobre"
git push
```

### Mudar cores no CSS:
```powershell
cd site-karina-franzin
# (edite o styles.css)
git add .
git commit -m "Mudou cor primária para azul"
git push
```

### Adicionar depoimentos:
```powershell
cd site-karina-franzin
# (edite os depoimentos no HTML)
git add .
git commit -m "Adicionou depoimentos reais de alunos"
git push
```

---

## 📜 Ver Histórico (Todas as Versões)

```powershell
cd site-karina-franzin

# Histórico resumido
git log --oneline

# Histórico detalhado
git log

# Ver diferenças da última mudança
git diff
```

---

## ⏪ Voltar para Versão Anterior (RESTORE)

### Opção 1: Apenas Ver versão antiga (sem mudar)
```powershell
cd site-karina-franzin

# Ver histórico e copiar o código (ex: a1b2c3d)
git log --oneline

# Ver essa versão antiga
git checkout a1b2c3d

# Voltar para versão atual
git checkout main
```

### Opção 2: Desfazer última alteração
```powershell
cd site-karina-franzin

# Desfazer último commit (mas mantém arquivos editados)
git reset --soft HEAD~1

# Desfazer último commit E apagar mudanças
git reset --hard HEAD~1

# Enviar para GitHub
git push --force
```

### Opção 3: Restaurar um arquivo específico
```powershell
cd site-karina-franzin

# Restaurar arquivo para versão anterior
git checkout HEAD~1 -- index.html

# Ou restaurar de um commit específico
git checkout a1b2c3d -- css/styles.css
```

---

## 🌿 Trabalhar com Branches (Versões Paralelas)

### Criar uma versão de teste:
```powershell
cd site-karina-franzin

# Criar branch de teste
git checkout -b teste-nova-cor

# Fazer mudanças... editar arquivos...

# Salvar na branch de teste
git add .
git commit -m "Testando nova paleta de cores"
git push -u origin teste-nova-cor

# Voltar para versão principal
git checkout main
```

### Juntar branch de teste com a principal:
```powershell
cd site-karina-franzin

# Estar na branch principal
git checkout main

# Juntar a branch de teste
git merge teste-nova-cor

# Enviar
git push
```

---

## 🔍 Verificar Status

```powershell
cd site-karina-franzin

# Ver o que mudou
git status

# Ver diferenças específicas
git diff index.html
```

---

## 🆘 Comandos de Emergência

### ⚠️ IMPORTANTE: Entenda os 3 Momentos

| Momento | O que você fez | Onde está | Como voltar |
|---------|---------------|-----------|-------------|
| **1. Editou localmente** | Só editou arquivos | Apenas no seu PC | `git restore .` |
| **2. Fez commit** | `git commit` | No Git local | `git reset --hard HEAD~1` |
| **3. Fez push** | `git push` | No GitHub (online) | `git reset --hard HEAD~1` + `git push --force` |

---

### 🔄 MOMENTO 1: Desfazer mudanças locais (ANTES do commit)

**Situação:** Você editou arquivos, testou localmente e NÃO GOSTOU.

```powershell
cd site-karina-franzin

# Ver o que mudou (para ter certeza)
git status
git diff

# Descartar mudanças de UM arquivo específico
git restore index.html
# ou
git checkout -- index.html

# Descartar TODAS as mudanças de todos os arquivos
git restore .
# ou
git reset --hard
```

**Resultado:** Volta tudo como estava na última versão commitada! ✅

---

### 🔄 MOMENTO 2: Desfazer commit (MAS ainda não fez push)

**Situação:** Você fez `git commit` mas ainda NÃO fez `git push`.

```powershell
cd site-karina-franzin

# Opção A: Desfazer commit mas MANTER os arquivos editados
# (útil se quiser refazer o commit com mudanças)
git reset --soft HEAD~1

# Opção B: Desfazer commit E APAGAR todas as mudanças
# (volta tudo ao estado anterior)
git reset --hard HEAD~1
```

**Resultado:** Commit desfeito, arquivo volta ao estado anterior! ✅

---

### 🔄 MOMENTO 3: Desfazer push (JÁ está no GitHub)

**Situação:** Você fez `git push` e o site já está atualizado online.

```powershell
cd site-karina-franzin

# 1. Voltar para commit anterior
git reset --hard HEAD~1

# 2. Forçar GitHub a voltar também (CUIDADO!)
git push --force
```

**⚠️ ATENÇÃO:** `--force` sobrescreve o GitHub. Use com certeza!

---

### 🎯 Workflow Seguro (Recomendado)

```powershell
# PASSO 1: Editar arquivos
# (edite index.html, css, etc...)

# PASSO 2: Testar localmente
# (abra index.html no navegador)

# ❌ NÃO GOSTOU? Descartar tudo:
git restore .

# ✅ GOSTOU? Continuar...

# PASSO 3: Commitar localmente
git add .
git commit -m "Testando nova cor"

# PASSO 4: Testar mais uma vez localmente
# (ainda não está no GitHub, só no Git local)

# ❌ NÃO GOSTOU? Desfazer commit:
git reset --hard HEAD~1

# ✅ GOSTOU? Enviar para GitHub:
git push

# Agora sim está ONLINE! 🚀
```

### Atualizar do GitHub (pegar versão online):
```powershell
git pull origin main
```

### Forçar push (⚠️ CUIDADO! sobrescreve tudo):
```powershell
git push --force
```

### Ver mudanças não salvas:
```powershell
# Ver quais arquivos mudaram
git status

# Ver EXATAMENTE o que mudou linha por linha
git diff

# Ver mudanças de um arquivo específico
git diff index.html
```

### Comparar versões:
```powershell
# Comparar com commit anterior
git diff HEAD~1

# Comparar dois commits específicos
git diff a1b2c3d e4f5g6h
```

---

## 📊 Comandos Úteis

```powershell
# Ver configurações do Git
git config --list

# Ver URL do repositório remoto
git remote -v

# Ver todas as branches
git branch -a

# Renomear último commit
git commit --amend -m "Nova mensagem"

# Ver quem mudou cada linha de um arquivo
git blame index.html
```

---

## 🎯 Boas Práticas

### ✅ FAÇA:
- Commit frequente (cada mudança pequena)
- Mensagens claras: "Corrigiu bug no formulário"
- Testar localmente antes de fazer push
- Fazer backup antes de comandos --force

### ❌ NÃO FAÇA:
- Commits gigantes com muitas mudanças
- Mensagens vazias: "atualizações"
- Push sem testar
- `git push --force` sem certeza

---

## 🔄 Workflow Completo Recomendado

```powershell
# 1. Sempre começar atualizando
cd site-karina-franzin
git pull

# 2. Fazer suas mudanças nos arquivos...

# 3. Ver o que mudou
git status
git diff

# 4. Testar localmente (abrir index.html)

# 5. Se está OK, salvar
git add .
git commit -m "Descrição clara"

# 6. Enviar
git push

# 7. Aguardar 1-2 min e verificar site online
```

---

## 📞 Links Úteis

- **Repositório:** https://github.com/igorgr77-lang/site-karina-franzin
- **Site Online:** https://igorgr77-lang.github.io/site-karina-franzin/
- **Settings (GitHub Pages):** https://github.com/igorgr77-lang/site-karina-franzin/settings/pages

---

## 💡 Dica Extra: GitHub Desktop

Se preferir interface gráfica ao invés de comandos, baixe:
**GitHub Desktop:** https://desktop.github.com/

É mais visual e fácil de usar! 🖱️

---

**Precisa de ajuda com algum comando? Volte aqui e me pergunte!** 🚀