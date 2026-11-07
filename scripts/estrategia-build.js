/**
 * Build da seção Estratégia de Prova (chamado pelo build-blog.js).
 *
 * Para cada pasta em percursos/<corrida>/ que tenha um estrategia.config.json com o
 * bloco "pagina", gera o index.html a partir do template único assets/corrida.template.html,
 * usando o config e o course-data.js da pasta. Também gera os cards da página raiz, a lista
 * de corridas para o Google (JSON-LD) e a imagem de prévia de link (banner-og.jpg).
 *
 * Quase tudo é calculado a partir do percurso (desnível, altitudes, maior subida, topo, metas
 * rápidas, número de trechos...). Os textos do config só são usados quando preenchidos; vazio
 * significa "use o texto automático".
 *
 * Pastas antigas que ainda tenham index.template.html e não tenham "pagina" no config continuam
 * sendo compiladas do jeito antigo.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = "https://karinafranzin.com.br";
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// ---------- formatação ----------
const fmt = (v, d = 1) => Number(v).toFixed(d).replace(".", ",");
const fmtSigned = (v, d = 1) => (v >= 0 ? "+" : "") + fmt(v, d);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function fmtDuration(sec) {
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function fmtPace(secPerKm) {
  const s = Math.round(secPerKm);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
// Rótulo curto dos botões de meta rápida: 22:00, 27:30, 1h00, 1h05
function presetLabel(sec) {
  if (sec < 3600) return fmtDuration(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return `${h}h${String(m).padStart(2, "0")}`;
}
// Data da prova no formato AAAA-MM-DD (o modelo do config vem com "AAAA-MM-DD" para preencher)
function validDate(d) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d || "") ? d : null;
}

// ---------- leitura dos dados da corrida ----------
function loadCourseData(dir) {
  const file = path.join(dir, "course-data.js");
  if (!fs.existsSync(file)) throw new Error(`course-data.js não encontrado em ${dir}. Rode: node scripts/gerar-course-data.js ${path.relative(process.cwd(), dir)}`);
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), ctx);
  return ctx.window.COURSE_DATA;
}

/** Calcula tudo que dá para tirar do percurso, na escala da distância oficial. */
function analyze(data) {
  const race = data.race || {};
  const t = data.cleanTrack;
  const cleanM = t[t.length - 1].dist;
  const rawM = data.rawTrack[data.rawTrack.length - 1].dist;
  const officialM = race.officialDistanceM || Math.round(cleanM / 1000) * 1000;
  const sc = officialM / cleanM;
  let gain = 0;
  let loss = 0;
  t.forEach((p) => { if (p.de > 0) gain += p.de; else loss -= p.de; });
  const eles = t.map((p) => p.ele);
  const minEle = Math.min(...eles);
  const maxEle = Math.max(...eles);
  const top = t.find((p) => p.ele === maxEle);
  const valley = t.find((p) => p.ele === minEle);

  const segs = data.segmentDefinitions.map((s) => {
    let a = t.findIndex((p) => p.origIdx >= s.startOrigIdx);
    let b = t.findIndex((p) => p.origIdx >= s.endOrigIdx);
    if (a < 0) a = 0;
    if (b < 0) b = t.length - 1;
    let g = 0;
    let l = 0;
    t.slice(a + 1, b + 1).forEach((p) => { if (p.de > 0) g += p.de; else l -= p.de; });
    return { ...s, a, b, distM: t[b].dist - t[a].dist, netEle: t[b].ele - t[a].ele, kmIni: (t[a].dist * sc) / 1000, kmFim: (t[b].dist * sc) / 1000, gain: g, loss: l, net: t[b].ele - t[a].ele };
  });
  const segOf = (p) => segs.find((s) => p.dist * sc / 1000 >= s.kmIni - 1e-9 && p.dist * sc / 1000 <= s.kmFim + 1e-9) || segs[segs.length - 1];
  const climbs = segs.filter((s) => s.type === "climb" || s.type === "uphill");
  const downs = segs.filter((s) => s.type === "downhill");
  const biggest = climbs.slice().sort((x, y) => y.gain - x.gain)[0];
  return { race, cleanM, rawM, officialM, sc, gain, loss, minEle, maxEle, top, valley, segs, segOf, climbs, downs, biggest };
}

