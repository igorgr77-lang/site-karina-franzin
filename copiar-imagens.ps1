# Script PowerShell para copiar imagens da Karina Franzin
# Execute este script na raiz do projeto

Write-Host "🎨 Script de Cópia de Imagens - Karina Franzin" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configurar caminhos
$origemBase = "C:\Users\oigor\OneDrive\Imagens\karina frazin"
$destino = "site-karina-franzin\assets\img"

# Verificar se a pasta de origem existe
if (-not (Test-Path $origemBase)) {
    Write-Host "❌ Pasta de origem não encontrada: $origemBase" -ForegroundColor Red
    Write-Host "Por favor, ajuste o caminho no script." -ForegroundColor Yellow
    exit
}

# Criar pasta de destino se não existir
if (-not (Test-Path $destino)) {
    New-Item -ItemType Directory -Force -Path $destino | Out-Null
}

Write-Host "📂 Pasta de origem: $origemBase" -ForegroundColor Green
Write-Host "📂 Pasta de destino: $destino" -ForegroundColor Green
Write-Host ""

# Listar arquivos disponíveis nas pastas
Write-Host "📸 Fotos disponíveis da Karina:" -ForegroundColor Yellow
$fotosKarina = Get-ChildItem -Path "$origemBase\karina franzin\*" -Include *.jpg,*.jpeg,*.png -ErrorAction SilentlyContinue
if ($fotosKarina) {
    $fotosKarina | ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "  Nenhuma foto encontrada" -ForegroundColor Red
}

Write-Host ""
Write-Host "📸 Fotos disponíveis de alunos:" -ForegroundColor Yellow
$fotosAlunos = Get-ChildItem -Path "$origemBase\alunos\*" -Include *.jpg,*.jpeg,*.png -ErrorAction SilentlyContinue
if ($fotosAlunos) {
    $fotosAlunos | ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "  Nenhuma foto encontrada" -ForegroundColor Red
}

Write-Host ""
Write-Host "📸 Logo disponível:" -ForegroundColor Yellow
$logo = Get-ChildItem -Path "$origemBase\logo\*" -Include *.jpg,*.jpeg,*.png -ErrorAction SilentlyContinue
if ($logo) {
    $logo | ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "  Nenhum logo encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para copiar as imagens automaticamente, edite este script" -ForegroundColor Yellow
Write-Host "e substitua [NOME_DO_ARQUIVO] pelos nomes reais das fotos." -ForegroundColor Yellow
Write-Host ""
Write-Host "Exemplo de cópia manual:" -ForegroundColor Cyan
Write-Host 'Copy-Item "$origemBase\karina franzin\foto1.jpg" -Destination "$destino\karina-hero.jpg"' -ForegroundColor Gray
Write-Host ""

# Descomentar e ajustar os comandos abaixo após identificar os arquivos corretos:

# Copy-Item "$origemBase\karina franzin\[ESCOLHA_FOTO_HERO].jpg" -Destination "$destino\karina-hero.jpg"
# Copy-Item "$origemBase\karina franzin\[ESCOLHA_FOTO_PERFIL].jpg" -Destination "$destino\karina-profile.jpg"
# Copy-Item "$origemBase\alunos\[ESCOLHA_FOTO_1].jpg" -Destination "$destino\alunos-podio-01.jpg"
# Copy-Item "$origemBase\alunos\[ESCOLHA_FOTO_2].jpg" -Destination "$destino\alunos-podio-02.jpg"
# Copy-Item "$origemBase\alunos\[ESCOLHA_FOTO_3].jpg" -Destination "$destino\alunos-podio-03.jpg"

# Write-Host "✅ Imagens copiadas com sucesso!" -ForegroundColor Green

Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")