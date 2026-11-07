#!/usr/bin/env node
/**
 * Gera o course-data.js de uma corrida da Estratégia de Prova a partir do GPX.
 *
 * Uso:
 *   node scripts/gerar-course-data.js estrategia-de-prova/<pasta-da-corrida>
 *
 * A pasta precisa ter:
 *   - o arquivo .gpx da prova
 *   - estrategia.config.json (opcional na 1ª rodada; o script cria um modelo se não existir)
 *
 * O script:
 *   1. Lê o GPX e calcula distância, desnível e inclinação ponto a ponto (trilha "bruta").
 *   2. Limpa a trilha: remove pontos duplicados e "vai-e-vem" de clique (picos de ida e volta)
 *      e suaviza o ruído de altitude (picos falsos de inclinação).
 *   3. Divide o percurso em segmentos de subida/descida (automático ou pelos cortes do config).
 *   4. Escreve course-data.js e <nome>_LIMPO.gpx na pasta, e imprime um resumo para escrever as dicas.
 *
 * Os textos (nomes dos segmentos, dicas táticas) ficam no estrategia.config.json, então dá para
 * rodar o script de novo a qualquer momento sem perder nada.
 */
"use strict";

const fs = require("fs");
const path = require("path");

// ---------- Parâmetros de limpeza (podem ser sobrescritos em config.limpeza) ----------
const DEFAULTS = {
  duplicadoM: 0.5, // pontos a menos disso do anterior são descartados
  vaiEVemMinM: 30, // ida + volta mínima para considerar um "vai-e-vem" de clique
  vaiEVemRazao: 0.25, // se a distância direta for < 25% da ida+volta, é vai-e-vem
  suavizacaoM: 35, // raio (m) da média móvel de altitude
  limiarOndaM: 5, // desnível mínimo para virar um novo segmento (detecção automática)
  segmentoMinM: 300 // segmentos menores que isso são juntados ao vizinho
};

const COLORS = { downhill: "#10b981", uphill: "#f59e0b", climb: "#ef4444", rolling: "#3b82f6" };

