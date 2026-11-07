/**
 * Imagens estáticas do percurso (para o Google Imagens e para quem busca "percurso da prova X").
 *
 *   percurso-mapa.webp        → traçado colorido por trecho sobre o OpenStreetMap, com largada,
 *                               chegada e marcas de km
 *   percurso-altimetria.webp  → perfil de altimetria colorido por trecho, com eixos em km e metros
 *
 * Só são refeitas quando o course-data.js muda (ou quando não existem). Os blocos do mapa ficam
 * em cache em .cache/osm-tiles/ (fora do git). Se não houver internet, o mapa é pulado e o build
 * continua normalmente.
 *
 * Mapa © colaboradores do OpenStreetMap (a atribuição é escrita na própria imagem).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");

const COLORS = { downhill: "#10b981", uphill: "#f59e0b", climb: "#ef4444", rolling: "#3b82f6" };
const UA = "KarinaFranzinSiteBuild/1.0 (+https://karinafranzin.com.br)";
const fmt = (v, d = 1) => Number(v).toFixed(d).replace(".", ",");

function fetchTile(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(fs.readFileSync(dest));
    https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return resolve(null); }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, buf);
        resolve(buf);
      });
    }).on("error", () => resolve(null));
  });
}

const lon2x = (lon, z) => ((lon + 180) / 360) * 256 * 2 ** z;
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 256 * 2 ** z;
};

/** Pedaços do traçado por trecho, para colorir cada um com a cor do tipo. */
function segmentPieces(track, segs) {
  return segs.map((s) => {
    let a = track.findIndex((p) => p.origIdx >= s.startOrigIdx);
    let b = track.findIndex((p) => p.origIdx >= s.endOrigIdx);
    if (a < 0) a = 0;
    if (b < 0) b = track.length - 1;
    return { color: COLORS[s.type] || "#ff6b35", pts: track.slice(a, b + 1), id: s.id };
  });
}

async function renderMap(sharp, data, out, rootDir, legenda) {
  const W = 1200, H = 800, PAD = 70;
  const t = data.cleanTrack;
  const lats = t.map((p) => p.lat), lons = t.map((p) => p.lon);
  const [minLat, maxLat, minLon, maxLon] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)];
  let z = 17;
  while (z > 10) {
    const w = lon2x(maxLon, z) - lon2x(minLon, z);
    const h = lat2y(minLat, z) - lat2y(maxLat, z);
    if (w <= W - 2 * PAD && h <= H - 2 * PAD - 40) break;
    z--;
  }
  const cx = (lon2x(minLon, z) + lon2x(maxLon, z)) / 2;
  const cy = (lat2y(minLat, z) + lat2y(maxLat, z)) / 2 + 10;
  const x0 = cx - W / 2, y0 = cy - H / 2;
  const tiles = [];
  for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + W) / 256); tx++) {
    for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + H) / 256); ty++) {
      const dest = path.join(rootDir, ".cache", "osm-tiles", String(z), String(tx), `${ty}.png`);
      const buf = await fetchTile(`https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`, dest);
      if (!buf) return false;
      tiles.push({ input: buf, left: Math.round(tx * 256 - x0), top: Math.round(ty * 256 - y0) });
    }
  }
  const px = (p) => [(lon2x(p.lon, z) - x0).toFixed(1), (lat2y(p.lat, z) - y0).toFixed(1)];
  const pieces = segmentPieces(t, data.segmentDefinitions);
  const lines = pieces.map((pc) => `<polyline points="${pc.pts.map((p) => px(p).join(",")).join(" ")}" fill="none" stroke="${pc.color}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`).join("");
  const outline = `<polyline points="${t.map((p) => px(p).join(",")).join(" ")}" fill="none" stroke="#1a1a1a" stroke-width="11" stroke-opacity="0.55" stroke-linejoin="round" stroke-linecap="round"/>`;
  // marcas de km (escala da distância oficial)
  const official = (data.race && data.race.officialDistanceM) || t[t.length - 1].dist;
  const sc = official / t[t.length - 1].dist;
  let kms = "";
  for (let k = 1; k * 1000 < official - 150; k++) {
    const p = t.find((q) => q.dist * sc >= k * 1000);
    if (!p) break;
    const [x, y] = px(p);
    kms += `<circle cx="${x}" cy="${y}" r="13" fill="#1a1a1a" stroke="#ff6b35" stroke-width="3"/><text x="${x}" y="${Number(y) + 5}" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">${k}</text>`;
  }
  const [sx, sy] = px(t[0]);
  const [ex, ey] = px(t[t.length - 1]);
  const loop = Math.hypot(sx - ex, sy - ey) < 25;
  const flag = (x, y, txt, color) => `<g><rect x="${Number(x) - 70}" y="${Number(y) - 52}" width="140" height="32" rx="16" fill="${color}"/><text x="${x}" y="${Number(y) - 30}" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">${txt}</text><circle cx="${x}" cy="${y}" r="9" fill="${color}" stroke="#fff" stroke-width="3"/></g>`;
  const markers = loop ? flag(sx, sy, "Largada/Chegada", "#10b981") : flag(sx, sy, "Largada", "#10b981") + flag(ex, ey, "Chegada", "#ef4444");
  const legendItems = [["downhill", "Descida"], ["uphill", "Subida moderada"], ["climb", "Subida forte"], ["rolling", "Ondulado"]]
    .filter(([k]) => pieces.some((p) => p.color === COLORS[k]));
  const legend = `<rect x="20" y="20" width="${Math.max(360, legenda.length * 10 + 40)}" height="${46 + legendItems.length * 0}" rx="10" fill="#141414" fill-opacity="0.85"/>
    <text x="38" y="51" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#fff">${legenda.replace(/&/g, "&amp;")}</text>
    <g transform="translate(20 ${H - 54})"><rect width="${legendItems.length * 175 + 20}" height="34" rx="8" fill="#141414" fill-opacity="0.85"/>${legendItems.map(([k, n], i) => `<rect x="${14 + i * 175}" y="12" width="22" height="10" rx="3" fill="${COLORS[k]}"/><text x="${42 + i * 175}" y="22" font-family="Arial, sans-serif" font-size="15" fill="#fff">${n}</text>`).join("")}</g>
    <rect x="${W - 300}" y="${H - 30}" width="290" height="22" rx="4" fill="#ffffff" fill-opacity="0.85"/><text x="${W - 16}" y="${H - 14}" font-family="Arial, sans-serif" font-size="13" fill="#333" text-anchor="end">© colaboradores do OpenStreetMap</text>`;
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${outline}${lines}${kms}${markers}${legend}</svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#e5e7eb" } })
    .composite([...tiles.filter((ti) => ti.left > -256 && ti.top > -256), { input: svg, left: 0, top: 0 }])
    .webp({ quality: 80 })
    .toFile(out);
  return true;
}

