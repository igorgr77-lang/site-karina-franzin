# Script dedicado para testar o Painel Administrativo
Write-Host "🔐 Iniciando ambiente de teste do Painel Admin..." -ForegroundColor Cyan
Write-Host ""

# Porta do servidor
$port = 8080

# Verificar se a porta está em uso
$portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Porta $port já está em uso. Encerrando processo..." -ForegroundColor Yellow
    Stop-Process -Id $portInUse.OwningProcess -Force
    Start-Sleep -Seconds 1
}

Write-Host "🌐 Iniciando servidor HTTP local..." -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ PAINEL ADMINISTRATIVO DISPONÍVEL EM:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   🔐 Login Admin:  http://localhost:$port/admin/login.html" -ForegroundColor White
Write-Host "   📊 Dashboard:    http://localhost:$port/admin/" -ForegroundColor White
Write-Host "   ✏️  Editor:       http://localhost:$port/admin/editor.html" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 CREDENCIAIS DE TESTE:" -ForegroundColor Yellow
Write-Host "   Email: (use o email cadastrado no Supabase)" -ForegroundColor White
Write-Host "   Senha: (use a senha definida no Supabase)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Pressione CTRL+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Abrir navegador após 2 segundos
Start-Sleep -Seconds 2
Start-Process "http://localhost:$port/admin/login.html"

# Iniciar servidor HTTP
try {
    # Tentar usar Python
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCmd) {
        Write-Host "🐍 Usando Python HTTP Server..." -ForegroundColor Green
        python -m http.server $port
    } else {
        throw "Python não encontrado"
    }
} catch {
    Write-Host "⚠️  Python não encontrado. Tentando Node.js..." -ForegroundColor Yellow
    try {
        # Tentar npx http-server
        npx http-server -p $port
    } catch {
        Write-Host ""
        Write-Host "❌ ERRO: Nenhum servidor HTTP encontrado!" -ForegroundColor Red
        Write-Host ""
        Write-Host "📦 Por favor, instale uma das opções:" -ForegroundColor Yellow
        Write-Host "   1. Python: https://www.python.org/downloads/" -ForegroundColor White
        Write-Host "   2. Node.js: https://nodejs.org/" -ForegroundColor White
        Write-Host ""
        Read-Host "Pressione ENTER para sair"
    }
}