// ---------- Utilidades ----------
const R = 6371000;
function haversine(a, b) {
  const t = Math.PI / 180;
  const dLat = (b.lat - a.lat) * t;
  const dLon = (b.lon - a.lon) * t;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const fmt = (v, d = 1) => v.toFixed(d).replace(".", ",");
const fmtSigned = (v, d = 1) => (v >= 0 ? "+" : "") + fmt(v, d);

function parseGpx(xml) {
  const pts = [];
  const re = /<(trkpt|rtept)\s+([^>]*)>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(xml))) {
    const lat = parseFloat((m[2].match(/lat="([^"]+)"/) || [])[1]);
    const lon = parseFloat((m[2].match(/lon="([^"]+)"/) || [])[1]);
    const ele = parseFloat((m[3].match(/<ele>([^<]+)<\/ele>/) || [])[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) pts.push({ lat, lon, ele: Number.isFinite(ele) ? ele : NaN });
  }
  if (pts.some((p) => Number.isNaN(p.ele))) throw new Error("O GPX não tem altitude (<ele>) em todos os pontos.");
  return pts;
}

/** Calcula dist, stepDist, de e grade de uma lista de pontos. */
function withMetrics(list) {
  let dist = 0;
  return list.map((p, i) => {
    let stepDist = 0;
    let de = 0;
    let grade = 0;
    if (i > 0) {
      const prev = list[i - 1];
      stepDist = haversine(prev, p);
      dist += stepDist;
      de = p.ele - prev.ele;
      if (stepDist > 0.5) grade = (de / stepDist) * 100;
    }
    return {
      origIdx: p.origIdx,
      idx: i,
      lat: Math.round(p.lat * 1e6) / 1e6,
      lon: Math.round(p.lon * 1e6) / 1e6,
      ele: r2(p.ele),
      dist: r1(dist),
      stepDist: r1(stepDist),
      de: r2(de),
      grade: r2(grade)
    };
  });
}

function gainLoss(track) {
  let up = 0;
  let down = 0;
  track.forEach((p) => {
    if (p.de > 0) up += p.de;
    else down -= p.de;
  });
  return { up, down };
}

// ---------- Programa ----------
const dirArg = process.argv[2];
if (!dirArg) {
  console.error("Uso: node scripts/gerar-course-data.js estrategia-de-prova/<pasta-da-corrida>");
  process.exit(1);
}
const dir = path.resolve(dirArg);
const configPath = path.join(dir, "estrategia.config.json");
let config = {};
if (fs.existsSync(configPath)) config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const P = Object.assign({}, DEFAULTS, config.limpeza || {});

const gpxName =
  config.gpx || fs.readdirSync(dir).find((f) => f.toLowerCase().endsWith(".gpx") && !/_LIMPO\.gpx$/i.test(f));
if (!gpxName) {
  console.error("Nenhum .gpx encontrado em", dir);
  process.exit(1);
}
const gpxXml = fs.readFileSync(path.join(dir, gpxName), "utf8");
const original = parseGpx(gpxXml).map((p, i) => ({ ...p, origIdx: i }));
const rawTrack = withMetrics(original);
const rawStats = gainLoss(rawTrack);

// 1. Limpeza geométrica: duplicados e vai-e-vem
const anomalies = [];
let kept = [original[0]];
let duplicates = 0;
for (let i = 1; i < original.length; i++) {
  if (haversine(kept[kept.length - 1], original[i]) < P.duplicadoM) {
    duplicates++;
    continue;
  }
  kept.push(original[i]);
}
let changed = true;
while (changed) {
  changed = false;
  for (let i = 1; i < kept.length - 1; i++) {
    const a = haversine(kept[i - 1], kept[i]);
    const b = haversine(kept[i], kept[i + 1]);
    const c = haversine(kept[i - 1], kept[i + 1]);
    if (a + b > P.vaiEVemMinM && c < P.vaiEVemRazao * (a + b)) {
      const raw = rawTrack[kept[i].origIdx];
      anomalies.push({
        id: `vai-e-vem-${kept[i].origIdx}`,
        title: `Vai-e-vem de clique no Km ${fmt(raw.dist / 1000, 2)}`,
        points: `Ponto ${kept[i].origIdx}`,
        extraDistM: r1(a + b - c),
        description: `Em (${raw.lat.toFixed(5)}, ${raw.lon.toFixed(5)}) o traçado avança ${fmt(a)}m e volta ${fmt(b)}m para o mesmo lugar. O ponto foi removido da trilha limpa.`,
        lat: raw.lat,
        lon: raw.lon
      });
      kept.splice(i, 1);
      changed = true;
      break;
    }
  }
}

// 2. Suavização da altitude (média ponderada por distância num raio de P.suavizacaoM)
const keptMetrics = withMetrics(kept);
const smoothEle = keptMetrics.map((p) => {
  let sum = 0;
  let wsum = 0;
  for (const q of keptMetrics) {
    const d = Math.abs(q.dist - p.dist);
    if (d > P.suavizacaoM) continue;
    const w = 1 - d / (P.suavizacaoM + 1);
    sum += q.ele * w;
    wsum += w;
  }
  return sum / wsum;
});
const noisySteps = keptMetrics.filter((p) => p.stepDist > 1 && Math.abs(p.grade) > 10);
const cleanTrack = withMetrics(kept.map((p, i) => ({ ...p, ele: smoothEle[i] })));
const cleanStats = gainLoss(cleanTrack);
if (noisySteps.length) {
  const worst = noisySteps.reduce((w, p) => (Math.abs(p.grade) > Math.abs(w.grade) ? p : w), noisySteps[0]);
  anomalies.push({
    id: "ruido-altimetrico",
    title: `Ruído de altitude em ${noisySteps.length} trechos curtos`,
    points: `Pior caso no Km ${fmt(worst.dist / 1000, 2)}`,
    extraDistM: 0,
    description: `Saltos de altitude em trechos de poucos metros criam inclinações falsas (pior caso: ${fmtSigned(worst.grade)}% em ${fmt(worst.stepDist)}m). A trilha limpa suaviza a altitude num raio de ${P.suavizacaoM}m, e o desnível acumulado cai de +${fmt(rawStats.up)}m para +${fmt(cleanStats.up)}m.`
  });
}
if (duplicates) {
  anomalies.push({
    id: "pontos-duplicados",
    title: `${duplicates} ponto(s) duplicado(s)`,
    points: "Vários",
    extraDistM: 0,
    description: `Pontos a menos de ${P.duplicadoM}m do anterior, removidos da trilha limpa (não mudam a distância).`
  });
}

// 3. Segmentos
const totalM = cleanTrack[cleanTrack.length - 1].dist;
let cutIdx = []; // índices em cleanTrack onde cada segmento termina
if (Array.isArray(config.segmentos) && config.segmentos.length && config.segmentos.every((s) => s.ateKm != null)) {
  cutIdx = config.segmentos.map((s, i, arr) => {
    if (i === arr.length - 1) return cleanTrack.length - 1;
    const target = s.ateKm * 1000;
    let best = 0;
    cleanTrack.forEach((p, j) => {
      if (Math.abs(p.dist - target) < Math.abs(cleanTrack[best].dist - target)) best = j;
    });
    return best;
  });
} else {
  // Detecção automática de topos e vales (zigue-zague): um novo extremo só vale
  // depois que a altitude volta pelo menos P.limiarOndaM metros no sentido contrário.
  const ele = cleanTrack.map((p) => p.ele);
  const ext = [0];
  let dir = 0;
  let cand = 0;
  for (let j = 1; j < ele.length; j++) {
    if (dir === 0) {
      if (ele[j] - ele[0] >= P.limiarOndaM) { dir = 1; cand = j; }
      else if (ele[0] - ele[j] >= P.limiarOndaM) { dir = -1; cand = j; }
    } else if (dir === 1) {
      if (ele[j] > ele[cand]) cand = j;
      else if (ele[cand] - ele[j] >= P.limiarOndaM) { ext.push(cand); dir = -1; cand = j; }
    } else {
      if (ele[j] < ele[cand]) cand = j;
      else if (ele[j] - ele[cand] >= P.limiarOndaM) { ext.push(cand); dir = 1; cand = j; }
    }
  }
  if (ext[ext.length - 1] !== cleanTrack.length - 1) ext.push(cleanTrack.length - 1);
  // Junta segmentos curtos ao vizinho
  let merged = true;
  while (merged && ext.length > 2) {
    merged = false;
    for (let k = 1; k < ext.length; k++) {
      if (cleanTrack[ext[k]].dist - cleanTrack[ext[k - 1]].dist < P.segmentoMinM) {
        ext.splice(k === ext.length - 1 ? k - 1 : k, 1);
        merged = true;
        break;
      }
    }
  }
  cutIdx = ext.slice(1);
}

function classify(netEle, distM, gain) {
  const g = (netEle / distM) * 100;
  if (g >= 2.5 || (g >= 1.2 && gain >= 15)) return "climb";
  if (g >= 0.8) return "uphill";
  if (g <= -0.8) return "downhill";
  return "rolling";
}
const DEFAULT_TEXT = {
  downhill: { badge: "Descida", name: "Descida", cue: "Passada solta, quadril alto, sem frear." },
  uphill: { badge: "Subida Moderada", name: "Subida", cue: "Encurte a passada e mantenha o esforço, não o pace." },
  climb: { badge: "Subida Forte", name: "Subida forte", cue: "Braços ativos, olhar à frente, aceite perder segundos." },
  rolling: { badge: "Ondulado", name: "Trecho ondulado", cue: "Ritmo estável e respiração controlada." }
};

const segmentDefinitions = [];
let startIdx = 0;
cutIdx.forEach((endIdx, i) => {
  const s = cleanTrack[startIdx];
  const e = cleanTrack[endIdx];
  const slice = cleanTrack.slice(startIdx + 1, endIdx + 1);
  const gain = slice.reduce((a, p) => a + Math.max(0, p.de), 0);
  const loss = slice.reduce((a, p) => a + Math.max(0, -p.de), 0);
  const distM = e.dist - s.dist;
  const netEle = e.ele - s.ele;
  const type = classify(netEle, distM, gain);
  const txt = (config.segmentos && config.segmentos[i]) || {};
  const def = DEFAULT_TEXT[type];
  const id = i + 1;
  segmentDefinitions.push({
    id,
    name: txt.name || `${def.name} (Km ${fmt(s.dist / 1000)}–${fmt(e.dist / 1000)})`,
    shortName: txt.shortName || `Seg ${id} · ${def.name}`,
    type: txt.type || type,
    badge: txt.badge || def.badge,
    color: COLORS[txt.type || type],
    startOrigIdx: s.origIdx,
    endOrigIdx: e.origIdx,
    tacticalTitle: txt.tacticalTitle || `${fmtSigned(netEle)}m em ${Math.round(distM)}m`,
    tacticalTip:
      txt.tacticalTip ||
      `Do Km ${fmt(s.dist / 1000, 2)} ao ${fmt(e.dist / 1000, 2)}: sobe ${fmt(gain)}m e desce ${fmt(loss)}m (média ${fmtSigned((netEle / distM) * 100)}%).`,
    mentalCue: txt.mentalCue || def.cue,
    _resumo: { kmIni: s.dist / 1000, kmFim: e.dist / 1000, distM, netEle, gain, loss }
  });
  startIdx = endIdx;
});

// 4. Saída
const eles = cleanTrack.map((p) => p.ele);
const metadata = Object.assign(
  {
    name: path.basename(dir),
    city: "",
    author: gpxName,
    startElevation: cleanTrack[0].ele,
    minElevation: r2(Math.min(...eles)),
    maxElevation: r2(Math.max(...eles))
  },
  config.metadata || {},
  {
    stats: {
      rawDistM: rawTrack[rawTrack.length - 1].dist,
      cleanDistM: totalM,
      rawPoints: rawTrack.length,
      cleanPoints: cleanTrack.length,
      rawGainM: r1(rawStats.up),
      cleanGainM: r1(cleanStats.up),
      cleanLossM: r1(cleanStats.down)
    },
    anomaliesDetected: anomalies.map(({ lat, lon, ...a }) => a)
  }
);

const race = Object.assign({}, config.race || {});
if (!race.mapCenter) {
  const lats = cleanTrack.map((p) => p.lat);
  const lons = cleanTrack.map((p) => p.lon);
  race.mapCenter = [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lons) + Math.max(...lons)) / 2].map((v) => Math.round(v * 1e4) / 1e4);
}
if (!race.anomalyMarkers) {
  race.anomalyMarkers = anomalies.filter((a) => a.lat != null).map((a) => ({ lat: a.lat, lon: a.lon, title: a.title }));
}

