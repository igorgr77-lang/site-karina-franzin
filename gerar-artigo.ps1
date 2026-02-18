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

# Converter Markdown para HTML
Write-Host "Convertendo Markdown para HTML..." -ForegroundColor Yellow

$html = $corpo
$html = $html -replace '(?m)^### (.+)$', '<h3>$1</h3>'
$html = $html -replace '(?m)^## (.+)$', '<h2>$1</h2>'
$html = $html -replace '(?m)^# (.+)$', ''  # Remove H1 (ja esta no template)
$html = $html -replace '\*\*(.+?)\*\*', '<strong>$1</strong>'
$html = $html -replace '\*(.+?)\*', '<em>$1</em>'
$html = $html -replace '\[(.+?)\]\((.+?)\)', '<a href="$2">$1</a>'
$html = $html -replace '!\[(.+?)\]\((.+?)\)', '<img src="../../assets/img/$2" alt="$1" loading="lazy" />'
$html = $html -replace '(?m)^- (.+)$', '<li>$1</li>'
$linhas = $html -split "`n"
$resultado = @()
$emLista = $false
foreach ($linha in $linhas) {
    if ($linha -match '^\s*<li>') {
        if (-not $emLista) {
            $resultado += '<ul>'
            $emLista = $true
        }
        $resultado += $linha
    } else {
        if ($emLista) {
            $resultado += '</ul>'
            $emLista = $false
        }
        if ($linha -match '^\s*$') {
            # Linha vazia - ignorar
        } elseif ($linha -match '^<[h23]|^<ul|^<img') {
            $resultado += $linha
        } else {
            $resultado += "<p>$linha</p>"
        }
    }
}
if ($emLista) {
    $resultado += '</ul>'
}
$html = $resultado -join "`n"

# Calcular tempo de leitura (palavras / 200 palavras por minuto)
$palavras = ($corpo -split '\s+').Count
$tempoLeitura = [Math]::Max(1, [Math]::Round($palavras / 200))

# Formatar data
$dataObj = [DateTime]::Parse($meta['data'])
$meses = @('janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro')
$dataFormatada = "$($dataObj.Day) de $($meses[$dataObj.Month - 1]), $($dataObj.Year)"

# Titulo curto para breadcrumb
$tituloCurto = if ($meta['titulo'].Length -gt 30) { $meta['titulo'].Substring(0, 30) + "..." } else { $meta['titulo'] }

# Categoria padrao se nao existir
if (-not $meta.ContainsKey('categoria')) {
    $meta['categoria'] = 'Dicas'
}

# Keywords padrao se nao existir
if (-not $meta.ContainsKey('keywords')) {
    $meta['keywords'] = 'corrida, treinamento, educacao fisica, Karina Franzin'
}

Write-Host "Conversao concluida!" -ForegroundColor Green

$template = Get-Content -Path "template-artigo.html" -Raw -Encoding UTF8

$htmlFinal = $template -replace '{{TITULO}}', $meta['titulo']
$htmlFinal = $htmlFinal -replace '{{TITULO_CURTO}}', $tituloCurto
$htmlFinal = $htmlFinal -replace '{{DESCRICAO}}', $meta['descricao']
$htmlFinal = $htmlFinal -replace '{{IMAGEM}}', $meta['imagem']
$htmlFinal = $htmlFinal -replace '{{SLUG}}', $meta['slug']
$htmlFinal = $htmlFinal -replace '{{DATA}}', $meta['data']
$htmlFinal = $htmlFinal -replace '{{DATA_FORMATADA}}', $dataFormatada
$htmlFinal = $htmlFinal -replace '{{AUTOR}}', $meta['autor']
$htmlFinal = $htmlFinal -replace '{{CATEGORIA}}', $meta['categoria']
$htmlFinal = $htmlFinal -replace '{{TEMPO_LEITURA}}', $tempoLeitura
$htmlFinal = $htmlFinal -replace '{{KEYWORDS}}', $meta['keywords']
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
Write-Host "Tempo de leitura estimado: $tempoLeitura minutos" -ForegroundColor White
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Adicione a imagem em: assets/img/$($meta['imagem'])" -ForegroundColor White
Write-Host "2. Adicione o card manualmente em blog/index.html" -ForegroundColor Yellow
Write-Host "3. Teste localmente abrindo: $arquivoDestino" -ForegroundColor White
Write-Host "4. Faca commit e push para publicar" -ForegroundColor White
Write-Host ""