async function renderProfile(sharp, data, out, legenda) {
  const W = 1200, H = 440, L = 70, R = 30, T = 60, B = 50;
  const t = data.cleanTrack;
  const official = (data.race && data.race.officialDistanceM) || t[t.length - 1].dist;
  const sc = official / t[t.length - 1].dist;
  const es = t.map((p) => p.ele);
  const mn = Math.floor((Math.min(...es) - 6) / 10) * 10;
  const mx = Math.ceil((Math.max(...es) + 5) / 10) * 10;
  const X = (d) => L + ((d * sc) / official) * (W - L - R);
  const Y = (e) => T + (1 - (e - mn) / (mx - mn)) * (H - T - B);
  let grid = "";
  const step = mx - mn > 120 ? 20 : 10;
  for (let e = Math.ceil(mn / step) * step; e <= mx; e += step) grid += `<line x1="${L}" x2="${W - R}" y1="${Y(e)}" y2="${Y(e)}" stroke="#e5e7eb"/><text x="${L - 10}" y="${Y(e) + 5}" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="end">${e} m</text>`;
  for (let k = 0; k * 1000 <= official + 1; k++) { const x = L + ((k * 1000) / official) * (W - L - R); grid += `<line x1="${x}" x2="${x}" y1="${T}" y2="${H - B}" stroke="#f1f5f9"/><text x="${x}" y="${H - B + 24}" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">km ${k}</text>`; }
  const areas = segmentPieces(t, data.segmentDefinitions).map((pc) => {
    const top = pc.pts.map((p) => `${X(p.dist).toFixed(1)},${Y(p.ele).toFixed(1)}`).join(" ");
    const a = X(pc.pts[0].dist).toFixed(1), b = X(pc.pts[pc.pts.length - 1].dist).toFixed(1);
    const mid = X((pc.pts[0].dist + pc.pts[pc.pts.length - 1].dist) / 2);
    return `<polygon points="${a},${H - B} ${top} ${b},${H - B}" fill="${pc.color}" fill-opacity="0.35"/><polyline points="${top}" fill="none" stroke="${pc.color}" stroke-width="3"/><text x="${mid}" y="${T - 10}" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#374151" text-anchor="middle">S${pc.id}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#ffffff"/>
    <text x="${L}" y="30" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1a1a1a">${legenda.replace(/&/g, "&amp;")}</text>
    ${grid}${areas}</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(out);
  return true;
}

/**
 * Gera (se preciso) as imagens do percurso de uma corrida.
 * @returns { mapa: boolean, altimetria: boolean }
 */
async function ensureRouteImages(dir, data, rootDir, nomeAno) {
  let sharp;
  try { sharp = require("sharp"); } catch (e) { return { mapa: fs.existsSync(path.join(dir, "percurso-mapa.webp")), altimetria: fs.existsSync(path.join(dir, "percurso-altimetria.webp")) }; }
  const dataTime = fs.statSync(path.join(dir, "course-data.js")).mtimeMs;
  const fresh = (f) => fs.existsSync(f) && fs.statSync(f).mtimeMs >= dataTime;
  const mapa = path.join(dir, "percurso-mapa.webp");
  const alt = path.join(dir, "percurso-altimetria.webp");
  const res = { mapa: fresh(mapa), altimetria: fresh(alt) };
  if (!res.altimetria) {
    res.altimetria = await renderProfile(sharp, data, alt, `Altimetria do percurso · ${nomeAno}`);
    console.log(`   🖼️ Altimetria do percurso gerada: ${path.relative(rootDir, alt)}`);
  }
  if (!res.mapa) {
    res.mapa = await renderMap(sharp, data, mapa, rootDir, `Mapa do percurso · ${nomeAno}`).catch(() => false);
    if (res.mapa) console.log(`   🗺️ Mapa do percurso gerado: ${path.relative(rootDir, mapa)}`);
    else { console.warn(`   ⚠️ Mapa do percurso não gerado (sem acesso ao OpenStreetMap?): ${path.relative(rootDir, mapa)}`); res.mapa = fs.existsSync(mapa); }
  }
  return res;
}

module.exports = { ensureRouteImages, fmt };
