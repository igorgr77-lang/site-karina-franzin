/**
 * Onde correr em Votuporanga (/onde-correr-votuporanga/): hub dos locais de treino + uma página por local.
 *
 * Cada local é uma pasta em onde-correr-votuporanga/<slug>/ com:
 *   - local.json     → textos e informações do local (modelo comentado em onde-correr-votuporanga/LEIA-ME.md)
 *   - <percurso>.gpx → um GPX por percurso do local (tiro, 5 km, 10 km...), citado em local.json
 *
 * O build:
 *   1. lê o GPX de cada percurso, calcula distância, ganho de altitude e altitude mínima/máxima;
 *   2. gera <id>-mapa.webp (traçado sobre o OpenStreetMap) e <id>-altimetria.webp;
 *   3. escreve <slug>/index.html a partir de assets/local.template.html;
 *   4. escreve o hub (index.html) com os cards, os filtros e os percursos das provas da cidade.
 *
 * Publicação aos poucos: só os locais com "publicado": true aparecem no hub, no sitemap e no llms.txt.
 * Os outros viram card "em breve" (sem link) e a página deles sai com noindex, para revisar pelo
 * endereço direto. O hub também fica noindex enquanto nenhum local estiver publicado.
 * Pastas que começam com "_" (ex.: _modelo) são ignoradas.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const SITE = "https://karinafranzin.com.br";
const BASE_URL = "/onde-correr-votuporanga";
const CIDADE = "Votuporanga";
const UA_FMT = (v, d = 1) => Number(v).toFixed(d).replace(".", ",");

// Etiquetas aceitas em "tags" (ordem = ordem dos filtros do hub)
const TAGS = {
  tiro: "Treino de tiro",
  "5km": "5 km",
  "10km": "10 km",
  longao: "Longão",
  terra: "Terra",
  plano: "Plano",
  subida: "Subida",
  iluminado: "Iluminado à noite"
};

// Campos de "info" (ordem e rótulo do quadro de informações)
const INFO = [
  ["endereco", "Endereço"],
  ["volta", "Tamanho da volta"],
  ["piso", "Piso"],
  ["iluminacao", "Iluminação"],
  ["sombra", "Sombra"],
  ["agua", "Água / bebedouro"],
  ["banheiro", "Banheiro"],
  ["estacionamento", "Estacionamento"],
  ["melhorHorario", "Melhor horário"],
  ["seguranca", "Segurança e movimento"]
];

const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- GPX ----------
const R = 6371000;
function haversine(a, b) {
  const t = Math.PI / 180;
  const dLat = (b.lat - a.lat) * t;
  const dLon = (b.lon - a.lon) * t;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function parseGpx(xml) {
  const pts = [];
  const re = /<(trkpt|rtept)\s+([^>]*)>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(xml))) {
    const lat = parseFloat((m[2].match(/lat="([^"]+)"/) || [])[1]);
    const lon = parseFloat((m[2].match(/lon="([^"]+)"/) || [])[1]);
    const ele = parseFloat((m[3].match(/<ele>([^<]+)<\/ele>/) || [])[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) pts.push({ lat, lon, ele });
  }
  return pts;
}

/** Trilha com distância acumulada e altitude suavizada (o GPS do relógio oscila alguns metros). */
function analisarGpx(file) {
  const raw = parseGpx(fs.readFileSync(file, "utf8"));
  const track = [];
  let dist = 0;
  raw.forEach((p) => {
    const prev = track[track.length - 1];
    const step = prev ? haversine(prev, p) : 0;
    if (prev && step < 0.5) return; // ponto repetido
    dist += step;
    track.push({ lat: p.lat, lon: p.lon, ele: p.ele, dist, origIdx: track.length });
  });
  if (track.length < 2) throw new Error("GPX sem pontos suficientes");
  const temAltitude = track.every((p) => Number.isFinite(p.ele));
  if (temAltitude) {
    const raio = 35;
    let a = 0, b = 0, soma = 0;
    const suave = track.map((p) => {
      while (b < track.length && track[b].dist <= p.dist + raio) soma += track[b++].ele;
      while (track[a].dist < p.dist - raio) soma -= track[a++].ele;
      return soma / (b - a);
    });
    track.forEach((p, i) => { p.ele = suave[i]; });
  }
  let ganho = 0, perda = 0;
  if (temAltitude) for (let i = 1; i < track.length; i++) {
    const d = track[i].ele - track[i - 1].ele;
    if (d > 0) ganho += d; else perda -= d;
  }
  const ini = track[0], fim = track[track.length - 1];
  const es = track.map((p) => p.ele);
  return {
    track,
    distM: fim.dist,
    ganho, perda, temAltitude,
    minEle: temAltitude ? Math.min(...es) : null,
    maxEle: temAltitude ? Math.max(...es) : null,
    desnivel: temAltitude ? fim.ele - ini.ele : null,
    volta: haversine(ini, fim) < 150,
    inicio: { lat: ini.lat, lon: ini.lon }
  };
}

