/**
 * Nomes das ruas do percurso, a partir do GPX (OpenStreetMap / Nominatim).
 *
 * Amostra o traçado a cada 150 m, pergunta ao Nominatim qual é a rua de cada ponto e junta
 * os trechos seguidos na mesma rua: "Av. X (km 0,0–0,9) → Rua Y (km 0,9–1,6) → …".
 *
 * Regras de uso do Nominatim: no máximo 1 consulta por segundo, User-Agent identificando o site
 * e cache dos resultados. As respostas ficam em <corrida>/ruas.json (vai para o git), então as
 * consultas só acontecem na primeira vez ou quando o percurso muda. Sem internet, o build segue
 * sem os nomes das ruas.
 *
 * Dados © colaboradores do OpenStreetMap (ODbL).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");

const UA = "KarinaFranzinSiteBuild/1.0 (+https://karinafranzin.com.br)";
const PASSO_M = 150;

function reverse(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=17&addressdetails=1&accept-language=pt-BR`;
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try {
          const j = JSON.parse(body);
          const a = j.address || {};
          resolve(a.road || a.pedestrian || a.footway || a.path || a.cycleway || null);
        } catch (e) { resolve(undefined); }
      });
    }).on("error", () => resolve(undefined));
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Pontos de amostra a cada PASSO_M metros do traçado limpo (km na escala oficial). */
function amostras(data) {
  const t = data.cleanTrack;
  const total = t[t.length - 1].dist;
  const official = (data.race && data.race.officialDistanceM) || total;
  const sc = official / total;
  const pts = [];
  for (let d = 25; d < total - 10; d += PASSO_M) {
    const i = t.findIndex((p) => p.dist >= d);
    const p = t[i < 0 ? t.length - 1 : i];
    pts.push({ km: Math.round(((d * sc) / 1000) * 100) / 100, lat: Number(p.lat.toFixed(5)), lon: Number(p.lon.toFixed(5)) });
  }
  return pts;
}

/**
 * Garante o ruas.json da corrida (consulta só o que falta) e devolve os trechos por rua.
 * @returns [{ rua, kmIni, kmFim }] ou [] se não houver dados
 */
async function ruasDoPercurso(dir, data) {
  const file = path.join(dir, "ruas.json");
  const pts = amostras(data);
  let cache = {};
  if (fs.existsSync(file)) {
    try { cache = JSON.parse(fs.readFileSync(file, "utf8")).pontos || {}; } catch (e) { cache = {}; }
  }
  const key = (p) => `${p.lat},${p.lon}`;
  const faltam = pts.filter((p) => !(key(p) in cache));
  if (faltam.length) {
    console.log(`   🛣️ Consultando nomes de ruas no OpenStreetMap (${faltam.length} pontos, ~${Math.ceil(faltam.length * 1.1)}s)...`);
    for (const p of faltam) {
      const rua = await reverse(p.lat, p.lon);
      if (rua === undefined) { console.warn("   ⚠️ Sem acesso ao Nominatim: nomes de ruas incompletos"); break; }
      cache[key(p)] = rua;
      await wait(1100);
    }
    fs.writeFileSync(file, JSON.stringify({ _fonte: "OpenStreetMap / Nominatim (ODbL)", passoM: PASSO_M, pontos: cache }, null, 2) + "\n");
  }
  // O OSM às vezes grafa a mesma rua de dois jeitos ("Conego"/"Cônego", "Estrela"/"Estrêla"):
  // compara sem acento e mostra a grafia que mais aparece no percurso (empate: a que tem acento).
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const acentos = (s) => (s.match(/[^\x00-\x7f]/g) || []).length;
  const conta = {};
  pts.forEach((p) => { const r = cache[key(p)]; if (r) conta[r] = (conta[r] || 0) + 1; });
  const melhor = {};
  Object.keys(conta).forEach((r) => {
    const k = norm(r);
    const atual = melhor[k];
    if (!atual || conta[r] > conta[atual] || (conta[r] === conta[atual] && acentos(r) > acentos(atual))) melhor[k] = r;
  });
  // junta amostras seguidas na mesma rua; ignora trechos de uma amostra só no meio do caminho (cruzamentos)
  const runs = [];
  for (const p of pts) {
    const bruto = cache[key(p)];
    if (!bruto) continue;
    const k = norm(bruto);
    const last = runs[runs.length - 1];
    if (last && last.k === k) last.kmFim = p.km;
    else runs.push({ k, rua: melhor[k], kmIni: p.km, kmFim: p.km, n: 0 });
    runs[runs.length - 1].n++;
  }
  const limpos = runs.filter((r, i) => r.n >= 2 || i === 0 || i === runs.length - 1);
  // junta de novo o que ficou colado depois do filtro
  const out = [];
  for (const r of limpos) {
    const last = out[out.length - 1];
    if (last && last.k === r.k) last.kmFim = r.kmFim;
    else out.push({ k: r.k, rua: r.rua, kmIni: r.kmIni, kmFim: r.kmFim });
  }
  return out.map(({ k, ...r }) => r);
}

module.exports = { ruasDoPercurso };
