-- ========================================
-- ADICIONAR CAMPO SUBTITULO À TABELA ARTIGOS
-- ========================================
-- Execute este SQL no Supabase SQL Editor

-- Adicionar coluna subtitulo (opcional)
ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS subtitulo TEXT;

-- Comentário explicativo
COMMENT ON COLUMN artigos.subtitulo IS 'Texto introdutório que aparece no topo da página do artigo (entre título e conteúdo)';

-- Verificar se foi criado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'artigos' 
AND column_name = 'subtitulo';
