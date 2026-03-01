// CONFIGURACAO DO SUPABASE - EXEMPLO
// Arquivo de configuracao central para o cliente Supabase
// 
// INSTRUCOES:
// 1. Copie este arquivo para: js/supabase-config.js
// 2. Substitua as credenciais pelos valores reais do seu projeto Supabase
// 3. As credenciais podem ser obtidas em: Project Settings > API no painel do Supabase

// Credenciais do Supabase (obtidas do projeto)
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-CHAVE-ANON-AQUI';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar se inicializou corretamente
if (!supabase) {
    console.error('Erro ao inicializar cliente Supabase');
} else {
    console.log('Cliente Supabase inicializado com sucesso');
}

// Exportar para uso global
window.supabase = supabase;
