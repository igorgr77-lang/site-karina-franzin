/**
 * Textos automáticos da Estratégia de Prova.
 *
 * Escreve nome, selo, título, dica e frase de foco de cada trecho a partir do percurso:
 * posição na prova (largada, meio, final), inclinação média, rampa mais íngreme, o que vem
 * antes e depois, se é a maior subida, se contém a metade da prova e se termina no topo.
 *
 * Os textos servem como rascunho: qualquer campo preenchido em "segmentos" no
 * estrategia.config.json substitui o automático.
 *
 * Todos os km são da escala da distância oficial (os km das placas da prova).
 */
"use strict";

const NUM = ["zero", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];
const num = (n, um, varios) => `${NUM[n] || n} ${n === 1 ? um : varios}`;

const fmt = (v, d = 1) => Number(v).toFixed(d).replace(".", ",");
const fmtSigned = (v, d = 1) => (v >= 0 ? "+" : "") + fmt(v, d);
const lenTxt = (m) => (m >= 950 ? `${fmt(m / 1000, 1)} km` : `${Math.round(m / 10) * 10}m`);

// Frases de foco por tipo (alterna para não repetir a mesma frase na página)
const CUES = {
  downhill: [
    "Passos curtos e rápidos, quadril alto, sem bater o calcanhar.",
    "Incline levemente o corpo à frente e deixe a passada abrir.",
    "Solte os ombros, respire fundo e reencaixe a passada.",
    "Deixe a gravidade trabalhar: passada leve e cadência alta."
  ],
  climb: [
    "Braços ativos, tronco levemente à frente, olhar 10 metros adiante.",
    "Segure o esforço, não o pace: um poste de cada vez.",
    "Passada curta, cadência alta e respiração no controle."
  ],
  uphill: [
    "Cadência alta e constante, sem brigar com a subida.",
    "Encurte a passada e mantenha o esforço, não o pace."
  ],
  rolling: [
    "Ritmo estável: não acelere nas pequenas rampas.",
    "Esforço constante e respiração controlada."
  ]
};

/**
 * Rampa mais íngreme (janela de 150m) dentro do trecho, no sentido do trecho.
 * Retorna { km, grade } em escala oficial.
 */
function steepest(track, a, b, sc, sentido) {
  const at = (d) => {
    let i = track.findIndex((p) => p.dist >= d);
    return i < 0 ? track[track.length - 1] : track[i];
  };
  const d0 = track[a].dist;
  const d1 = track[b].dist;
  let best = null;
  for (let d = d0; d + 150 <= d1; d += 25) {
    const g = ((at(d + 150).ele - at(d).ele) / 150) * 100;
    if (!best || g * sentido > best.grade * sentido) best = { km: ((d + 75) * sc) / 1000, grade: g };
  }
  return best;
}

/**
 * @param segs  [{ id, type, a, b, gain, loss, netEle, distM }] — a/b são índices no track
 * @param ctx   { track, officialM, cleanM, halfwayM, topIdx }
 * @returns lista com { name, shortName, badge, tacticalTitle, tacticalTip, mentalCue }
 */
