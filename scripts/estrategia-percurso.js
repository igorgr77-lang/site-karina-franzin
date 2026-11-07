/**
 * Conteúdo de SEO das páginas de corrida, escrito direto no HTML (não depende de JavaScript):
 *
 *   - Seção "Como é o percurso": resumo, mapa, altimetria e a descrição km a km dos trechos
 *   - Perguntas frequentes (o que as pessoas pesquisam: percurso, distância, subidas, GPX, data)
 *   - JSON-LD FAQPage com as mesmas perguntas
 *
 * Tudo é calculado a partir do course-data.js da corrida, então cada prova nova já nasce com isso.
 */
"use strict";

const fmt = (v, d = 1) => Number(v).toFixed(d).replace(".", ",");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = (s) => String(s).replace(/<[^>]+>/g, "");
const WEEKDAYS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const NUM = ["zero", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];
const num = (n, um, varios) => `${NUM[n] || n} ${n === 1 ? um : varios}`;

function percursoHtml(o) {
  const { slug, nome, nomeCurto, nomeBusca, city, year, km, kmLabel, gpxLimpo, faixa, analysis: a, data, imagens, date } = o;
  const ev = o.evento || {};
  const ruas = o.ruas || [];
  const localLargada = ev.localCurto || ev.local || "";
  const t = data.cleanTrack;
  const climbs = a.climbs;
  const downs = a.downs;
  const big = a.biggest;
  const loop = Math.hypot((t[0].lat - t[t.length - 1].lat) * 111000, (t[0].lon - t[t.length - 1].lon) * 104000) < 150;
  const topKm = (a.top.dist * a.sc) / 1000;
  const limpoKm = a.cleanM / 1000;
  const difere = Math.abs(limpoKm - km) >= 0.05;
  const dataTxt = date ? (() => {
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y} (${WEEKDAYS[new Date(Number(y), Number(m) - 1, Number(d)).getDay()]})`;
  })() : "";
  // Prova já aconteceu? (data do build no fuso de Brasília; ESTRATEGIA_HOJE=AAAA-MM-DD simula outra data)
  const hoje = process.env.ESTRATEGIA_HOJE || new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const jaFoi = Boolean(date) && hoje > date;

  // ---------- resumo ----------
  const resumo = `O percurso da ${nome} tem ${kmLabel} km${difere ? ` (o traçado mede ${fmt(limpoKm, 2)} km)` : ""}${city ? ` em ${city}` : ""}, ${loop ? "com largada e chegada no mesmo local" : "com largada e chegada em pontos diferentes"}. `
    + (climbs.length
      ? `São ${num(climbs.length, "subida", "subidas")} e ${num(downs.length, "descida", "descidas")}, com <strong>+${fmt(a.gain)} m de ganho acumulado</strong> e altitude entre ${fmt(a.minEle)} m e ${fmt(a.maxEle)} m. `
        + `A maior subida fica entre o Km ${fmt(big.kmIni)} e o Km ${fmt(big.kmFim)} (+${fmt(big.gain)} m) e o ponto mais alto, a ${fmt(a.maxEle)} m, fica no Km ${fmt(topKm)}.`
      : `É um percurso praticamente plano, com +${fmt(a.gain)} m de ganho acumulado e altitude entre ${fmt(a.minEle)} m e ${fmt(a.maxEle)} m.`);

  // ---------- km a km ----------
  const tipoTxt = { climb: "subida forte", uphill: "subida", downhill: "descida", rolling: "trecho ondulado" };
  const passos = a.segs.map((s) => {
    const e1 = t[s.a].ele, e2 = t[s.b].ele;
    const len = (s.distM * a.sc);
    const media = (s.netEle / s.distM) * 100;
    const comp = len >= 950 ? `${fmt(len / 1000)} km` : `${Math.round(len / 10) * 10} m`;
    const desc = s.type === "rolling"
      ? `sobe ${fmt(s.gain)} m e desce ${fmt(s.loss)} m em ${comp}`
      : `${tipoTxt[s.type]} de ${fmt(e1)} m para ${fmt(e2)} m em ${comp} (média de ${fmt(media)}%)`;
    const ruasTrecho = [...new Set(ruas.filter((r) => r.kmFim >= s.kmIni - 0.05 && r.kmIni <= s.kmFim + 0.05).map((r) => r.rua))];
    const pela = ruasTrecho.length ? `, pela ${ruasTrecho.slice(0, 3).join(", ").replace(/, ([^,]*)$/, " e $1")}` : "";
    return `          <li><strong>Km ${fmt(s.kmIni)} a ${fmt(s.kmFim)} · ${esc(s.name)}</strong>: ${desc}${esc(pela)}.</li>`;
  }).join("\n");

  const altMapa = `Mapa do percurso da ${nomeBusca}, com largada, chegada e marcas de km`;
  const altAlt = `Altimetria do percurso da ${nomeBusca}: subidas e descidas km a km`;
  const figuras = [
    imagens.mapa && `        <figure class="route-figure">
          <img src="/percursos/${slug}/percurso-mapa.webp?v=auto" width="1200" height="800" loading="lazy" decoding="async" alt="${esc(altMapa)}">
          <figcaption>Mapa do percurso da ${esc(nome)}. Cores: verde = descida, laranja = subida moderada, vermelho = subida forte. Mapa © colaboradores do OpenStreetMap.</figcaption>
        </figure>`,
    imagens.altimetria && `        <figure class="route-figure">
          <img src="/percursos/${slug}/percurso-altimetria.webp?v=auto" width="1200" height="440" loading="lazy" decoding="async" alt="${esc(altAlt)}">
          <figcaption>Altimetria do percurso da ${esc(nome)}, dividida nos ${a.segs.length} trechos da estratégia.</figcaption>
        </figure>`
  ].filter(Boolean).join("\n");

  const [, hh = "", mm = ""] = (ev.inicio || "").match(/T(\d{2}):(\d{2})/) || [];
  const horario = ev.horario || (hh ? `${hh}h${mm}` : "");
  const linhas = [
    dataTxt && ["Data", `${dataTxt}${horario ? `, largada às ${horario}` : ""}${jaFoi ? " · prova realizada" : ""}`],
    localLargada && ["Largada e chegada", `${ev.local || localLargada}${ev.cidade ? `, ${ev.cidade}${ev.uf ? `/${ev.uf}` : ""}` : ""}`],
    ev.modalidades && ev.modalidades.length && ["Modalidades", `${ev.modalidades.join(" · ")}${ev.percursoDestaPagina && ev.modalidades.length > 1 ? ` (esta página mostra o percurso da ${ev.percursoDestaPagina})` : ""}`],
    ev.organizador && ["Organização", ev.organizador],
    ev.cronometragem && ["Cronometragem / inscrições", ev.cronometragem]
  ].filter(Boolean);
  const links = [
    ev.siteOficial && `<a href="${esc(ev.siteOficial)}" target="_blank" rel="noopener noreferrer">Site oficial da prova</a>`,
    ev.inscricoes && `<a href="${esc(ev.inscricoes)}" target="_blank" rel="noopener noreferrer">Página de inscrição</a>`
  ].filter(Boolean);
  const infoHtml = linhas.length ? `      <dl class="race-info">
${linhas.map(([k, v2]) => `        <div><dt>${esc(k)}</dt><dd>${esc(v2)}</dd></div>`).join("\n")}
      </dl>${links.length ? `\n      <p class="race-links">${links.join(" · ")}</p>` : ""}` : "";
  const ruasLista = ruas.map((r) => `${r.rua} (km ${fmt(r.kmIni)}${r.kmFim - r.kmIni >= 0.1 ? `–${fmt(r.kmFim)}` : ""})`);
  const ruasHtml = ruas.length ? `      <h3>Por onde passa o percurso</h3>
      <p class="route-streets">${localLargada ? `Largada: <strong>${esc(localLargada)}</strong>. ` : ""}${esc(ruasLista.join(" → "))}.${localLargada && loop ? ` Chegada no mesmo local da largada.` : ""} <span class="route-streets-note">Ruas aproximadas, identificadas pelo GPX no mapa do OpenStreetMap.</span></p>` : "";

  const secao = `    <!-- PERCURSO (texto escrito no HTML para o Google; gerado pelo build a partir do GPX) -->
    <section id="percurso" class="route-section" aria-labelledby="percursoTitulo">
      <h2 id="percursoTitulo">Como é o percurso da ${esc(nomeBusca)}</h2>
      <p class="route-summary">${resumo}</p>
${infoHtml}
${ruasHtml}
      <div class="route-figures">
${figuras}
      </div>
      <h3>O percurso km a km</h3>
      <ol class="route-steps">
${passos}
      </ol>
      ${gpxLimpo ? `<p class="route-gpx"><a href="${esc(gpxLimpo)}" download="${esc(gpxLimpo)}" class="btn-primary" data-gtag-event="estrategia_baixar_gpx" data-gtag-category="${esc(data.race.gaCategory || slug)}">Baixar o GPX do percurso (${fmt(limpoKm, 2)} km)</a></p>` : ""}
    </section>`;

  // ---------- perguntas frequentes ----------
  const faqs = [
    [`Qual é o percurso da ${nomeBusca}?`, resumo],
    [`Qual é a distância da ${nomeCurto}?`, `${ev.modalidades && ev.modalidades.length > 1 ? `A prova tem ${ev.modalidades.join(", ").replace(/, ([^,]*)$/, " e $1").toLowerCase()}. Esta página mostra o percurso da ${ev.percursoDestaPagina || `corrida de ${kmLabel} km`}.` : `A prova tem ${kmLabel} km oficiais.`}${difere ? ` Pelo traçado do GPX, o percurso mede ${fmt(limpoKm, 2)} km, então é normal o relógio marcar entre ${faixa} km na chegada.` : ""}`],
    localLargada && [`Onde ${jaFoi ? "foi" : "é"} a largada da ${nomeCurto}?`, `A largada e a chegada ${jaFoi ? "foram" : "são"} ${/^em /.test(ev.local || "") ? "" : "na "}${ev.local || localLargada}${ev.cidade ? `, em ${ev.cidade}${ev.uf ? `/${ev.uf}` : ""}` : ""}.`],
    horario && !jaFoi && [`Que horas é a largada da ${nomeCurto}?`, `A largada é às ${horario}${dataTxt ? ` do dia ${dataTxt}` : ""}.`],
    ruas.length && [`Por quais ruas passa o percurso da ${nomeCurto}?`, `${localLargada ? `Saindo ${/^em /.test(ev.local || "") ? "" : "da "}${ev.local || localLargada}, o` : "O"} percurso passa por: ${ruas.map((r) => r.rua).filter((r, i, arr) => arr.indexOf(r) === i).join(", ")}.`],
    [`O percurso da ${nomeCurto} tem subida?`, climbs.length
      ? `Sim. São ${num(climbs.length, "subida", "subidas")}, e a maior fica entre o Km ${fmt(big.kmIni)} e o Km ${fmt(big.kmFim)}, com +${fmt(big.gain)} m (${Math.round((big.gain / a.gain) * 100)}% de todo o desnível da prova). O ganho acumulado da prova é de +${fmt(a.gain)} m.`
      : `Quase nada: é um percurso praticamente plano, com +${fmt(a.gain)} m de ganho acumulado.`],
    [`Qual é a altimetria do percurso da ${nomeCurto}?`, `A altitude vai de ${fmt(a.minEle)} m a ${fmt(a.maxEle)} m, com +${fmt(a.gain)} m de subida acumulada e -${fmt(a.loss)} m de descida. O ponto mais alto fica no Km ${fmt(topKm)}.`],
    gpxLimpo && [`Onde baixar o GPX do percurso da ${nomeCurto}?`, `Nesta página: no botão "Baixar o GPX do percurso" ou na aba "Percurso para o Relógio". É o traçado já corrigido (${fmt(limpoKm, 2)} km), pronto para importar no Garmin, Coros, Polar ou Suunto.`],
    [`Qual pace usar em cada trecho da ${nomeCurto}?`, `Digite seu tempo alvo no topo desta página: a calculadora mostra o pace de cada um dos ${a.segs.length} trechos de subida e descida, as parciais km a km e uma cola de pulso para imprimir.`],
    dataTxt && (jaFoi
      ? [`Quando foi a ${nome}?`, `A prova foi no dia ${dataTxt}${city ? `, em ${city}` : ""}. O percurso e a estratégia continuam aqui para consulta e para quem vai correr a próxima edição.`]
      : [`Quando é a ${nome}?`, `A prova é no dia ${dataTxt}${city ? `, em ${city}` : ""}.`])
  ].filter(Boolean);

  const faq = `    <!-- PERGUNTAS FREQUENTES (gerado pelo build) -->
    <section class="faq-section" aria-labelledby="faqTitulo">
      <h2 id="faqTitulo">Perguntas frequentes sobre o percurso</h2>
${faqs.map(([q, r]) => `      <details class="faq-item">
        <summary>${esc(q)}</summary>
        <p>${r}</p>
      </details>`).join("\n")}
    </section>`;

  const jsonld = `  <!-- Perguntas frequentes (FAQPage) -->
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: strip(r) } }))
  }, null, 2).replace(/\n/g, "\n  ")}
  </script>`;

  // Evento esportivo só enquanto a prova não aconteceu (o Google mostra apenas eventos futuros)
  const evento = (ev.inicio || date) && localLargada && !jaFoi ? `

  <!-- Evento esportivo (dados da organização da prova) -->
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: ev.nomeOficial || nome,
    sport: "Corrida de rua",
    startDate: ev.inicio || date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: localLargada, address: { "@type": "PostalAddress", addressLocality: ev.cidade || o.cityShort || "", addressRegion: ev.uf || "", addressCountry: "BR" } },
    ...(ev.organizador ? { organizer: { "@type": "Organization", name: ev.organizador, ...(ev.siteOficial ? { url: ev.siteOficial } : {}) } } : {}),
    ...(ev.siteOficial ? { url: ev.siteOficial } : {}),
    image: o.ogImagem,
    description: strip(resumo)
  }, null, 2).replace(/\n/g, "\n  ")}
  </script>` : "";
  return { secao, faq, jsonld: jsonld + evento };
}

module.exports = { percursoHtml };