const defsOut = segmentDefinitions.map(({ _resumo, ...d }) => d);
const js =
  `// Gerado por scripts/gerar-course-data.js a partir de "${gpxName}". NÃO edite à mão:\n` +
  `// mude o estrategia.config.json desta pasta e rode o script de novo.\n` +
  `window.COURSE_DATA = {\n` +
  `  race: ${JSON.stringify(race, null, 2).replace(/\n/g, "\n  ")},\n` +
  `  metadata: ${JSON.stringify(metadata, null, 2).replace(/\n/g, "\n  ")},\n` +
  `  segmentDefinitions: ${JSON.stringify(defsOut, null, 2).replace(/\n/g, "\n  ")},\n` +
  `  cleanTrack: ${JSON.stringify(cleanTrack)},\n` +
  `  rawTrack: ${JSON.stringify(rawTrack)}\n` +
  `};\n`;
fs.writeFileSync(path.join(dir, "course-data.js"), js, "utf8");

const baseName = (config.nomeArquivoLimpo || gpxName.replace(/\.gpx$/i, "")) + "_LIMPO.gpx";
const gpxOut =
  `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Karina Franzin - Estratégia de Prova" xmlns="http://www.topografix.com/GPX/1/1">\n` +
  `  <metadata><name>${(metadata.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</name></metadata>\n  <trk><name>${(metadata.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</name><trkseg>\n` +
  cleanTrack.map((p) => `    <trkpt lat="${p.lat}" lon="${p.lon}"><ele>${p.ele}</ele></trkpt>`).join("\n") +
  `\n  </trkseg></trk>\n</gpx>\n`;