// ---------- imagens ----------
async function renderAltimetria(sharp, a, out, legenda) {
  const W = 1200, H = 440, L = 70, Rm = 30, T = 60, B = 50;
  const t = a.track;
  const total = a.distM;
  const mn = Math.floor((a.minEle - 4) / 5) * 5;
  const mx = Math.max(mn + 20, Math.ceil((a.maxEle + 4) / 5) * 5);
  const X = (d) => L + (d / total) * (W - L - Rm);
  const Y = (e) => T + (1 - (e - mn) / (mx - mn)) * (H - T - B);
  let grid = "";
  const stepE = mx - mn > 120 ? 20 : mx - mn > 40 ? 10 : 5;
  for (let e = Math.ceil(mn / stepE) * stepE; e <= mx; e += stepE) grid += `<line x1="${L}" x2="${W - Rm}" y1="${Y(e)}" y2="${Y(e)}" stroke="#e5e7eb"/><text x="${L - 10}" y="${Y(e) + 5}" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="end">${e} m</text>`;
  const stepD = total > 8000 ? 2000 : total > 2500 ? 1000 : total > 1000 ? 250 : 100;
  for (let d = 0; d <= total + 1; d += stepD) {
    const lbl = stepD >= 1000 ? `km ${d / 1000}` : `${d} m`;
    grid += `<line x1="${X(d)}" x2="${X(d)}" y1="${T}" y2="${H - B}" stroke="#f1f5f9"/><text x="${X(d)}" y="${H - B + 24}" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">${lbl}</text>`;
  }
  const top = t.map((p) => `${X(p.dist).toFixed(1)},${Y(p.ele).toFixed(1)}`).join(" ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#ffffff"/>
    <text x="${L}" y="30" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1a1a1a">${esc(legenda)}</text>
    ${grid}<polygon points="${X(0)},${H - B} ${top} ${X(total)},${H - B}" fill="#ff6b35" fill-opacity="0.3"/><polyline points="${top}" fill="none" stroke="#ff6b35" stroke-width="3"/></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(out);
}

/** Gera mapa e altimetria do percurso quando o GPX é mais novo que as imagens. */
async function imagensDoPercurso(dir, id, gpxFile, a, nome, rootDir) {
  let sharp;
  try { sharp = require("sharp"); } catch (e) { sharp = null; }
  const mapa = path.join(dir, `${id}-mapa.webp`);
  const alt = path.join(dir, `${id}-altimetria.webp`);
  const gpxTime = fs.statSync(gpxFile).mtimeMs;
  const fresco = (f) => fs.existsSync(f) && fs.statSync(f).mtimeMs >= gpxTime;
  if (sharp && !fresco(alt) && a.temAltitude) {
    await renderAltimetria(sharp, a, alt, `Altimetria · ${nome}`);
    console.log(`   🖼️ Altimetria gerada: ${path.relative(rootDir, alt)}`);
  }
  if (sharp && !fresco(mapa)) {
    const last = a.track.length - 1;
    const data = {
      cleanTrack: a.track,
      segmentDefinitions: [{ id: "", type: "percurso", startOrigIdx: 0, endOrigIdx: last }],
      race: { officialDistanceM: a.distM }
    };
    const ok = await require("./estrategia-imagens.js").renderMap(sharp, data, mapa, rootDir, `Mapa · ${nome}`).catch(() => false);
    if (ok) console.log(`   🗺️ Mapa gerado: ${path.relative(rootDir, mapa)}`);
    else console.warn(`   ⚠️ Mapa não gerado (sem acesso ao OpenStreetMap?): ${path.relative(rootDir, mapa)}`);
  }
  return { mapa: fs.existsSync(mapa), altimetria: fs.existsSync(alt) };
}

/** Imagem 1200x630 para a prévia do link (WhatsApp/Instagram) a partir do primeiro mapa do local. */
async function ogDoLocal(dir, mapaFile) {
  const out = path.join(dir, "og.jpg");
  if (fs.existsSync(path.join(dir, "banner-og.jpg"))) return "banner-og.jpg";
  if (!mapaFile || !fs.existsSync(mapaFile)) return null;
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(mapaFile).mtimeMs) return "og.jpg";
  try {
    await require("sharp")(mapaFile).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82 }).toFile(out);
    return "og.jpg";
  } catch (e) { return null; }
}