// ---------- valores de cada marcador do template ----------
function buildValues(slug, dir, config, data, a, imagens = {}, ruas = []) {
  const p = config.pagina || {};
  const race = a.race;
  const nome = p.nome || (config.metadata && config.metadata.name) || slug;
  const nomeCurto = p.nomeCurto || nome;
  const km = a.officialM / 1000;
  const kmLabel = Number.isInteger(km) ? String(km) : fmt(km, 1);
  const target = race.defaultTargetSeconds || Math.round((km * 300) / 60) * 60;
  const nSeg = a.segs.length;
  const city = (p.cidade || (data.metadata && data.metadata.city) || "").replace(" - ", " – ");
  const cityShort = city.split(/ [–-] /)[0].trim();
  const year = String(validDate(race.date) || "").slice(0, 4);
  const comCidade = cityShort && !nome.toLowerCase().includes(cityShort.toLowerCase()) ? ` ${cityShort}` : "";
  const nomeBusca = `${nome}${comCidade}${year ? ` ${year}` : ""}`;   // ex.: "Corrida Passo a Passo 10K Novo Horizonte 2026"
  const temKmNoNome = /\b\d+\s?k(m)?\b/i.test(nome);

  // Metas rápidas: config ou paces de referência de 3:40 a 7:30/km, arredondados a 30s
  const presetSecs = Array.isArray(p.metasRapidas) && p.metasRapidas.length
    ? p.metasRapidas
    : [220, 250, 275, 300, 330, 360, 400, 450].map((pace) => Math.round((pace * km) / 30) * 30);
  const metas = presetSecs.map((sec) =>
    `              <button type="button" class="preset-btn${sec === target ? " active" : ""}" data-seconds="${sec}">${presetLabel(sec)}</button>`).join("\n");

  const big = a.biggest;
  const kmRange = (s) => `Km ${fmt(s.kmIni)} a ${fmt(s.kmFim)}`;
  const destaques = Array.isArray(p.destaques) && p.destaques.length === 2 ? p.destaques : [
    big ? { rotulo: "Maior Subida", valor: `${kmRange(big)} (+${fmt(big.gain)}m)` } : { rotulo: "Maior Subida", valor: "—" },
    { rotulo: "Ponto Mais Alto", valor: `Km ${fmt((a.top.dist * a.sc) / 1000)} (${fmt(a.maxEle)}m)` }
  ];
  const dPorKm = a.gain / km;
  const diagStatus = p.diagStatus || (dPorKm < 6 ? "Percurso Plano · Rápido" : dPorKm < 14 ? "Percurso Ondulado · Moderado" : "Percurso Ondulado · Exigente");
  const share = big ? Math.round((big.gain / a.gain) * 100) : 0;
  const autoPagina = require("./estrategia-textos.js").escreverPagina(a.segs, { track: data.cleanTrack, officialM: a.officialM, cleanM: a.cleanM }, nomeCurto);
  const intro = p.intro || autoPagina.intro || (big
    ? `Olhar só para o pace médio faz o corredor sair rápido demais e travar na <strong>maior subida (${kmRange(big)})</strong>, que concentra ${share}% de todo o desnível da prova. Siga o ritmo de cada segmento abaixo:`
    : "Siga o ritmo de cada segmento abaixo para manter o esforço constante do início ao fim:");
  const recomendacao = p.recomendacao || autoPagina.recomendacao || (big
    ? `O trecho mais exigente é o <strong>Segmento ${big.id} (${kmRange(big)})</strong>, com <strong>+${fmt(big.gain)}m</strong> de subida (${share}% do desnível da prova). Correr esse trecho mais lento que seu pace médio não é "quebrar": é o que mantém o esforço abaixo do limiar e deixa perna para acelerar nas descidas!`
    : "Mantenha o esforço constante: segure um pouco nas subidas e solte nas descidas.");

  const minFaixa = Math.min(a.cleanM, a.officialM) / 1000 * 0.99;
  const maxFaixa = Math.max(a.cleanM, a.officialM) / 1000 * 1.03;
  const faixa = p.faixaRelogio || `${fmt(minFaixa)} e ${fmt(maxFaixa)}`;

  const gpxLimpo = fs.readdirSync(dir).find((f) => /_LIMPO\.gpx$/i.test(f)) || "";
  const ogFile = fs.existsSync(path.join(dir, "banner-og.jpg")) ? `${SITE}/percursos/${slug}/banner-og.jpg` : `${SITE}/assets/img/karina-hero.jpg`;

  const sumGain = (list) => list.reduce((x, s) => x + s.gain, 0);
  const sumLoss = (list) => list.reduce((x, s) => x + s.loss, 0);
  const ids = (list) => list.map((s) => `Seg ${s.id}`).join(", ").replace(/, ([^,]*)$/, " e $1");
  const topSeg = a.segOf(a.top);
  const valleySeg = a.segOf(a.valley);
  const h = Math.floor(target / 3600);
  const m = Math.floor((target % 3600) / 60);
  const s = target % 60;

  const v = {
    SLUG: slug,
    GA: race.gaCategory || slug.replace(/-/g, "_"),
    SEO_TITULO: p.seoTitulo || `Percurso ${nomeBusca}${temKmNoNome ? "" : ` (${kmLabel} km)`}: mapa, altimetria e GPX`,
    SEO_DESCRICAO: p.seoDescricao || `Veja o percurso da ${nome}${comCidade ? ` em${comCidade}` : ""}: mapa, altimetria, subidas e descidas km a km e GPX para o relógio. Com estratégia de pace grátis.`,
    NOME_BREADCRUMB: `Percurso ${nomeBusca}`,
    NOME_APP: `Estratégia de Prova ${nome}`,
    SCHEMA_DESCRICAO: p.descricaoSchema || `Calculadora de pace por segmento de subida e descida e parciais km a km para a ${nome}${city ? `, em ${city}` : ""}.`,
    OG_TITULO: p.ogTitulo || `Percurso ${nomeBusca}: mapa, altimetria e GPX`,
    OG_DESCRICAO: p.ogDescricao || `Mapa, altimetria e as subidas e descidas dos ${kmLabel} km, com GPX para o relógio e estratégia de pace grátis.`,
    OG_IMAGEM: ogFile,
    OG_ALT: p.ogAlt || `Banner da ${nome}`,
    META_TEMPO: fmtDuration(target),
    META_H: String(h),
    META_MIN: String(m).padStart(2, "0"),
    META_SEG: String(s).padStart(2, "0"),
    PACE_META: fmtPace(target / km),
    N_SEG: String(nSeg),
    N_KM: String(Math.round(km)),
    H1: `Percurso da ${nomeBusca}`,
    SUBTITULO: p.subtitulo || `${p.subtituloPrefixo ? `${p.subtituloPrefixo} ` : ""}Veja o percurso completo com mapa, altimetria e os <strong>${nSeg} trechos de subida e descida</strong>. Digite seu tempo alvo e receba o pace de cada trecho, as parciais km a km e o GPX para o relógio.`,
    DIAG_STATUS: diagStatus,
    ALT_MIN_MAX: `${fmt(a.minEle)}m / ${fmt(a.maxEle)}m`,
    D_MAIS: `+${fmt(a.gain)} m`,
    DESTAQUE1_ROTULO: destaques[0].rotulo,
    DESTAQUE1_VALOR: destaques[0].valor,
    DESTAQUE2_ROTULO: destaques[1].rotulo,
    DESTAQUE2_VALOR: destaques[1].valor,
    MAX_HORAS: String(race.maxHours || 4),
    METAS_RAPIDAS: metas,
    CONSERVADORA_KM: fmt((0.39 * a.officialM) / 1000),
    OPCAO_OFICIAL: `${fmt(km, 2)} km Oficial (Proporcionalizado para ${kmLabel}K)`,
    OPCAO_LIMPO: `${fmt(a.cleanM / 1000, 2)} km Percurso Real Limpo (${p.rotuloLimpo || "Altitude suavizada"})`,
    OPCAO_BRUTO: `${fmt(a.rawM / 1000, 2)} km Arquivo GPX Bruto Original${p.rotuloBruto ? ` (${p.rotuloBruto})` : ""}`,
    DICA_DISTANCIA: (race.distanceHints && race.distanceHints.official) || `Escala os ${nSeg} segmentos para ${a.officialM.toLocaleString("pt-BR")}m exatos.`,
    KPI_SUBIDA_INFO: a.climbs.length ? `${ids(a.climbs)} (+${fmt(sumGain(a.climbs))}m)` : "—",
    KPI_DESCIDA_INFO: a.downs.length ? `${ids(a.downs)} (-${fmt(sumLoss(a.downs))}m)` : "—",
    PASSAGEM_KM: fmt((race.halfwayDistM || a.officialM / 2) / 1000),
    LEGENDA_TOPO: `Topo: ${fmt(a.maxEle)}m (Seg ${topSeg.id})`,
    LEGENDA_VALE: `Vale: ${fmt(a.minEle)}m (Seg ${valleySeg.id})`,
    INTRO: intro,
    NOME_PULSEIRA: (p.nomePulseira || nomeCurto).toUpperCase(),
    GPX_LIMPO: gpxLimpo,
    DIST_LIMPA: fmt(a.cleanM / 1000, 2),
    DIST_OFICIAL: kmLabel,
    FAIXA_RELOGIO: faixa,
    RECOMENDACAO: recomendacao,
    CTA_TITULO: p.ctaTitulo || `Quer correr a ${nomeCurto} na sua melhor performance?`,
    WA_TEXTO: encodeURIComponent(`Olá, Karina! Vi a página de Estratégia da ${p.nomeWhatsapp || nome} e quero saber mais sobre a assessoria de corrida.`)
  };
  const extra = require("./estrategia-percurso.js").percursoHtml({ slug, nome, nomeCurto, nomeBusca, city, cityShort, year, km, kmLabel, gpxLimpo, faixa, analysis: a, data, imagens, ruas, evento: config.evento, ogImagem: ogFile, date: validDate(race.date) });
  v.SECAO_PERCURSO = extra.secao;
  v.SECAO_FAQ = extra.faq;
  v.FAQ_JSONLD = extra.jsonld;
  // Campos de texto puro vão escapados; os de HTML pronto ficam como estão
  const html = new Set(["SUBTITULO", "INTRO", "RECOMENDACAO", "METAS_RAPIDAS", "WA_TEXTO", "OG_IMAGEM", "SECAO_PERCURSO", "SECAO_FAQ", "FAQ_JSONLD"]);
  for (const k of Object.keys(v)) if (!html.has(k)) v[k] = esc(v[k]);
  return { values: v, nome, city, km, kmLabel, target };
}