fs.writeFileSync(path.join(dir, baseName), gpxOut, "utf8");

if (!fs.existsSync(configPath)) {
  const modelo = {
    gpx: gpxName,
    metadata: { name: "", city: "", author: "" },
    race: { title: "", officialDistanceM: Math.round(totalM / 1000) * 1000, halfwayDistM: Math.round(totalM / 2000) * 1000 },
    segmentos: segmentDefinitions.map((d) => ({
      ateKm: r2(d._resumo.kmFim),
      name: "",
      shortName: "",
      badge: "",
      tacticalTitle: "",
      tacticalTip: "",
      mentalCue: ""
    }))
  };
  fs.writeFileSync(configPath, JSON.stringify(modelo, null, 2) + "\n", "utf8");
  console.log("📝 Criado modelo de", path.relative(process.cwd(), configPath));
}

// Resumo
console.log(`\n✅ ${path.relative(process.cwd(), path.join(dir, "course-data.js"))} e ${baseName} gerados`);
console.log(`   GPX bruto: ${fmt(rawTrack[rawTrack.length - 1].dist / 1000, 2)} km · ${rawTrack.length} pontos · D+ ${fmt(rawStats.up)}m`);
console.log(`   Limpo:     ${fmt(totalM / 1000, 2)} km · ${cleanTrack.length} pontos · D+ ${fmt(cleanStats.up)}m / D- ${fmt(cleanStats.down)}m`);
console.log(`   Altitude:  ${fmt(metadata.minElevation)}m a ${fmt(metadata.maxElevation)}m`);
console.log(`   Anomalias: ${anomalies.length ? anomalies.map((a) => a.title).join(" | ") : "nenhuma"}`);
console.log(`\n   Segmentos:`);
segmentDefinitions.forEach((d) => {
  const r = d._resumo;
  console.log(
    `   ${String(d.id).padStart(2)}. ${d.type.padEnd(8)} Km ${fmt(r.kmIni, 2)} → ${fmt(r.kmFim, 2)} (${Math.round(r.distM)}m)  ` +
      `líquido ${fmtSigned(r.netEle)}m  sobe ${fmt(r.gain)} / desce ${fmt(r.loss)}  média ${fmtSigned((r.netEle / r.distM) * 100)}%`
  );
});