// ---------- HTML ----------
function distTxt(m) {
  return m >= 950 ? `${UA_FMT(m / 1000, m >= 10000 ? 1 : 2)} km` : `${Math.round(m / 10) * 10} m`;
}

function resumoDoPercurso(p, a) {
  const partes = [`O traçado mede <strong>${distTxt(a.distM)}</strong>`];
  partes[0] += a.volta ? ", com saída e chegada no mesmo ponto" : ", com saída e chegada em pontos diferentes";
  if (a.temAltitude) {
    if (p.tipo === "tiro") {
      const media = (a.desnivel / a.distM) * 100;
      partes.push(Math.abs(media) < 1
        ? `É praticamente plano (desnível de ${UA_FMT(Math.abs(a.desnivel))} m), bom para tiros em ritmo constante`
        : `${a.desnivel > 0 ? "Sobe" : "Desce"} ${UA_FMT(Math.abs(a.desnivel))} m no trecho (inclinação média de ${UA_FMT(Math.abs(media))}%)`);
    } else {
      partes.push(a.ganho < 15
        ? `É praticamente plano, com +${Math.round(a.ganho)} m de ganho acumulado`
        : `Tem +${Math.round(a.ganho)} m de ganho acumulado, com altitude entre ${Math.round(a.minEle)} m e ${Math.round(a.maxEle)} m`);
    }
  }
  return partes.join(". ") + ".";
}

function secaoPercurso(slug, local, p, a, imgs) {
  const id = esc(p.id);
  const titulo = esc(p.titulo || TAGS[p.tipo] || p.id);
  const ga = `onde_correr_${slug.replace(/-/g, "_")}`;
  const dicas = (p.dicas || []).length ? `
      <h3>Dicas da treinadora</h3>
      <ul class="route-steps">
${p.dicas.map((d) => `        <li>${esc(d)}</li>`).join("\n")}
      </ul>` : "";
  const treino = p.sugestaoTreino ? `
      <h3>Sugestão de treino</h3>
      <p class="route-summary">${esc(p.sugestaoTreino)}</p>` : "";
  if (!a) {
    return `    <section id="${id}" class="route-section" aria-labelledby="${id}Titulo">
      <h2 id="${id}Titulo">${titulo}</h2>
      ${p.texto ? `<p class="route-summary">${esc(p.texto)}</p>` : ""}
      <p class="oc-pendente">Percurso em gravação: o mapa, a altimetria e o GPX entram aqui em breve.</p>${dicas}${treino}
    </section>`;
  }
  const nomeImg = `${titulo} ${local.artigo || "no"} ${local.nome}`;
  const figuras = [
    imgs.mapa && `        <figure class="route-figure">
          <img src="${BASE_URL}/${slug}/${id}-mapa.webp?v=auto" width="1200" height="800" loading="lazy" decoding="async" alt="${esc(`Mapa do percurso: ${nomeImg}, em ${CIDADE}`)}">
          <figcaption>Mapa do percurso: ${esc(nomeImg)}. Mapa © colaboradores do OpenStreetMap.</figcaption>
        </figure>`,
    imgs.altimetria && `        <figure class="route-figure">
          <img src="${BASE_URL}/${slug}/${id}-altimetria.webp?v=auto" width="1200" height="440" loading="lazy" decoding="async" alt="${esc(`Altimetria do percurso: ${nomeImg}`)}">
          <figcaption>Altimetria do percurso: ${esc(nomeImg)}.</figcaption>
        </figure>`
  ].filter(Boolean).join("\n");
  return `    <section id="${id}" class="route-section" aria-labelledby="${id}Titulo">
      <h2 id="${id}Titulo">${titulo}</h2>
      <p class="route-summary">${resumoDoPercurso(p, a)}${p.texto ? ` ${esc(p.texto)}` : ""}</p>
      ${figuras ? `<div class="route-figures">\n${figuras}\n      </div>` : ""}${dicas}${treino}
      <p class="route-gpx"><a href="${BASE_URL}/${slug}/${esc(p.gpx)}" download="${esc(`${slug}-${p.id}.gpx`)}" class="btn-primary" data-gtag-event="onde_correr_baixar_gpx" data-gtag-category="${ga}">Baixar o GPX (${distTxt(a.distM)})</a></p>
    </section>`;
}