function fill(template, values) {
  const out = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, k) => {
    if (!(k in values)) throw new Error(`Marcador sem valor no template: ${m}`);
    return values[k];
  });
  return out.replace(/<!--\s*TEMPLATE ÚNICO[\s\S]*?-->\n/, "");
}

// ---------- imagem de prévia (WhatsApp/Instagram) ----------
async function ensureOgImage(dir) {
  const src = path.join(dir, "banner.webp");
  const out = path.join(dir, "banner-og.jpg");
  if (!fs.existsSync(src)) return false;
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) return true;
  let sharp;
  try { sharp = require("sharp"); } catch (e) { console.warn("   ⚠️ sharp não instalado: banner-og.jpg não foi gerado (rode npm install)"); return fs.existsSync(out); }
  await sharp(src).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  console.log(`   🖼️ Prévia de link gerada: ${path.relative(process.cwd(), out)}`);
  return true;
}

// ---------- card da página raiz ----------
function profileSvg(data, id) {
  const t = data.cleanTrack;
  const W = 300, H = 70;
  const maxD = t[t.length - 1].dist;
  const es = t.map((p) => p.ele);
  const mn = Math.min(...es), mx = Math.max(...es);
  const step = Math.ceil(t.length / 90);
  const pts = t.filter((_, i) => i % step === 0 || i === t.length - 1)
    .map((p) => [((p.dist / maxD) * W).toFixed(1), (H - 4 - ((p.ele - mn) / (mx - mn || 1)) * (H - 12)).toFixed(1)]);
  const d = pts.map((q, i) => (i ? "L" : "M") + q[0] + " " + q[1]).join(" ") + ` L${W} ${H} L0 ${H} Z`;
  return `<svg viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true" style="background:linear-gradient(135deg,#1a1a1a,#3a1a0a)">
              <defs><linearGradient id="hubGrad${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff6b35" stop-opacity="0.85" /><stop offset="100%" stop-color="#ff6b35" stop-opacity="0.08" /></linearGradient></defs>
              <path fill="url(#hubGrad${id})" stroke="#ff6b35" stroke-width="1.5" d="${d}" />
            </svg>`;
}

