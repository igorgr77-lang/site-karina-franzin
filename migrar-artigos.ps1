# ========================================
# SCRIPT DE MIGRACAO DE CONTEUDO DOS ARTIGOS
# ========================================
# Extrai o conteudo dos HTMLs estaticos e atualiza no Supabase

Write-Host "Iniciando migracao de artigos..." -ForegroundColor Cyan
Write-Host ""

# Configuração do Supabase
$SUPABASE_URL = "https://tshvokbdnveagtxjsjww.supabase.co"
$SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaHZva2JkbnZlYWd0eGpzand3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzIwMzQsImV4cCI6MjA4NzIwODAzNH0.Wv1rvB6qGAvmTOUbYRWaJNGw-uHdhZ90T6PW-0_XAIE"

# Mapeamento de artigos
$artigos = @(
    @{
        slug = "como-comecar-a-correr-do-zero"
        path = "blog/como-comecar-a-correr-do-zero/index.html"
    },
    @{
        slug = "erros-comuns-corrida-iniciantes"
        path = "blog/erros-comuns-corrida-iniciantes/index.html"
    },
    @{
        slug = "plano-de-treino-5km-para-iniciantes"
        path = "blog/plano-de-treino-5km-para-iniciantes/index.html"
    },
    @{
        slug = "run-avoa-2026-votuporanga"
        path = "blog/run-avoa-2026-votuporanga/index.html"
    }
)

$sucessos = 0
$erros = 0

foreach ($artigo in $artigos) {
    Write-Host "Processando: $($artigo.slug)..." -ForegroundColor Yellow
    
    try {
        # Ler arquivo HTML
        $htmlContent = Get-Content -Path $artigo.path -Raw -Encoding UTF8
        
        # Extrair conteúdo entre <article> e </article>
        if ($htmlContent -match '(?s)<article[^>]*>(.*?)</article>') {
            $conteudo = $matches[1].Trim()
            
            # Preparar JSON para update
            $body = @{
                conteudo = $conteudo
            } | ConvertTo-Json -Depth 10
            
            # Fazer requisição ao Supabase
            $headers = @{
                "apikey" = $SUPABASE_KEY
                "Authorization" = "Bearer $SUPABASE_KEY"
                "Content-Type" = "application/json"
                "Prefer" = "return=minimal"
            }
            
            $uri = "$SUPABASE_URL/rest/v1/artigos?slug=eq.$($artigo.slug)"
            
            Invoke-RestMethod -Uri $uri -Method PATCH -Headers $headers -Body $body
            
            Write-Host "   OK - Conteudo atualizado! ($($conteudo.Length) caracteres)" -ForegroundColor Green
            $sucessos++
        }
        else {
            Write-Host "   ERRO - Nao foi possivel extrair conteudo" -ForegroundColor Red
            $erros++
        }
    }
    catch {
        Write-Host "   ERRO - $($_.Exception.Message)" -ForegroundColor Red
        $erros++
    }
    
    Write-Host ""
}

# Resumo
Write-Host "=================================================" -ForegroundColor Gray
Write-Host "RESUMO DA MIGRACAO:" -ForegroundColor Cyan
Write-Host "   Sucessos: $sucessos" -ForegroundColor Green
Write-Host "   Erros: $erros" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Gray
Write-Host ""

if ($erros -eq 0) {
    Write-Host "Migracao concluida com sucesso!" -ForegroundColor Green
    Write-Host "   Verifique o painel admin ou o Supabase para conferir!" -ForegroundColor White
}
else {
    Write-Host "Migracao concluida com erros. Verifique os logs acima." -ForegroundColor Yellow
}