function tagsHtml(tags) {
  return (tags || []).filter((t) => TAGS[t]).map((t) => `<span class="oc-tag">${esc(TAGS[t])}</span>`).join("");
}

function renderCardLocal(l) {
  const c = l.config;
  const tags = (c.tags || []).filter((t) => TAGS[t]);
  const corpo = `
          <div class="hub-card-body">
            <span class="hub-card-city">${esc(c.bairro ? `${c.bairro} · ${CIDADE}` : CIDADE)}</span>
            <h3 class="hub-card-title">${esc(c.nome)}</h3>
            <p class="hub-card-desc">${esc(c.resumo || "")}</p>
            <div class="oc-tags">${tagsHtml(tags)}</div>
            ${l.publicado ? `<span class="hub-card-btn">Ver percursos e dicas →</span>` : `<span class="hub-card-btn hub-card-btn-ghost">Em breve</span>`}
          </div>`;
  const img = l.capa
    ? `
          <div class="hub-card-profile"><img src="${BASE_URL}/${l.slug}/${l.capa}?v=auto" width="1200" height="800" alt="${esc(`Mapa dos percursos de corrida ${c.artigo || "no"} ${c.nome}, ${CIDADE}`)}" loading="lazy" decoding="async"></div>`
    : "";
  return l.publicado
    ? `        <a href="${BASE_URL}/${l.slug}/" class="hub-card oc-card" data-tags="${tags.join(" ")}" data-gtag-event="onde_correr_abrir_local" data-gtag-category="${l.slug.replace(/-/g, "_")}">${img}${corpo}
        </a>`
    : `        <div class="hub-card hub-card-soon oc-card" data-tags="${tags.join(" ")}">${corpo}
        </div>`;
}

/** Percursos das provas de Votuporanga que já estão em /percursos/ (sem duplicar páginas). */
function provasDaCidade(rootDir) {
  const base = path.join(rootDir, "percursos");
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter((s) => s !== "assets").map((slug) => {
    const f = path.join(base, slug, "estrategia.config.json");
    if (!fs.existsSync(f) || !fs.existsSync(path.join(base, slug, "index.html"))) return null;
    const c = JSON.parse(fs.readFileSync(f, "utf8"));
    const cidade = (c.metadata && c.metadata.city) || "";
    if (!cidade.toLowerCase().includes(CIDADE.toLowerCase())) return null;
    const nome = (c.pagina && c.pagina.nome) || (c.metadata && c.metadata.name) || slug;
    const km = c.race && c.race.officialDistanceM ? UA_FMT(c.race.officialDistanceM / 1000, c.race.officialDistanceM % 1000 ? 1 : 0) : "";
    const date = (c.race && c.race.date) || "";
    return { slug, nome, km, date };
  }).filter(Boolean).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function fill(template, values) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, k) => (k in values ? values[k] : m));
}