function renderCard(r) {
  const p = r.config.pagina.card || {};
  const date = validDate(r.data.race.date);
  let dateHtml = "";
  if (date) {
    const [y, m, d] = date.split("-");
    const wd = WEEKDAYS[new Date(Number(y), Number(m) - 1, Number(d)).getDay()];
    dateHtml = `\n              <span class="hub-card-date"><time datetime="${date}">${wd} · ${d}/${m}/${y}</time></span>`;
  }
  const has = (f) => fs.existsSync(path.join(r.dir, f));
  const img = has("banner.webp")
    ? `<img src="/percursos/${r.slug}/${has("banner-1024w.webp") ? "banner-1024w.webp" : "banner.webp"}"
                 srcset="${[has("banner-640w.webp") && `/percursos/${r.slug}/banner-640w.webp 640w`, has("banner-1024w.webp") && `/percursos/${r.slug}/banner-1024w.webp 1024w`, `/percursos/${r.slug}/banner.webp 1731w`].filter(Boolean).join(", ")}"
                 sizes="(max-width: 768px) 100vw, 380px"
                 width="1024" height="538" alt="${esc(p.alt || `Banner da ${r.nome}`)}" decoding="async">`
    : profileSvg(r.data, r.slug.replace(/[^a-z0-9]/gi, ""));
  const tag = p.tag || r.values.DIAG_STATUS.replace(/^Percurso /, "").split(" · ")[0];
  return `        <a href="/percursos/${r.slug}/" class="hub-card" data-gtag-event="estrategia_abrir_corrida" data-gtag-category="${r.values.GA}">
          <div class="hub-card-profile">
            ${img}
          </div>
          <div class="hub-card-body">
            <div class="hub-card-meta">
              <span class="hub-card-distance">${esc(p.distancia || `${r.kmLabel}K`)}</span>${dateHtml}
            </div>
            <span class="hub-card-city">${esc(p.cidade || r.city)}</span>
            <h3 class="hub-card-title">${esc(p.titulo || r.nome)}</h3>
            <p class="hub-card-desc">${esc(p.descricao || `Estratégia de pace para os ${r.kmLabel} km, com ${r.values.N_SEG} trechos de subida e descida.`)}</p>
            <div class="hub-card-stats">
              <span><strong>+${Math.round(r.analysis.gain)} m</strong> D+</span>
              <span><strong>${r.values.N_SEG}</strong> segmentos</span>
              <span><strong>${esc(tag)}</strong></span>
            </div>
            <span class="hub-card-btn">Ver percurso e estratégia →</span>
          </div>
        </a>
`;
}