function escreverTrechos(segs, ctx) {
  const { track, officialM, cleanM } = ctx;
  const sc = officialM / cleanM;
  const km = (i) => (track[i].dist * sc) / 1000;
  const n = segs.length;
  const climbs = segs.filter((s) => s.type === "climb" || s.type === "uphill");
  const biggest = climbs.slice().sort((x, y) => y.gain - x.gain)[0];
  const totalGain = segs.reduce((x, s) => x + s.gain, 0);
  const halfKm = (ctx.halfwayM || officialM / 2) / 1000;
  const topKm = km(ctx.topIdx);
  const cueCount = {};

  return segs.map((s, i) => {
    const first = i === 0;
    const last = i === n - 1;
    const prev = segs[i - 1];
    const next = segs[i + 1];
    const isBiggest = biggest && s.id === biggest.id;
    const kmA = km(s.a);
    const kmB = km(s.b);
    const len = s.distM * sc;
    const avg = (s.netEle / s.distM) * 100;
    const e1 = fmt(track[s.a].ele);
    const e2 = fmt(track[s.b].ele);
    const sentido = s.type === "downhill" ? -1 : 1;
    const ramp = steepest(track, s.a, s.b, sc, sentido);
    const hasRamp = ramp && Math.abs(ramp.grade) >= Math.max(2.5, Math.abs(avg) * 1.4);
    const rampTxt = hasRamp ? `, com o trecho mais íngreme perto do Km ${fmt(ramp.km)} (cerca de ${fmt(Math.abs(ramp.grade), 0)}% em 150m)` : "";
    const endsAtTop = ctx.topIdx >= s.a && ctx.topIdx <= s.b && Math.abs(topKm - kmB) < 0.15;
    const hasHalf = halfKm > kmA + 0.05 && halfKm <= kmB + 0.05;
    const share = totalGain > 0 ? Math.round((s.gain / totalGain) * 100) : 0;
    const range = `Km ${fmt(kmA)} ao Km ${fmt(kmB)}`;
    const curto = len < 800 || fmt(kmA, 0) === fmt(kmB, 0);
    const kmNome = curto ? range : `Km ${fmt(kmA, 0)} ao Km ${fmt(kmB, 0)}`;
    const subidasDepois = segs.slice(i + 1).filter((x) => x.type === "climb" || x.type === "uphill").length;
    const ultimaSubida = (s.type === "climb" || s.type === "uphill") && !last &&
      segs.slice(i + 1).every((x) => x.type === "downhill" || x.type === "rolling");
    let name, short, badge, title, tip;

    if (s.type === "downhill") {
      const forte = avg <= -3;
      const rapida = avg <= -2;
      badge = forte ? "Descida Forte" : rapida ? "Descida Rápida" : avg <= -1.2 ? "Descida Favorável" : "Descida Suave";
      if (first) {
        name = forte ? "Largada em Descida Forte" : "Largada em Descida";
        short = "Descida da Largada";
        title = `Desce ${fmt(-s.netEle)}m logo de cara (${fmt(avg)}% de média)`;
        tip = `Os primeiros ${lenTxt(len)} descem de ${e1}m para ${e2}m${rampTxt}. Com a adrenalina da largada, é fácil sair rápido demais. Deixe a gravidade trabalhar, mas sem forçar`;
        tip += next && (next.type === "climb" || next.type === "uphill")
          ? next === biggest ? ": o próximo trecho é a maior subida da prova." : ": logo depois vem uma subida."
          : ".";
      } else if (last) {
        name = "Descida Final até a Chegada";
        short = "Descida Final";
        title = `${fmt(s.netEle)}m nos últimos ${lenTxt(len)}`;
        tip = `O fim da prova desce de ${e1}m para ${e2}m${rampTxt}. Reta final a favor: aumente a frequência de passadas aos poucos e solte tudo nos últimos 400m.`;
      } else {
        const depoisDeSubida = prev && (prev.type === "climb" || prev.type === "uphill");
        const ingreme = avg <= -4 || (hasRamp && ramp.grade <= -7);
        name = ingreme ? `Descida Íngreme do ${kmNome}` : rapida ? `Descida Rápida do ${kmNome}` : depoisDeSubida ? "Descida de Recuperação" : `Descida do ${kmNome}`;
        short = ingreme ? "Descida Íngreme" : rapida ? "Descida Rápida" : "Descida Suave";
        title = ingreme ? `${fmt(s.netEle)}m em ${lenTxt(len)}: cuidado com o impacto` : rapida ? `${fmt(s.netEle)}m em ${lenTxt(len)} para ganhar tempo` : `${fmt(s.netEle)}m em ${lenTxt(len)} para respirar`;
        tip = `Do ${range} o percurso desce de ${e1}m para ${e2}m (média ${fmt(avg)}%)${rampTxt}. `;
        tip += ingreme
          ? "Descida íngreme: passos curtos e rápidos, sem frear com o calcanhar. Ganhe tempo sem castigar o quadríceps" + (subidasDepois === 0 ? "." : subidasDepois === 1 ? ", que ainda vai trabalhar na próxima subida." : ", que ainda vai trabalhar nas próximas subidas.")
          : depoisDeSubida
          ? rapida
            ? "Depois da subida, é a hora de acelerar e recuperar os segundos que você investiu nela."
            : "Use os primeiros 200m para baixar o batimento depois da subida e depois volte ao ritmo de prova."
          : "Aproveite para ganhar velocidade sem gastar energia.";
        if (next && next === biggest) tip += " Guarde perna: em seguida vem a maior subida da prova.";
      }
    } else if (s.type === "climb" || s.type === "uphill") {
      const forte = avg >= 3.5 || (hasRamp && ramp.grade >= 5);
      const longa = len >= 1000 && avg < 2;
      badge = forte ? "Subida Forte" : avg >= 1.5 ? "Subida Constante" : "Subida Moderada";
      if (last) {
        name = "Subida Final até a Chegada";
        short = "Subida Final";
        title = `+${fmt(s.gain)}m no${len >= 950 ? " último quilômetro" : `s últimos ${lenTxt(len)}`}`;
        tip = `O fim da prova sobe de ${e1}m para ${e2}m (média ${fmtSigned(avg)}%${hasRamp ? `, com rampa de ${fmt(ramp.grade, 0)}% perto do Km ${fmt(ramp.km)}` : ""}). Com as pernas cansadas, parece mais íngreme do que é. Mantenha o ritmo até avistar a chegada e solte tudo nos últimos 200m.`;
      } else if (isBiggest && climbs.length > 1) {
        name = `Grande Subida do ${kmNome}`;
        short = "Grande Subida";
        title = `+${fmt(s.gain)}m em ${lenTxt(len)}: o trecho que decide a prova`;
        tip = `Sobe de ${e1}m a ${e2}m e ${share >= 50 ? "concentra mais da metade" : `concentra ${share}%`} de todo o desnível da prova${rampTxt}. `;
        tip += prev && prev.type === "downhill" ? "Quem desceu forte demais antes paga aqui. " : "";
        tip += "Segure o esforço, não o pace: perder alguns segundos por km neste trecho é normal e já está no plano.";
      } else {
        name = endsAtTop ? "Subida até o Ponto Mais Alto" : ultimaSubida ? `Última Subida do ${kmNome}` : longa ? `Subida Longa do ${kmNome}` : `Subida do ${kmNome}`;
        short = endsAtTop ? "Subida até o Topo" : ultimaSubida ? "Última Subida" : longa ? "Subida Longa" : forte ? "Subida Forte" : "Subida";
        title = `+${fmt(s.gain)}m em ${lenTxt(len)}${endsAtTop ? ` até o topo (${fmt(track[ctx.topIdx].ele, 0)}m)` : ""}`;
        tip = longa
          ? `Subida gradual (média ${fmtSigned(avg)}%) que não parece dura no começo, mas cansa pela duração${rampTxt}. Mantenha a cadência e não tente ganhar tempo aqui.`
          : `Do ${range} o percurso sobe de ${e1}m para ${e2}m (média ${fmtSigned(avg)}%)${rampTxt}. Encurte a passada, aumente a cadência e aceite perder alguns segundos por km.`;
        if (endsAtTop) tip += ` O ponto mais alto da prova fica no Km ${fmt(topKm)}: a recompensa vem logo depois.`;
        if (ultimaSubida) {
          title += ": o último desafio";
          tip += " É a última subida da prova: depois do topo só resta descida até a chegada.";
        }
      }
    } else {
      badge = "Ondulado";
      name = first ? "Largada Ondulada" : last ? "Trecho Final Ondulado" : `Trecho Ondulado do ${kmNome}`;
      short = "Ondulado";
      title = `Sobe ${fmt(s.gain)}m e desce ${fmt(s.loss)}m em ${lenTxt(len)}`;
      tip = `Trecho de sobe e desce entre o Km ${fmt(kmA)} e o Km ${fmt(kmB)}. Mantenha o esforço estável, sem acelerar nas pequenas rampas nem frear nas descidas curtas.`;
      if (last) tip += " Nos últimos 400m, solte o que sobrou.";
    }

    if (hasHalf && !last) tip += ` A metade da prova (Km ${fmt(halfKm)}) fica neste trecho.`;

    const cueType = CUES[s.type] ? s.type : "rolling";
    cueCount[cueType] = cueCount[cueType] || 0;
    let cue = CUES[cueType][cueCount[cueType]++ % CUES[cueType].length];
    if (last) cue = "Agora é cabeça: braços fortes e foco na chegada.";
    if (isBiggest && !last) cue = "Paciência: quem segura aqui ultrapassa nas descidas.";
    if (ultimaSubida && !isBiggest) cue = "Última subida do dia! Chegou no topo, a vitória está garantida.";

    return { name, shortName: `Seg ${s.id} · ${short}`, badge, tacticalTitle: title, tacticalTip: tip, mentalCue: cue };
  });
}

