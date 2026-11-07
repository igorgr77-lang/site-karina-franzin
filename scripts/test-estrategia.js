#!/usr/bin/env node
/**
 * Verificação automática das páginas de Percursos / Estratégia de Prova.   Rodar:  npm test
 *
 * Para cada corrida em percursos/<corrida>/ abre a página gerada num navegador simulado (jsdom),
 * roda o motor (app.js) e confere, em todas as combinações de distância × estratégia ×
 * sensibilidade × 3 metas:
 *   - soma dos tempos dos trechos = meta; relógio do último trecho = meta
 *   - pace × distância de cada trecho = tempo do trecho; trechos sem buraco entre si
 *   - acumulado do último km = meta; acumulados sempre crescendo
 *   - pace médio = meta ÷ distância; nenhum "NaN", "undefined", "+-" ou "{{" na página
 * E também: título/H1 com "Percurso", JSON-LD válido, imagens/GPX/arquivos citados existem,
 * página raiz lista todas as corridas e os endereços antigos redirecionam para páginas que existem.
 *
 * Rode depois do build (node build-blog.js). Sai com código 1 se algo falhar.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const BASE = path.join(ROOT, "percursos");
let falhas = 0;
let checagens = 0;
const ok = (cond, msg) => { checagens++; if (!cond) { falhas++; console.log(`   ❌ ${msg}`); } return cond; };
const toSec = (t) => { const p = t.trim().split(":").map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; };
const localFile = (url, pageDir) => {
  const clean = url.split(/[?#]/)[0];
  return clean.startsWith("/") ? path.join(ROOT, clean) : path.join(pageDir, clean);
};

function checarArquivosCitados(html, pageDir, nome) {
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])
    .filter((u) => !/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(u) && /\.(css|js|webp|jpe?g|png|gpx|svg)(\?|$)/i.test(u));
  for (const u of refs) ok(fs.existsSync(localFile(u, pageDir)), `${nome}: arquivo citado não existe: ${u}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); checagens++; } catch (e) { ok(false, `${nome}: JSON-LD inválido (${e.message})`); }
  }
  ok(!/\{\{[A-Z0-9_]+\}\}/.test(html), `${nome}: sobrou marcador {{...}} do template`);
}

async function testarCorrida(slug) {
  const dir = path.join(BASE, slug);
  const file = path.join(dir, "index.html");
  const html = fs.readFileSync(file, "utf8");
  console.log(`\n🏃 ${slug}`);
  checarArquivosCitados(html, dir, slug);
  ok(/<title>Percurso /.test(html), `${slug}: título não começa com "Percurso"`);
  ok(/<h1>Percurso /.test(html), `${slug}: H1 não começa com "Percurso"`);
  ok(/id="percurso"/.test(html), `${slug}: falta a seção "Como é o percurso"`);
  ok(/"FAQPage"/.test(html), `${slug}: falta o FAQPage`);

  // navegador simulado: os scripts externos (Leaflet, analytics) não carregam; o motor roda sem mapa
  // Erros de JavaScript da página contam como falha
  const { VirtualConsole } = require("jsdom");
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => ok(false, `${slug}: erro de JavaScript na página: ${e.message}`));
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, virtualConsole: vc, url: `https://karinafranzin.com.br/percursos/${slug}/` });
  const w = dom.window;
  const noop = () => {};
  // Canvas de mentira: qualquer método devolve o próprio contexto (cobre createLinearGradient().addColorStop())
  const ctx = new Proxy({}, {
    get: (t, k) => (k === "measureText" ? () => ({ width: 10 })
      : typeof k === "string" && /^(fill|stroke)Style$|^font$|^lineWidth$|^globalAlpha$|^textAlign$|^lineCap$/.test(k) ? ""
      : () => ctx),
    set: () => true
  });
  w.HTMLCanvasElement.prototype.getContext = () => ctx;
  w.HTMLElement.prototype.getBoundingClientRect = () => ({ width: 900, height: 360, top: 0, left: 0, right: 900, bottom: 360 });
  w.scrollTo = noop; w.print = noop;
  w.eval(fs.readFileSync(path.join(dir, "course-data.js"), "utf8"));
  w.eval(fs.readFileSync(path.join(BASE, "assets", "app.js"), "utf8"));
  w.document.dispatchEvent(new w.Event("DOMContentLoaded"));
  const $ = (s) => w.document.querySelector(s);
  const $$ = (s) => [...w.document.querySelectorAll(s)];
  const fire = (el, ev) => el.dispatchEvent(new w.Event(ev));

  ok($$(".segment-card").length === w.COURSE_DATA.segmentDefinitions.length, `${slug}: nº de cards de trecho diferente dos dados`);
  const presets = $$(".preset-btn");
  const combos = [];
  for (const mode of [...$("#distanceModeSelect").options].map((o) => o.value)) {
    $("#distanceModeSelect").value = mode; fire($("#distanceModeSelect"), "change");
    for (const st of [...$("#strategySelect").options].map((o) => o.value)) {
      $("#strategySelect").value = st; fire($("#strategySelect"), "change");
      for (const sv of ["60", "100", "140"]) {
        $("#hillSensitivity").value = sv; fire($("#hillSensitivity"), "input");
        for (const pb of [presets[0], presets[Math.floor(presets.length / 2)], presets[presets.length - 1]]) {
          pb.click();
          const target = Number(pb.dataset.seconds);
          const tag = `${slug} ${mode}/${st}/${sv}%/${pb.textContent}`;
          combos.push(tag);
          const cards = $$(".segment-card");
          const ranges = cards.map((c) => c.querySelector(".seg-km-range").textContent.match(/Km ([\d,]+) até Km ([\d,]+)\s*\(([\d,]+) km\)/).slice(1).map((v) => parseFloat(v.replace(",", "."))));
          const dur = cards.map((c) => toSec(c.querySelectorAll(".seg-stat-item strong")[2].textContent));
          const fim = cards.map((c) => toSec(c.querySelectorAll(".seg-stat-item strong")[3].textContent));
          ok(Math.abs(fim[fim.length - 1] - target) <= 1, `${tag}: relógio do último trecho ${fim[fim.length - 1]}s ≠ meta ${target}s`);
          ok(Math.abs(dur.reduce((x, y) => x + y, 0) - target) <= cards.length, `${tag}: soma dos trechos ≠ meta`);
          ok(ranges[0][0] === 0, `${tag}: 1º trecho não começa no km 0`);
          for (let i = 1; i < ranges.length; i++) ok(Math.abs(ranges[i][0] - ranges[i - 1][1]) <= 0.011, `${tag}: buraco entre S${i} e S${i + 1}`);
          cards.forEach((c, i) => {
            const pace = toSec(c.querySelector(".seg-pace-val").textContent.replace("/km", ""));
            ok(Math.abs(pace * ranges[i][2] - dur[i]) <= 3 + ranges[i][2], `${tag}: S${i + 1} pace × distância ≠ tempo`);
          });
          const cum = $$("#kmSplitsBody tr").map((r) => toSec(r.children[8].textContent));
          ok(Math.abs(cum[cum.length - 1] - target) <= 1, `${tag}: acumulado do último km ≠ meta`);
          for (let i = 1; i < cum.length; i++) ok(cum[i] > cum[i - 1], `${tag}: acumulado não cresce no km ${i + 1}`);
          const total = ranges[ranges.length - 1][1];
          ok(Math.abs(toSec($("#kpiAvgPace").textContent.replace("/km", "")) - target / total) <= 1.01, `${tag}: pace médio errado`);
          const txt = $("main").textContent;
          ok(!/NaN|undefined|Infinity|\+-|--\d/.test(txt), `${tag}: texto inválido na página`);
        }
      }
    }
  }
  console.log(`   ${combos.length} combinações testadas`);
  dom.window.close();
}

(async () => {
  const corridas = fs.readdirSync(BASE).filter((d) => d !== "assets" && fs.existsSync(path.join(BASE, d, "index.html")));
  for (const slug of corridas) await testarCorrida(slug);

  console.log("\n🗂️ Página raiz e redirecionamentos");
  const hub = fs.readFileSync(path.join(BASE, "index.html"), "utf8");
  checarArquivosCitados(hub, BASE, "percursos/");
  for (const slug of corridas) ok(hub.includes(`/percursos/${slug}/`), `página raiz não lista ${slug}`);
  const worker = fs.readFileSync(path.join(ROOT, "cloudflare-worker", "src", "index.js"), "utf8");
  const redir = fs.readFileSync(path.join(BASE, "assets", "redirect.js"), "utf8");
  for (const [, de, para] of worker.matchAll(/\['(\/estrategia-de-prova\/[^']*)', '([^']+)'\]/g)) {
    ok(fs.existsSync(path.join(ROOT, para, "index.html")), `Worker redireciona ${de} para ${para}, que não existe`);
    ok(redir.includes(`"${de}": "${para}"`), `redirect.js não tem o mesmo destino do Worker para ${de}`);
    ok(fs.existsSync(path.join(ROOT, de, "index.html")), `falta a página de segurança em ${de}`);
  }

  console.log(`\n${falhas ? "❌" : "✅"} ${checagens} verificações, ${falhas} falha(s)`);
  process.exit(falhas ? 1 : 0);
})().catch((e) => { console.error("❌ Erro ao rodar os testes:", e); process.exit(1); });