// ---------- build ----------
async function buildEstrategia({ rootDir, compilePageComponents }) {
  const base = path.join(rootDir, "percursos");
  if (!fs.existsSync(base)) return;
  const templatePath = path.join(base, "assets", "corrida.template.html");
  const template = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, "utf8") : null;
  // A versão (?v=) dos arquivos é preenchida pelo compilePageComponents do build-blog.js, no site todo.
  const races = [];

  for (const slug of fs.readdirSync(base).sort()) {
    const dir = path.join(base, slug);
    if (slug === "assets" || !fs.statSync(dir).isDirectory()) continue;
    const configPath = path.join(dir, "estrategia.config.json");
    const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf8")) : null;

    if (config && config.pagina && template) {
      const data = loadCourseData(dir);
      await ensureOgImage(dir);
      const analysis = analyze(data);
      const nomeImg = (config.pagina && config.pagina.nome) || (config.metadata && config.metadata.name) || slug;
      const imagens = await require("./estrategia-imagens.js").ensureRouteImages(dir, data, rootDir, `${nomeImg} ${String(validDate(data.race.date) || "").slice(0, 4)}`.trim());
      // nomes de rua do OpenStreetMap; config.pagina.ruasCorrecoes corrige grafias (ex.: "Estrêla" -> "Estrela")
      const correcoes = (config.pagina && config.pagina.ruasCorrecoes) || {};
      const ruas = (await require("./estrategia-ruas.js").ruasDoPercurso(dir, data).catch(() => []))
        .map((r) => ({ ...r, rua: correcoes[r.rua] || r.rua }));
      const built = buildValues(slug, dir, config, data, analysis, imagens, ruas);
      const html = compilePageComponents(fill(template, built.values), false);
      fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
      if (!validDate(data.race.date)) console.warn(`   ⚠️ ${slug}: preencha race.date (AAAA-MM-DD) no estrategia.config.json para a data aparecer no card e o modo pós-prova funcionar`);
      races.push({ slug, dir, config, data, analysis, ...built });
      console.log(`   💾 Estratégia de prova gerada pelo config: percursos/${slug}/index.html`);
    } else if (fs.existsSync(path.join(dir, "index.template.html"))) {
      // jeito antigo: template próprio da pasta
      const html = compilePageComponents(fs.readFileSync(path.join(dir, "index.template.html"), "utf8"), false);
      fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
      console.log(`   💾 Estratégia de prova compilada (template próprio): percursos/${slug}/index.html`);
    }
  }

  // Página raiz: cards e lista para o Google em ordem de data
  const hubTemplatePath = path.join(base, "index.template.html");
  if (fs.existsSync(hubTemplatePath)) {
    races.sort((x, y) => String(validDate(x.data.race.date) || "9999").localeCompare(String(validDate(y.data.race.date) || "9999")));
    let hub = fs.readFileSync(hubTemplatePath, "utf8");
    hub = hub.replace("<!-- ESTRATEGIA_CARDS -->", races.map(renderCard).join("\n").trimEnd());
    // Percursos agrupados por cidade (ajuda nas buscas "percurso corrida <cidade>")
    const porCidade = {};
    races.forEach((r) => { const k = r.city || "Outras cidades"; (porCidade[k] = porCidade[k] || []).push(r); });
    const cidadesHtml = Object.keys(porCidade).sort((x, y) => x.localeCompare(y, "pt-BR")).map((cidade) => `      <div class="hub-city">
        <h3>Percursos de corrida em ${esc(cidade)}</h3>
        <ul>
${porCidade[cidade].map((r) => {
          const d = validDate(r.data.race.date);
          const quando = d ? ` · ${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : "";
          return `          <li><a href="/percursos/${r.slug}/">Percurso da ${esc(r.nome)}</a> <span>${esc(r.kmLabel)} km${quando}</span></li>`;
        }).join("\n")}
        </ul>
      </div>`).join("\n");
    hub = hub.replace("<!-- ESTRATEGIA_CIDADES -->", races.length ? `    <section class="hub-cities" aria-labelledby="hubCidadesTitulo">
      <h2 id="hubCidadesTitulo">Percursos por cidade</h2>
${cidadesHtml}
    </section>` : "");
    hub = hub.replace("<!-- ESTRATEGIA_ITEMLIST -->", races.map((r, i) =>
      `{ "@type": "ListItem", "position": ${i + 1}, "name": "${esc(r.values.NOME_BREADCRUMB)}", "url": "${SITE}/percursos/${r.slug}/" }`).join(",\n      "));
    fs.writeFileSync(path.join(base, "index.html"), compilePageComponents(hub, false), "utf8");
    console.log(`💾 Página raiz da Estratégia de Prova gerada com ${races.length} corrida(s): percursos/index.html`);
  }
}

module.exports = { buildEstrategia, analyze, buildValues, loadCourseData };
