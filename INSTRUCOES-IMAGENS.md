# 📸 Instruções para Adicionar as Imagens

## 🎯 Ação Necessária

As imagens estão localizadas em:
```
C:\Users\oigor\OneDrive\Imagens\karina frazin\
```

## 📋 Checklist de Imagens

### 1. Foto Hero (Principal)
**Origem**: `C:\Users\oigor\OneDrive\Imagens\karina frazin\karina franzin\`
**Destino**: `site-karina-franzin/assets/img/karina-hero.jpg`
**Uso**: Imagem de fundo da seção principal (hero)
**Recomendação**: 
- Escolha uma foto impactante da Karina correndo
- Tamanho ideal: 1920x1080px
- Formato: JPG otimizado

### 2. Foto de Perfil
**Origem**: `C:\Users\oigor\OneDrive\Imagens\karina frazin\karina franzin\`
**Destino**: `site-karina-franzin/assets/img/karina-profile.jpg`
**Uso**: Seção "Sobre" / "Minha História"
**Recomendação**: 
- Foto profissional ou de competição
- Tamanho ideal: 800x800px
- Formato: JPG otimizado

### 3. Fotos de Alunos no Pódio (3 imagens)
**Origem**: `C:\Users\oigor\OneDrive\Imagens\karina frazin\alunos\`
**Destino**: 
- `site-karina-franzin/assets/img/alunos-podio-01.jpg`
- `site-karina-franzin/assets/img/alunos-podio-02.jpg`
- `site-karina-franzin/assets/img/alunos-podio-03.jpg`

**Uso**: Galeria de prova social
**Recomendação**: 
- Escolha 3 melhores fotos de alunos em pódios
- Tamanho ideal: 800x600px cada
- Formato: JPG otimizado

### 4. Logo (Opcional)
**Origem**: `C:\Users\oigor\OneDrive\Imagens\karina frazin\logo\`
**Destino**: `site-karina-franzin/assets/img/logo.png`
**Uso**: Pode ser adicionado no header/footer
**Formato**: PNG com fundo transparente

## 🔧 Como Copiar as Imagens

### Opção 1: Manual (Arrastar e Soltar)
1. Abra a pasta: `C:\Users\oigor\OneDrive\Imagens\karina frazin\`
2. Navegue até a pasta do site: `site-karina-franzin/assets/img/`
3. Copie as imagens e renomeie conforme a lista acima

### Opção 2: PowerShell (Automático)
Execute este comando no PowerShell (na raiz do projeto):

```powershell
# Configurar caminhos
$origem = "C:\Users\oigor\OneDrive\Imagens\karina frazin"
$destino = "site-karina-franzin\assets\img"

# Copiar imagens (ajuste os nomes dos arquivos de origem conforme necessário)
Copy-Item "$origem\karina franzin\[NOME_DA_FOTO_HERO].jpg" -Destination "$destino\karina-hero.jpg"
Copy-Item "$origem\karina franzin\[NOME_DA_FOTO_PERFIL].jpg" -Destination "$destino\karina-profile.jpg"
Copy-Item "$origem\alunos\[FOTO_1].jpg" -Destination "$destino\alunos-podio-01.jpg"
Copy-Item "$origem\alunos\[FOTO_2].jpg" -Destination "$destino\alunos-podio-02.jpg"
Copy-Item "$origem\alunos\[FOTO_3].jpg" -Destination "$destino\alunos-podio-03.jpg"

Write-Host "✅ Imagens copiadas com sucesso!" -ForegroundColor Green
```

## 🎨 Otimização de Imagens (Recomendado)

### Antes de adicionar ao site, otimize as imagens:

**Ferramentas Online (Grátis):**
- [TinyPNG](https://tinypng.com/) - Compressão automática
- [Squoosh](https://squoosh.app/) - Controle total
- [Compressor.io](https://compressor.io/) - Múltiplos formatos

**Configurações Recomendadas:**
- Qualidade: 70-80%
- Formato: JPG para fotos
- Remover metadados EXIF
- Tamanho máximo: 500KB por imagem

## ✅ Verificação Final

Depois de adicionar as imagens, verifique:

- [ ] Todas as 5 imagens estão na pasta `/assets/img/`
- [ ] Os nomes dos arquivos correspondem exatamente aos esperados
- [ ] As imagens foram otimizadas (tamanho reduzido)
- [ ] Abra o `index.html` no navegador e verifique se as imagens aparecem
- [ ] Teste em mobile para ver se carregam rápido

## 🚨 Imagens Faltando?

Se alguma imagem não aparecer no site:
1. Verifique se o nome do arquivo está correto
2. Verifique se a extensão é `.jpg` (minúscula)
3. Abra o Console do navegador (F12) para ver erros
4. Certifique-se que o caminho está correto: `./assets/img/nome-da-imagem.jpg`

---

**Dica**: Mantenha cópias originais das imagens em backup antes de otimizar!