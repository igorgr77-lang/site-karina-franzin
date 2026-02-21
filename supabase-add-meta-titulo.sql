-- ========================================
-- ADICIONAR CAMPO META_TITULO À TABELA ARTIGOS
-- ========================================
-- Execute este SQL no Supabase SQL Editor

-- Adicionar coluna meta_titulo (opcional)
ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS meta_titulo VARCHAR(60);

-- Comentário explicativo
COMMENT ON COLUMN artigos.meta_titulo IS 'Título otimizado para SEO (meta tag title). Se vazio, usa o título do artigo.';

-- Verificar se foi criado
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'artigos' 
AND column_name = 'meta_titulo';
