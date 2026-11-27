# Onde correr em Votuporanga (/onde-correr-votuporanga/)

Hub com os lugares para treinar na cidade e uma página para cada lugar. Tudo é gerado por
`scripts/onde-correr-build.js` quando você roda `node build-blog.js`.

## Como adicionar ou completar um local

1. Grave o percurso no relógio do jeito que você recomenda o treino (a volta de 5 km, a reta do tiro...) e exporte o GPX do Strava.
2. Coloque o GPX na pasta do local com o nome indicado em `percursos[].gpx` (ex.: `tiro.gpx`, `5km.gpx`).
3. Preencha o `local.json` da pasta (veja o exemplo completo em `_modelo/local.json`).
4. Rode `node build-blog.js`. O build gera o mapa, a altimetria e a página do local.
5. Revise a página pelo endereço direto (`/onde-correr-votuporanga/<pasta>/`). Enquanto `"publicado": false`, ela sai com uma faixa amarela de rascunho e fica fora do Google.
6. Quando estiver pronta, troque para `"publicado": true` e rode o build de novo. O local entra no hub, no sitemap.xml e no llms.txt.

O hub também fica fora do Google (noindex) até o primeiro local ser publicado.
Pastas que começam com `_` (como `_modelo`) são ignoradas pelo build.

## Campos do local.json

| Campo | O que é |
|---|---|
| `publicado` | `true` publica o local; `false` deixa como rascunho |
| `nome` | Nome do lugar, como as pessoas buscam ("Parque da Cultura") |
| `artigo` | `"no"` ou `"na"`, para os títulos ("Correr **no** Parque", "Correr **na** Avenida") |
| `bairro` | Aparece acima do título e no card |
| `resumo` | 1 ou 2 frases. Vai para o card do hub, o topo da página e a descrição no Google |
| `tags` | Filtros do hub: `tiro`, `5km`, `10km`, `longao`, `terra`, `plano`, `subida`, `iluminado` |
| `mapsUrl` | Link do Google Maps do ponto de encontro (aparece como "ver no mapa") |
| `info` | Quadro de informações. Campo vazio não aparece: `endereco`, `volta`, `piso`, `iluminacao`, `sombra`, `agua`, `banheiro`, `estacionamento`, `melhorHorario`, `seguranca` |
| `introducao` | Lista de parágrafos sobre o lugar |
| `percursos` | Um item por percurso (veja abaixo). Sem GPX na pasta, a seção sai como "em gravação" |
| `faq` | Perguntas e respostas (`p` e `r`). Também vão para o Google como FAQ |
| `seo.titulo` / `seo.descricao` | Opcional: troca o título e a descrição automáticos do Google |

Cada item de `percursos`:

| Campo | O que é |
|---|---|
| `id` | Nome curto, sem espaço (`tiro`, `5km`, `longao`). Vira o endereço da seção (`#tiro`) e o nome das imagens |
| `tipo` | Uma das tags. Em `tiro`, o resumo automático mostra o desnível e a inclinação da reta |
| `titulo` | Título da seção ("Reta para treino de tiro") |
| `gpx` | Nome do arquivo GPX na pasta |
| `texto` | Onde começa e termina, por onde passa |
| `dicas` | Lista de dicas da treinadora |
| `sugestaoTreino` | Opcional: um treino de exemplo para fazer ali |

A distância, o ganho de altitude, o mapa e a altimetria são calculados pelo GPX: não precisa escrever.

## Provas da cidade

A seção "Percursos das provas de Votuporanga" do hub é montada sozinha a partir de `/percursos/`
(as corridas com "Votuporanga" no `metadata.city` do `estrategia.config.json`). Não copie provas para cá.

## Ao publicar o primeiro local

- Colocar um link para o hub na página `/corrida-votuporanga/` (ajuda a página da assessoria a subir no Google).
- Avaliar um item no menu ou no rodapé.
