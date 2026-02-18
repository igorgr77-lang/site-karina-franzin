# 📊 Google Analytics 4 - Guia Completo

## ✅ Status: IMPLEMENTADO

O Google Analytics 4 foi implementado com sucesso em **todas as páginas** do site karinafranzin.com.br.

---

## 🔑 Informações da Conta

- **ID de Medição:** `G-J488T0R72B`
- **Propriedade:** Site Karina Franzin
- **URL:** https://karinafranzin.com.br
- **Data de Implementação:** 18/02/2026

---

## 📄 Páginas com Analytics

✅ **Página Principal:**
- `/index.html`

✅ **Blog:**
- `/blog/index.html` (Lista de artigos)
- `/blog/como-comecar-a-correr-do-zero/index.html`
- `/blog/erros-comuns-corrida-iniciantes/index.html`
- `/blog/plano-de-treino-5km-para-iniciantes/index.html`
- `/blog/run-avoa-2026-votuporanga/index.html`

**Total:** 6 páginas rastreadas

---

## 🧪 Como Testar se o Analytics Está Funcionando

### Método 1: Teste em Tempo Real (RECOMENDADO)

1. Acesse o Google Analytics: https://analytics.google.com/
2. No menu esquerdo, clique em **"Relatórios" → "Tempo real"**
3. Abra o site em uma nova aba: https://karinafranzin.com.br
4. Navegue pelas páginas (home, blog, artigos)
5. **Você deve ver:**
   - Usuários ativos aumentarem (1, 2, 3...)
   - Páginas visualizadas aparecerem em tempo real
   - Eventos sendo registrados

### Método 2: Extensão do Navegador

1. Instale a extensão **"Google Analytics Debugger"** (Chrome/Edge)
2. Ative a extensão
3. Abra o site e abra o **Console do navegador** (F12)
4. Procure por mensagens de "Google Analytics"
5. Se aparecer logs do GA, está funcionando! ✅

### Método 3: Verificar o Código Fonte

1. Acesse qualquer página do site
2. Clique com botão direito → **"Exibir código-fonte"**
3. Procure por `G-J488T0R72B`
4. Se encontrar, o código está instalado! ✅

---

## 📈 O Que Você Pode Rastrear Agora

### 🎯 Métricas Automáticas (Já Funcionando):

1. **Usuários:**
   - Total de visitantes
   - Novos vs. recorrentes
   - Usuários ativos

2. **Páginas:**
   - Páginas mais visitadas
   - Tempo médio na página
   - Taxa de rejeição

3. **Origem do Tráfego:**
   - Google (pesquisa orgânica)
   - Redes sociais (Instagram, Facebook)
   - Direto (quem digita a URL)
   - Referências (outros sites)

4. **Dispositivos:**
   - Mobile vs. Desktop
   - Sistema operacional
   - Navegador usado

5. **Geografia:**
   - Países
   - Cidades (São Paulo, Votuporanga, etc.)

6. **Comportamento:**
   - Artigos mais lidos
   - Jornada do usuário no site
   - Cliques em links

---

## 🎯 Eventos Personalizados Configurados

### ✅ **Cliques no WhatsApp** - ATIVO

O site agora rastreia **automaticamente** todos os cliques nos botões do WhatsApp!

**O que é rastreado:**
- 📍 **Localização do botão:** De onde o usuário clicou
  - Botão flutuante (canto inferior direito)
  - Seção Hero (topo da página)
  - Seção de depoimentos
  - CTA no blog
  - CTA dentro dos artigos
  - Footer dos artigos
  
- 📄 **Página atual:** Qual página o usuário estava
- 🔤 **Texto do botão:** O que estava escrito no botão
- 💰 **Valor:** Cada clique vale 1 ponto

**Como ver no Analytics:**
1. Vá em **"Relatórios" → "Engajamento" → "Eventos"**
2. Procure pelo evento: `click_whatsapp`
3. Veja quantos cliques teve e de onde vieram!

**Evento enviado:**
```javascript
Nome: click_whatsapp
Categoria: Conversão
Label: (localização do botão)
Página: (URL da página)
Texto do botão: (texto do link)
```

---

### 🔜 Eventos Futuros (A implementar):

- 📞 **Formulários enviados** - Quando implementar formulário de contato
- 📥 **Downloads** - Se disponibilizar PDFs de planilhas
- ▶️ **Vídeos assistidos** - Quando adicionar vídeos
- 📱 **Cliques em redes sociais** - Instagram, Facebook

---

## 📊 Como Acessar os Relatórios

### 1. Painel Principal
```
https://analytics.google.com/
```

### 2. Principais Relatórios:

#### 📍 **Tempo Real**
- Veja quem está navegando AGORA
- Páginas sendo visualizadas no momento
- Localização dos visitantes

#### 📈 **Aquisição**
- De onde vêm seus visitantes
- Google Search, Instagram, direto, etc.

#### 👥 **Engajamento**
- Páginas mais visitadas
- Tempo médio de permanência
- Artigos mais populares

#### 💼 **Demografia**
- Idade e gênero dos visitantes
- Cidades e países

