# Script para rodar servidor HTTP local e abrir o site
Write-Host "🚀 Iniciando servidor local para o site Karina Franzin..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
$currentPath = Get-Location
Write-Host "📁 Pasta atual: $currentPath" -ForegroundColor Yellow

# Porta do servidor
$port = 8080

# Verificar se a porta está em uso
$portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Porta $port já está em uso. Encerrando processo..." -ForegroundColor Yellow
    Stop-Process -Id $portInUse.OwningProcess -Force
    Start-Sleep -Seconds 1
}

Write-Host "🌐 Iniciando servidor HTTP na porta $port..." -ForegroundColor Green
Write-Host ""
Write-Host "✅ Site disponível em:" -ForegroundColor Cyan
Write-Host "   📱 Site Principal:  http://localhost:$port" -ForegroundColor White
Write-Host "   🔐 Painel Admin:    http://localhost:$port/admin/login.html" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Pressione CTRL+C para parar o servidor" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Abrir navegador após 2 segundos
Start-Sleep -Seconds 2
Start-Process "http://localhost:$port"

# Iniciar servidor HTTP (Python ou .NET)
try {
    # Tentar usar Python (mais comum)
    python -m http.server $port 2>$null
} catch {
    Write-Host "⚠️  Python não encontrado. Tentando servidor .NET..." -ForegroundColor Yellow
    # Alternativa: usar dotnet (se disponível)
    dotnet serve -p $port -d .
}