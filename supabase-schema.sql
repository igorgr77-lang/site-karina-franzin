-- ============================================
-- SCHEMA SUPABASE - CMS BLOG KARINA FRANZIN
-- ============================================
-- Data: 20/02/2026
-- Descrição: Estrutura completa do banco de dados
-- ============================================

-- ============================================
-- 1. TABELA: artigos
-- ============================================
-- Armazena todos os artigos do blog

CREATE TABLE IF NOT EXISTS public.artigos (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- URL amigável (ex: "como-comecar-a-correr")
  
  -- Conteúdo
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL, -- Descrição curta para o card
  conteudo TEXT NOT NULL, -- HTML completo do artigo
  
  -- Imagens
  imagem_card TEXT NOT NULL, -- URL da imagem do card (300x200px)
  imagem_cabecalho TEXT, -- URL da imagem do cabeçalho do artigo (1200x400px)
  
  -- SEO
  meta_description TEXT, -- Meta description para SEO (150-160 caracteres)
  palavras_chave TEXT[], -- Array de palavras-chave
  
  -- Controle
  publicado BOOLEAN DEFAULT false, -- Se está visível no site
  autor TEXT DEFAULT 'Karina Franzin',
  data_publicacao TIMESTAMPTZ DEFAULT NOW(),
  data_atualizacao TIMESTAMPTZ DEFAULT NOW(),
  visualizacoes INTEGER DEFAULT 0, -- Contador de visualizações
  
  -- Auditoria
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  criado_por UUID REFERENCES auth.users(id)
);

-- ============================================
-- 2. ÍNDICES (Performance)
-- ============================================

-- Busca rápida por slug (usado nas URLs)
CREATE INDEX IF NOT EXISTS idx_artigos_slug ON public.artigos(slug);

-- Listagem de artigos publicados (página do blog)
CREATE INDEX IF NOT EXISTS idx_artigos_publicado ON public.artigos(publicado) WHERE publicado = true;

-- Ordenação por data de publicação
CREATE INDEX IF NOT EXISTS idx_artigos_data_publicacao ON public.artigos(data_publicacao DESC);

-- Busca por palavras-chave (SEO)
CREATE INDEX IF NOT EXISTS idx_artigos_palavras_chave ON public.artigos USING GIN(palavras_chave);

-- ============================================
-- 3. TRIGGER: Atualizar timestamp automaticamente
-- ============================================

-- Função que atualiza o campo 'atualizado_em'
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que executa a função antes de UPDATE
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.artigos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Ativar RLS na tabela
ALTER TABLE public.artigos ENABLE ROW LEVEL SECURITY;

-- Política 1: Leitura pública (apenas artigos publicados)
CREATE POLICY "Artigos publicados são visíveis para todos"
  ON public.artigos
  FOR SELECT
  USING (publicado = true);

-- Política 2: Leitura completa para autenticados (painel admin)
CREATE POLICY "Usuários autenticados veem todos os artigos"
  ON public.artigos
  FOR SELECT
  TO authenticated
  USING (true);

-- Política 3: Criação apenas para autenticados
CREATE POLICY "Usuários autenticados podem criar artigos"
  ON public.artigos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política 4: Atualização apenas para autenticados
CREATE POLICY "Usuários autenticados podem atualizar artigos"
  ON public.artigos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política 5: Exclusão apenas para autenticados
CREATE POLICY "Usuários autenticados podem deletar artigos"
  ON public.artigos
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 5. FUNÇÃO: Gerar slug automaticamente
-- ============================================

