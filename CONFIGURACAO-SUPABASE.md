# 🔧 Configuração do Supabase

## 📋 Instruções para Configurar o Ambiente

O arquivo `js/supabase-config.js` contém as credenciais do Supabase e **NÃO** está versionado no Git por questões de segurança.

### ✅ Como Configurar:

1. **Copie o arquivo de exemplo:**
   ```bash
   cp js/supabase-config.example.js js/supabase-config.js
   ```

2. **Obtenha as credenciais do Supabase:**
   - Acesse: https://supabase.com
   - Vá em **Project Settings** → **API**
   - Copie:
     - **Project URL** (exemplo: `https://tshvokbdnveagtxjsjww.supabase.co`)
     - **anon public key** (chave pública)

3. **Edite o arquivo `js/supabase-config.js`:**
   - Substitua `https://SEU-PROJETO.supabase.co` pela sua **Project URL**
   - Substitua `SUA-CHAVE-ANON-AQUI` pela sua **anon public key**

4. **Teste a configuração:**
   - Abra o navegador em: `http://localhost:8000/blog/index.html`
   - Pressione F12 para abrir o Console
   - Verifique se aparece: ✅ "Cliente Supabase inicializado com sucesso"

---

## 🔒 Segurança

- ✅ O arquivo `js/supabase-config.js` está no `.gitignore`
- ✅ Nunca faça commit deste arquivo
- ✅ A chave `anon` é pública e pode ser exposta no frontend
- ❌ NUNCA exponha a chave `service_role` no frontend

---

## 🆘 Problemas Comuns

### Erro: "Invalid API key"
- Verifique se a chave `SUPABASE_ANON_KEY` está correta
- Confirme que copiou a chave completa (sem espaços extras)

### Erro: "Failed to fetch"
- Verifique se a URL do Supabase está correta
- Confirme que o projeto Supabase está ativo

### Erro: "supabase is not defined"
- Verifique se o SDK do Supabase está sendo carregado antes do `supabase-config.js`
- Veja o arquivo HTML para confirmar a ordem dos scripts

---

## 📚 Referências

- Documentação do Supabase: https://supabase.com/docs
- Guia de setup completo: `SUPABASE-SETUP.md`