// ---------- build ----------
async function buildOndeCorrer({ rootDir, compilePageComponents }) {
  const base = path.join(rootDir, "onde-correr-votuporanga");
  if (!fs.existsSync(base)) return { hubIndexavel: false, publicados: [] };
  const localTpl = fs.readFileSync(path.join(base, "assets", "local.template.html"), "utf8");
  const locais = [];

  for (const slug of fs.readdirSync(base).sort()) {
    const dir = path.join(base, slug);
    if (slug === "assets" || slug.startsWith("_") || !fs.statSync(dir).isDirectory()) continue;
    const cfgFile = path.join(dir, "local.json");
    if (!fs.existsSync(cfgFile)) continue;
    const config = JSON.parse(fs.readFileSync(cfgFile, "utf8"));
    locais.push({ slug, dir, config, publicado: config.publicado === true });
  }
  const publicados = locais.filter((l) => l.publicado);

  for (const l of locais) {
    const { slug, dir, config: c } = l;
    let geo = null;
    let capaFile = null;
    const secoes = [];
    const resumos = [];
    for (const p of c.percursos || []) {
      const gpxFile = p.gpx && path.join(dir, p.gpx);
      let a = null, imgs = {};
      if (gpxFile && fs.existsSync(gpxFile)) {
        try {
          a = analisarGpx(gpxFile);
          imgs = await imagensDoPercurso(dir, p.id, gpxFile, a, `${p.titulo || p.id} · ${c.nome}`, rootDir);
          geo = geo || a.inicio;
          if (imgs.mapa && !capaFile) capaFile = `${p.id}-mapa.webp`;
          resumos.push(`${p.titulo || TAGS[p.tipo] || p.id} (${distTxt(a.distM)})`);
        } catch (e) {
          console.warn(`   ⚠️ ${slug}/${p.gpx}: ${e.message}`);
        }
      } else if (p.gpx && l.publicado) {
        console.warn(`   ⚠️ ${slug}: GPX "${p.gpx}" ainda não está na pasta (seção sai como "em gravação")`);
      }
      secoes.push(secaoPercurso(slug, c, p, a, imgs));
    }
    l.capa = capaFile;
    l.resumoPercursos = resumos;
    const og = await ogDoLocal(dir, capaFile && path.join(dir, capaFile));

    const info = INFO.filter(([k]) => c.info && c.info[k]).map(([k, rot]) => {
      let v = esc(c.info[k]);
      if (k === "endereco" && c.mapsUrl) v += ` · <a href="${esc(c.mapsUrl)}" target="_blank" rel="noopener noreferrer">ver no mapa</a>`;
      return `        <div><dt>${esc(rot)}</dt><dd>${v}</dd></div>`;
    }).join("\n");
    const indice = (c.percursos || []).map((p) => `<a href="#${esc(p.id)}">${esc(p.titulo || TAGS[p.tipo] || p.id)}</a>`).join("");
    const outros = publicados.filter((o) => o.slug !== slug);
    const faq = (c.faq || []).filter((f) => f.p && f.r);

    const noNome = `${c.artigo || "no"} ${c.nome}`;
    const url = `${SITE}${BASE_URL}/${slug}/`;
    const titulo = (c.seo && c.seo.titulo) || `Correr ${noNome} em ${CIDADE}: percursos e treino de tiro`;
    const descricao = (c.seo && c.seo.descricao) || `${c.resumo || ""} Mapa, altimetria e GPX de cada percurso, com dicas da treinadora Karina Franzin.`.trim();
    const schemas = [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: `Onde correr em ${CIDADE}`, item: `${SITE}${BASE_URL}/` },
        { "@type": "ListItem", position: 3, name: c.nome, item: url }
      ] },
      Object.assign({ "@context": "https://schema.org", "@type": "SportsActivityLocation", name: c.nome, url,
        description: c.resumo || "",
        address: { "@type": "PostalAddress", streetAddress: (c.info && c.info.endereco) || undefined, addressLocality: CIDADE, addressRegion: "SP", addressCountry: "BR" } },
        geo ? { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lon } } : {},
        c.mapsUrl ? { hasMap: c.mapsUrl } : {})
    ];
    if (faq.length) schemas.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })) });

    const values = {
      TITULO: esc(titulo),
      DESCRICAO: esc(descricao),
      URL: url,
      ROBOTS: l.publicado ? "index, follow" : "noindex, follow",
      OG_IMAGE: og ? `${SITE}${BASE_URL}/${slug}/${og}` : `${SITE}/percursos/og-percursos.jpg`,
      SCHEMAS: schemas.map((s) => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`).join("\n"),
      NOME: esc(c.nome),
      NO_NOME: esc(noNome),
      BAIRRO: esc(c.bairro ? `${c.bairro} · ${CIDADE}` : CIDADE),
      H1: esc(c.h1 || `Correr ${noNome}`),
      RESUMO: esc(c.resumo || ""),
      TAGS: tagsHtml(c.tags),
      AVISO_RASCUNHO: l.publicado ? "" : `<p class="oc-rascunho">Rascunho: esta página ainda não foi publicada (fora do Google e do hub).</p>`,
      INFO: info ? `      <dl class="race-info">\n${info}\n      </dl>` : "",
      INTRODUCAO: (c.introducao ? [].concat(c.introducao) : []).map((t) => `      <p class="route-summary">${esc(t)}</p>`).join("\n"),
      INDICE: indice ? `<nav class="oc-indice" aria-label="Percursos deste local"><span>Nesta página:</span>${indice}</nav>` : "",
      PERCURSOS: secoes.join("\n\n"),
      FAQ: faq.length ? `    <section class="faq-section" aria-labelledby="faqTitulo">
      <h2 id="faqTitulo">Dúvidas sobre correr ${esc(noNome)}</h2>
${faq.map((f) => `      <details class="faq-item"><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join("\n")}
    </section>` : "",
      OUTROS: outros.length ? `    <section class="route-section" aria-labelledby="outrosTitulo">
      <h2 id="outrosTitulo">Outros lugares para correr em ${CIDADE}</h2>
      <ul class="oc-outros">
${outros.map((o) => `        <li><a href="${BASE_URL}/${o.slug}/">${esc(o.config.nome)}</a> <span>${esc(o.config.resumo || "")}</span></li>`).join("\n")}
      </ul>
    </section>` : ""
    };
    fs.writeFileSync(path.join(dir, "index.html"), compilePageComponents(fill(localTpl, values), false), "utf8");
    console.log(`   💾 Onde correr: ${BASE_URL.slice(1)}/${slug}/index.html${l.publicado ? "" : " (rascunho, noindex)"}`);
  }

  // ---------- hub ----------
  const hubTpl = path.join(base, "index.template.html");
  const hubIndexavel = publicados.length > 0;
  if (fs.existsSync(hubTpl)) {
    const ordem = [...publicados, ...locais.filter((l) => !l.publicado)];
    const usadas = Object.keys(TAGS).filter((t) => ordem.some((l) => (l.config.tags || []).includes(t)));
    const filtros = usadas.length ? `<div class="oc-filtros" role="group" aria-label="Filtrar locais por tipo de treino">
          <button type="button" class="oc-filtro is-ativo" data-filtro="" aria-pressed="true">Todos</button>
${usadas.map((t) => `          <button type="button" class="oc-filtro" data-filtro="${t}" aria-pressed="false">${esc(TAGS[t])}</button>`).join("\n")}
        </div>` : "";
    const provas = provasDaCidade(rootDir);
    const provasHtml = provas.length ? `    <section class="hub-cities" aria-labelledby="provasTitulo">
      <h2 id="provasTitulo">Percursos das provas de ${CIDADE}</h2>
      <div class="hub-city">
        <p>Quer treinar no traçado de uma prova da cidade? Veja o mapa, a altimetria e o GPX de cada uma.</p>
        <ul>
${provas.map((r) => {
      const quando = r.date ? ` · ${r.date.slice(8, 10)}/${r.date.slice(5, 7)}/${r.date.slice(0, 4)}` : "";
      return `          <li><a href="/percursos/${r.slug}/">Percurso da ${esc(r.nome)}</a> <span>${esc(r.km)} km${quando}</span></li>`;
    }).join("\n")}
        </ul>
      </div>
    </section>` : "";
    const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: `Onde correr em ${CIDADE}`,
      itemListElement: publicados.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.config.nome, url: `${SITE}${BASE_URL}/${l.slug}/` })) };
    let hub = fs.readFileSync(hubTpl, "utf8");
    hub = hub
      .replace("{{ROBOTS}}", hubIndexavel ? "index, follow" : "noindex, follow")
      .replace("<!-- OC_ITEMLIST -->", publicados.length ? `<script type="application/ld+json">\n${JSON.stringify(itemList, null, 2)}\n  </script>` : "")
      .replace("<!-- OC_FILTROS -->", filtros)
      .replace("<!-- OC_CARDS -->", ordem.map(renderCardLocal).join("\n"))
      .replace("<!-- OC_PROVAS -->", provasHtml);
    fs.writeFileSync(path.join(base, "index.html"), compilePageComponents(hub, false), "utf8");
    console.log(`💾 Hub Onde correr em ${CIDADE}: ${publicados.length} local(is) publicado(s) de ${locais.length}${hubIndexavel ? "" : " (hub em noindex até publicar o 1º local)"}`);
  }

  return {
    hubIndexavel,
    publicados: publicados.map((l) => ({ slug: l.slug, nome: l.config.nome, resumo: l.config.resumo || "", percursos: l.resumoPercursos || [] }))
  };
}

module.exports = { buildOndeCorrer, analisarGpx, TAGS };