-- Remove acentos e caracteres especiais, converte para URL amigável
CREATE OR REPLACE FUNCTION public.gerar_slug(texto TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(texto);
  
  -- Substituir acentos
  slug := translate(slug, 
    'áàâãäéèêëíìîïóòôõöúùûüçñ',
    'aaaaaeeeeiiiiooooouuuucn'
  );
  
  -- Remover caracteres especiais (manter apenas letras, números e espaços)
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  
  -- Substituir espaços por hífens
  slug := regexp_replace(slug, '\s+', '-', 'g');
  
  -- Remover hífens duplicados
  slug := regexp_replace(slug, '-+', '-', 'g');
  
  -- Remover hífens no início e fim
  slug := trim(both '-' from slug);
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- 6. FUNÇÃO: Incrementar visualizações
-- ============================================

CREATE OR REPLACE FUNCTION public.incrementar_visualizacoes(artigo_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.artigos
  SET visualizacoes = visualizacoes + 1
  WHERE id = artigo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. VIEW: Estatísticas do Blog
-- ============================================

CREATE OR REPLACE VIEW public.estatisticas_blog AS
SELECT
  COUNT(*) FILTER (WHERE publicado = true) AS total_publicados,
  COUNT(*) FILTER (WHERE publicado = false) AS total_rascunhos,
  COUNT(*) AS total_artigos,
  SUM(visualizacoes) AS total_visualizacoes,
  MAX(data_publicacao) AS ultimo_artigo
FROM public.artigos;

-- ============================================
-- 8. DADOS INICIAIS (Artigos existentes)
-- ============================================

-- Artigo 1: Como Começar a Correr do Zero
INSERT INTO public.artigos (
  slug,
  titulo,
  resumo,
  conteudo,
  imagem_card,
  imagem_cabecalho,
  meta_description,
  palavras_chave,
  publicado,
  data_publicacao
) VALUES (
  'como-comecar-a-correr-do-zero',
  'Como Começar a Correr do Zero: Guia Completo para Iniciantes',
  'Descubra como iniciar na corrida de forma segura e eficiente. Um guia passo a passo para quem nunca correu.',
  '', -- Será preenchido via migração
  '/assets/img/cabecalho-correr-do-zero.jpg',
  '/assets/img/cabecalho-correr-do-zero.jpg',
  'Guia completo para iniciantes na corrida. Aprenda a começar do zero com segurança, motivação e resultados rápidos.',
  ARRAY['corrida', 'iniciantes', 'treino', 'começar a correr', 'running'],
  true,
  '2026-01-15 10:00:00-03'
);

-- Artigo 2: 10 Erros Comuns na Corrida
INSERT INTO public.artigos (
  slug,
  titulo,
  resumo,
  conteudo,
  imagem_card,
  imagem_cabecalho,
  meta_description,
  palavras_chave,
  publicado,
  data_publicacao
) VALUES (
  'erros-comuns-corrida-iniciantes',
  '10 Erros Comuns que Iniciantes Cometem na Corrida (e Como Evitá-los)',
  'Evite os erros mais frequentes dos corredores iniciantes e evolua mais rápido com essas dicas práticas.',
  '', -- Será preenchido via migração
  '/assets/img/cabecalho-10-erros-comuns.jpg',
  '/assets/img/cabecalho-10-erros-comuns.jpg',
  'Descubra os 10 erros mais comuns de iniciantes na corrida e como evitá-los para progredir com segurança.',
  ARRAY['corrida', 'erros', 'iniciantes', 'dicas', 'treino'],
  true,
  '2026-01-20 10:00:00-03'
);

-- Artigo 3: Plano de Treino 5km
INSERT INTO public.artigos (
  slug,
  titulo,
  resumo,
  conteudo,
  imagem_card,
  imagem_cabecalho,
  meta_description,
  palavras_chave,
  publicado,
  data_publicacao
) VALUES (
  'plano-de-treino-5km-para-iniciantes',
  'Plano de Treino de 5km para Iniciantes: Corra Sua Primeira Prova',
  'Programa completo de 8 semanas para você completar sua primeira corrida de 5km com confiança.',
  '', -- Será preenchido via migração
  '/assets/img/cabecalho-plano-treino-5km.jpg',
  '/assets/img/cabecalho-plano-treino-5km.jpg',
  'Plano de treino gratuito de 8 semanas para correr 5km. Perfeito para iniciantes que querem completar a primeira prova.',
  ARRAY['5km', 'plano de treino', 'iniciantes', 'corrida', 'primeira prova'],
  true,
  '2026-01-25 10:00:00-03'
);

-- Artigo 4: RUN AVOA 2026
INSERT INTO public.artigos (
  slug,
  titulo,
  resumo,
  conteudo,
  imagem_card,
  imagem_cabecalho,
  meta_description,
  palavras_chave,
  publicado,
  data_publicacao
) VALUES (
  'run-avoa-2026-votuporanga',
  'RUN AVOA 2026 Votuporanga: Tudo Sobre a Prova + Dicas de Preparação',
  'Inscrições abertas para a RUN AVOA 2026! Veja detalhes da prova, percurso e como se preparar.',
  '', -- Será preenchido via migração
  '/assets/img/cabecalho-run-avoa-2026.jpg',
  '/assets/img/cabecalho-run-avoa-2026.jpg',
  'RUN AVOA 2026 Votuporanga: inscrições, percurso, dicas e tudo que você precisa saber sobre a prova.',
  ARRAY['run avoa', 'votuporanga', 'corrida de rua', 'prova', '2026'],
  true,
  '2026-02-10 10:00:00-03'
);

-- ============================================
-- ✅ SETUP COMPLETO!
-- ============================================
-- 
-- Próximos passos:
-- 1. Configure o Storage (bucket 'blog-images')
-- 2. Crie o usuário da Karina
-- 3. Copie as credenciais da API
-- 4. Prossiga para Fase 2 (Painel Admin)
-- ============================================
