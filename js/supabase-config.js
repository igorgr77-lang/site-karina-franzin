// CONFIGURACAO DO SUPABASE
// Arquivo de configuracao central para o cliente Supabase

// Credenciais do Supabase (obtidas do projeto)
const SUPABASE_URL = 'https://tshvokbdnveagtxjsjww.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaHZva2JkbnZlYWd0eGpzand3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzIwMzQsImV4cCI6MjA4NzIwODAzNH0.Wv1rvB6qGAvmTOUbYRWaJNGw-uHdhZ90T6PW-0_XAIE';

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
