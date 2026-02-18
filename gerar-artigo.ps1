# Gerador de Artigos - Markdown para HTML
param(
    [Parameter(Mandatory=$true)]
    [string]$ArquivoMarkdown
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GERADOR DE ARTIGOS DO BLOG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $ArquivoMarkdown)) {
    Write-Host "ERRO: Arquivo nao encontrado: $ArquivoMarkdown" -ForegroundColor Red
    exit 1
}

Write-Host "Lendo arquivo: $ArquivoMarkdown" -ForegroundColor Yellow

$conteudo = Get-Content -Path $ArquivoMarkdown -Raw -Encoding UTF8

if ($conteudo -match '(?s)^---\s*\n(.*?)\n---\s*\n(.*)$') {
    $metadados = $matches[1]
    $corpo = $matches[2]
    
    $meta = @{}
    $metadados -split "`n" | ForEach-Object {
        if ($_ -match '^(\w+):\s*(.+)$') {
            $meta[$matches[1]] = $matches[2].Trim()
        }
    }
    
    Write-Host "Metadados extraidos:" -ForegroundColor Green
    Write-Host "   Titulo: $($meta['titulo'])" -ForegroundColor White
    Write-Host "   Slug: $($meta['slug'])" -ForegroundColor White
    
} else {
    Write-Host "ERRO: Formato invalido" -ForegroundColor Red
    exit 1
}

Write-Host "Convertendo Markdown para HTML..." -ForegroundColor Yellow

$html = $corpo
$html = $html -replace '(?m)^### (.+)$', '<h3>$1</h3>'
$html = $html -replace '(?m)^## (.+)$', '<h2>$1</h2>'
$html = $html -replace '(?m)^# (.+)$', '<h1>$1</h1>'
$html = $html -replace '\*\*(.+?)\*\*', '<strong>$1</strong>'
$html = $html -replace '\*(.+?)\*', '<em>$1</em>'
$html = $html -replace '\[(.+?)\]\((.+?)\)', '<a href="$2">$1</a>'
$html = $html -replace '!\[(.+?)\]\((.+?)\)', '<img src="$2" alt="$1" />'
$html = $html -replace '(?m)^- (.+)$', '<li>$1</li>'
$html = $html -replace '(<li>.*?</li>)(?!\s*<li>)', '<ul>$1</ul>'
$html = $html -replace '(?m)^(?!<|$)(.+)$', '<p>$1</p>'
$html = $html -replace '<p>\s*</p>', ''
$html = $html -replace '<p>(<[hul])', '$1'
$html = $html -replace '(</[hul]>)</p>', '$1'

Write-Host "Conversao concluida!" -ForegroundColor Green

$template = Get-Content -Path "template-artigo.html" -Raw -Encoding UTF8

$htmlFinal = $template -replace '{{TITULO}}', $meta['titulo']
$htmlFinal = $htmlFinal -replace '{{DESCRICAO}}', $meta['descricao']
$htmlFinal = $htmlFinal -replace '{{IMAGEM}}', $meta['imagem']
$htmlFinal = $htmlFinal -replace '{{ALT_IMAGEM}}', $meta['alt_imagem']
$htmlFinal = $htmlFinal -replace '{{DATA}}', $meta['data']
$htmlFinal = $htmlFinal -replace '{{AUTOR}}', $meta['autor']
$htmlFinal = $htmlFinal -replace '{{CONTEUDO}}', $html

$pastaDestino = "blog\$($meta['slug'])"
if (-not (Test-Path $pastaDestino)) {
    New-Item -ItemType Directory -Force -Path $pastaDestino | Out-Null
}

$arquivoDestino = "$pastaDestino\index.html"
$htmlFinal | Out-File -FilePath $arquivoDestino -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ARTIGO GERADO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Localizacao: $arquivoDestino" -ForegroundColor White
Write-Host "URL: /blog/$($meta['slug'])/" -ForegroundColor White
Write-Host ""