---

## ⏰ Quando os Dados Aparecem?

- **Tempo Real:** Imediato (segundos)
- **Relatórios Gerais:** 24-48 horas
- **Dados Completos:** Após 7 dias de coleta

---

## 🔒 Privacidade e LGPD

O Google Analytics 4 está configurado de acordo com as boas práticas:

✅ **Anonymize IP** - Ativado automaticamente no GA4
✅ **Sem cookies de terceiros desnecessários**
✅ **Conformidade com LGPD** - Dados agregados e anônimos

**Recomendação:** Adicionar uma Política de Privacidade no site mencionando o uso do Google Analytics.

---

## 🎓 Dicas de Uso

### 1️⃣ **Acompanhamento Semanal**
- Toda segunda-feira, verifique:
  - Quantos visitantes teve na semana
  - Quais artigos foram mais lidos
  - De onde vieram os visitantes

### 2️⃣ **Tome Decisões com Base em Dados**
- Artigo com muitas visitas? Crie conteúdo similar!
- Página com alta rejeição? Melhore o conteúdo
- Muito tráfego mobile? Teste mais no celular

### 3️⃣ **Configure Metas**
- Quantas visitas você quer por mês?
- Quantos cliques no WhatsApp?
- Acompanhe sua evolução!

---

## 📱 App Mobile do Google Analytics

Baixe o app para acompanhar seu site no celular:

- **Android:** https://play.google.com/store/apps/details?id=com.google.android.apps.giant
- **iOS:** https://apps.apple.com/app/google-analytics/id881599038

---

## 🆘 Problemas Comuns

### ❌ Não aparecem dados?
1. Aguarde 24-48h após a implementação
2. Verifique se você publicou as alterações no GitHub
3. Teste em modo anônimo do navegador
4. Verifique se tem bloqueador de anúncios ativo

### ❌ Aparece "Não recebendo dados"?
- Aguarde algumas horas
- Faça algumas visitas de teste ao site
- Verifique o relatório de Tempo Real

---

## 🔗 Links Úteis

- **Painel Analytics:** https://analytics.google.com/
- **Central de Ajuda:** https://support.google.com/analytics
- **Curso Grátis Google:** https://analytics.google.com/analytics/academy/

---

## 📝 Próximos Passos Recomendados

1. ✅ Google Analytics implementado
2. ✅ Rastreamento de cliques no WhatsApp configurado
3. ⏳ Aguardar 24-48h para primeiros dados
4. 🎯 Configurar metas personalizadas no painel do Analytics
5. 📊 Criar relatórios customizados
6. 🔗 Integrar com Google Search Console

---

## 🧪 Como Testar os Eventos (Cliques no WhatsApp)

### Teste Imediato:

1. **Abra o site** em uma aba: https://karinafranzin.com.br
2. **Abra o Console do navegador:**
   - Pressione `F12`
   - Vá na aba "Console"
3. **Clique em qualquer botão do WhatsApp** no site
4. **Você verá no console:**
   ```
   📊 Evento enviado ao Analytics: {
       evento: 'click_whatsapp',
       localizacao: 'botao_flutuante',
       pagina: '/',
       texto_botao: 'Falar com Karina'
   }
   ```

### Teste no Google Analytics (Tempo Real):

1. Acesse: https://analytics.google.com/
2. Vá em **"Relatórios" → "Tempo real" → "Visão geral dos eventos"**
3. Abra o site em outra aba
4. Clique em um botão do WhatsApp
5. **Em poucos segundos**, você verá o evento `click_whatsapp` aparecer!

### Ver Relatório Completo (após alguns dias):

1. Vá em **"Relatórios" → "Engajamento" → "Eventos"**
2. Procure o evento `click_whatsapp`
3. Clique nele para ver detalhes:
   - Total de cliques
   - De quais páginas vieram
   - Quais botões foram mais clicados
   - Evolução ao longo do tempo

---

## 💡 Como Usar Esses Dados

### 📊 Análise de Conversão:

**Exemplo de perguntas que você pode responder:**

1. **Quantas pessoas clicam no WhatsApp por dia/semana/mês?**
   - Veja a evolução e identifique dias/horários de pico

2. **Qual botão converte mais?**
   - Botão flutuante vs. botões nas seções
   - Identifique o que funciona melhor

3. **Quais artigos geram mais contatos?**
   - Compare cliques por página
   - Produza mais conteúdo similar aos que convertem

4. **Taxa de conversão:**
   - Visitantes ÷ Cliques no WhatsApp = % de conversão
   - Meta: Aumentar essa taxa ao longo do tempo

### 🎯 Tome Decisões:

- 📈 **Botão X converte muito?** → Destaque-o mais!
- 📉 **Página com poucos cliques?** → Melhore o conteúdo ou CTA
- 🔥 **Artigo gera muitos contatos?** → Crie conteúdo similar
- ⏰ **Mais cliques em certos horários?** → Programe posts nesse horário

---

**Documentação criada em:** 18/02/2026  
**Última atualização:** 18/02/2026 (Rastreamento de WhatsApp adicionado)