/** Introdução e recomendação da página (usadas quando o config não tem texto próprio). */
function escreverPagina(segs, ctx, nomeCurto) {
  const { officialM, cleanM } = ctx;
  const sc = officialM / cleanM;
  const km = (i) => (ctx.track[i].dist * sc) / 1000;
  const climbs = segs.filter((s) => s.type === "climb" || s.type === "uphill");
  const downs = segs.filter((s) => s.type === "downhill");
  const totalGain = segs.reduce((x, s) => x + s.gain, 0);
  const big = climbs.slice().sort((x, y) => y.gain - x.gain)[0];
  if (!big) {
    return {
      intro: `A ${nomeCurto} tem um percurso sem subidas fortes. O segredo é manter o esforço constante do início ao fim. Siga o ritmo de cada segmento abaixo:`,
      recomendacao: "Percurso favorável: comece controlado no primeiro quilômetro e aumente o ritmo aos poucos depois da metade."
    };
  }
  const share = Math.round((big.gain / totalGain) * 100);
  const range = `Km ${fmt(km(big.a))} a ${fmt(km(big.b))}`;
  const quando = km(big.a) < (officialM / 1000) * 0.35 ? "logo no começo" : km(big.a) > (officialM / 1000) * 0.6 ? "na parte final" : "no meio da prova";
  return {
    intro: `A ${nomeCurto} tem ${num(climbs.length, "subida", "subidas")} e ${num(downs.length, "descida", "descidas")}. Olhar só para o pace médio faz o corredor sair rápido demais e travar na <strong>maior subida (${range})</strong>, ${quando}, que concentra ${share}% de todo o desnível da prova. Siga o ritmo de cada segmento abaixo:`,
    recomendacao: `${share >= 50 ? "Mais da metade" : `${share}%`} de toda a subida da prova (<strong>+${fmt(big.gain)}m de ${fmt(totalGain)}m</strong>) está no <strong>Segmento ${big.id} (${range})</strong>, ${quando}. Correr esse trecho mais lento que seu pace médio não é "quebrar": é o que mantém o esforço abaixo do limiar e deixa perna para acelerar nas descidas${downs.length ? ` dos Segmentos ${downs.map((d) => d.id).join(", ").replace(/, ([^,]*)$/, " e $1")}` : ""}!`
  };
}

module.exports = { escreverTrechos, escreverPagina };
