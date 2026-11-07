/**
 * Motor de Estratégia de Prova (GAP Pacing Engine + Visualizações)
 * Compartilhado por todas as corridas de /estrategia-de-prova/.
 * Tudo que é específico de cada prova vem de window.COURSE_DATA (course-data.js da pasta da corrida),
 * principalmente do bloco COURSE_DATA.race.
 */
(function () {
  "use strict";

  const RACE = Object.assign(
    {
      title: "Estratégia de Prova",
      officialDistanceM: 10000,
      halfwayDistM: 5000,
      defaultTargetSeconds: 3000,
      minTargetSeconds: 1500,
      maxHours: 4,
      summaryElevation: "",
      summaryReminder: "",
      strategyDescriptions: {},
      distanceHints: {},
      anomalyMarkers: []
    },
    (window.COURSE_DATA && window.COURSE_DATA.race) || {}
  );
  const formatEle = (v) => v.toFixed(1).replace(".", ",") + "m";

  const state = {
    targetSeconds: RACE.defaultTargetSeconds, // tempo alvo inicial da prova
    strategy: "even-effort", // 'even-effort' | 'conservative' | 'aggressive-downhill'
    distanceMode: "official", // 'official' (distância oficial) | 'clean-gpx' | 'raw-gpx'
    hillSensitivity: 1.0, // 0.6 to 1.4
    focusedSegmentId: null,
    showAnomalies: true,
    customTrack: null,
    computed: null
  };

  // DOM Elements
  const elHours = document.getElementById("timeHours");
  const elMinutes = document.getElementById("timeMinutes");
  const elSeconds = document.getElementById("timeSeconds");
  const elBasePacePreview = document.getElementById("basePacePreview");
  const elPresetBtns = document.querySelectorAll(".preset-btn");
  const elStrategySelect = document.getElementById("strategySelect");
  const elStrategyDesc = document.getElementById("strategyDescription");
  const elDistanceModeSelect = document.getElementById("distanceModeSelect");
  const elDistanceModeHint = document.getElementById("distanceModeHint");
  const elHillSensitivity = document.getElementById("hillSensitivity");
  const elHillSensitivityLabel = document.getElementById("hillSensitivityLabel");

  // KPI Elements
  const elKpiAvgPace = document.getElementById("kpiAvgPace");
  const elKpiAvgSpeed = document.getElementById("kpiAvgSpeed");
  const elKpiClimbPace = document.getElementById("kpiClimbPace");
  const elKpiClimbInfo = document.getElementById("kpiClimbInfo");
  const elKpiDownhillPace = document.getElementById("kpiDownhillPace");
  const elKpiDownhillInfo = document.getElementById("kpiDownhillInfo");
  const elKpiHalfwayTime = document.getElementById("kpiHalfwayTime");
  const elKpiSplitDiff = document.getElementById("kpiSplitDiff");
  const elKpiPaceRange = document.getElementById("kpiPaceRange");
  const elKpiRangeSub = document.getElementById("kpiRangeSub");

  // Visuals & Containers
  const canvas = document.getElementById("elevationCanvas");
  const tooltip = document.getElementById("chartTooltip");
  const elMobileChartInspector = document.getElementById("mobileChartInspector");
  const elSegmentStripBar = document.getElementById("segmentStripBar");
  const elSegmentsContainer = document.getElementById("segmentsCardsContainer");
  const elKmSplitsBody = document.getElementById("kmSplitsBody");
  const elKmMobileList = document.getElementById("kmMobileList");
  const elWbSegmentsBody = document.querySelector("#wbSegmentsTable tbody");
  const elWbKmBody = document.querySelector("#wbKmTable tbody");
  const elWbSegGoal = document.getElementById("wbSegGoal");
  const elWbKmGoal = document.getElementById("wbKmGoal");
  const elAnomaliesList = document.getElementById("anomaliesList");
  const elToggleAnomalies = document.getElementById("toggleAnomalies");
  const elMsbGoalText = document.getElementById("msbGoalText");
  const elMsbPaceText = document.getElementById("msbPaceText");

  // Leaflet Map Instance & Layers
  let map = null;
  let segmentPolylines = [];
  let kmMarkersLayer = null;
  let anomalyMarkersLayer = null;
  let hoverMarker = null;

  // Format Helpers
  function formatPace(secPerKm) {
    if (!isFinite(secPerKm) || secPerKm <= 0) return "--:--";
    const rounded = Math.round(secPerKm);
    const m = Math.floor(rounded / 60);
    const s = rounded % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function formatDuration(totalSec, forceHours = false) {
    const rounded = Math.round(totalSec);
    const h = Math.floor(rounded / 3600);
    const m = Math.floor((rounded % 3600) / 60);
    const s = rounded % 60;
    if (h > 0 || forceHours) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function formatSigned(val, decimals = 1, suffix = "") {
    const sign = val > 0.04 ? "+" : val < -0.04 ? "" : "";
    return `${sign}${val.toFixed(decimals).replace(".", ",")}${suffix}`;
  }

  /**
   * Calcula o fator multiplicador de ritmo (pace factor) para uma inclinação g (em %)
   * Baseado na curva de custo energético de Minetti / Strava GAP + Estratégia escolhida
   */
  function getGradePaceFactor(gradePct, progressRatio, strategy, sensitivity) {
    // Limita inclinações extremas de ruído
    const g = Math.max(-12, Math.min(15, gradePct));
    let gradeEffect = 0;

    if (g >= 0) {
      // Subida: ~3.5% mais lento a cada +1% de inclinação, com leve termo quadrático em rampas > 4%
      gradeEffect = (0.034 * g + 0.0018 * g * g) * sensitivity;
    } else {
      // Descida: até -3.5% ganha velocidade (~2.0% por cada -1%); abaixo de -4.5% o ganho estabiliza para poupar quadríceps
      const absG = Math.abs(g);
      if (absG <= 4.0) {
        gradeEffect = -(0.021 * absG);
      } else {
        // Descida muito íngreme (ex: -8% no Seg 6): reduz o ganho para evitar frenagem excêntrica lesiva
        const baseGain = 0.021 * 4.0;
        const extraBraking = (absG - 4.0) * 0.004;
        gradeEffect = -Math.max(0.03, baseGain - extraBraking);
      }
    }

    // Ajuste pela estratégia escolhida
    let strategyMultiplier = 1.0;
    if (strategy === "conservative") {
      // Segura ~2.5% nos primeiros 38% da prova e acelera progressivamente nos 35% finais
      if (progressRatio < 0.39) {
        strategyMultiplier = 1.024;
      } else if (progressRatio > 0.68) {
        strategyMultiplier = 0.976;
      }
    } else if (strategy === "aggressive-downhill") {
      if (g < -0.5) {
        gradeEffect *= 1.32; // Ataca mais forte as descidas
      } else if (g > 1.2) {
        gradeEffect *= 1.15; // Poupa um pouco mais nas subidas
      }
    }

    return Math.max(0.72, (1.0 + gradeEffect) * strategyMultiplier);
  }

  /**
   * Executa toda a simulação matemática do percurso para o estado atual
   */
  function computeStrategy() {
    const baseTrack =
      state.customTrack ||
      (state.distanceMode === "raw-gpx"
        ? window.COURSE_DATA.rawTrack
        : window.COURSE_DATA.cleanTrack);

    const rawTotalDistM = baseTrack[baseTrack.length - 1].dist;
    const targetTotalDistM =
      !state.customTrack && state.distanceMode === "official"
        ? RACE.officialDistanceM
        : rawTotalDistM;

    const distScale = targetTotalDistM / rawTotalDistM;

    // 1. Calcula pesos de tempo de cada passo entre pontos consecutivos
    const points = baseTrack.map((pt, idx) => {
      const scaledDist = pt.dist * distScale;
      const scaledStepDist = pt.stepDist * distScale;
      const progress = rawTotalDistM > 0 ? pt.dist / rawTotalDistM : 0;
      const factor = getGradePaceFactor(
        pt.grade,
        progress,
        state.strategy,
        state.hillSensitivity
      );
      const unscaledTimeWeight = (scaledStepDist / 1000.0) * factor;
      return {
        ...pt,
        scaledDist,
        scaledStepDist,
        factor,
        unscaledTimeWeight
      };
    });

    const sumWeights = points.reduce((acc, p) => acc + p.unscaledTimeWeight, 0);
    const normBasePaceSecPerKm =
      sumWeights > 0 ? state.targetSeconds / sumWeights : state.targetSeconds / (targetTotalDistM / 1000);

    // 2. Atribui tempo exato e acumulado para cada ponto
    let cumSec = 0;
    points.forEach((p) => {
      p.stepSec = p.unscaledTimeWeight * normBasePaceSecPerKm;
      cumSec += p.stepSec;
      p.cumSec = cumSec;
      p.instantPace = p.scaledStepDist > 0.5 ? (p.stepSec / p.scaledStepDist) * 1000 : normBasePaceSecPerKm * p.factor;
    });

    // 3. Constrói os 8 Segmentos Táticos
    const segDefs = window.COURSE_DATA.segmentDefinitions;
    const segments = segDefs.map((def) => {
      // Localiza índices na trilha atual usando origIdx
      let startIdx = points.findIndex((p) => p.origIdx >= def.startOrigIdx);
      let endIdx = points.findIndex((p) => p.origIdx >= def.endOrigIdx);
      if (startIdx < 0) startIdx = 0;
      if (endIdx < 0) endIdx = points.length - 1;

      const startPt = points[startIdx];
      const endPt = points[endIdx];
      const segPoints = points.slice(startIdx, endIdx + 1);
      const stepPoints = points.slice(startIdx + 1, endIdx + 1);

      const distM = endPt.scaledDist - startPt.scaledDist;
      const distKm = distM / 1000.0;
      const durationSec = endPt.cumSec - startPt.cumSec;
      const paceSecPerKm = distKm > 0 ? durationSec / distKm : 0;

      let gainM = 0;
      let lossM = 0;
      let maxGrade = -99;
      let minGrade = 99;
      stepPoints.forEach((sp) => {
        if (sp.de > 0) gainM += sp.de;
        else lossM += Math.abs(sp.de);
        if (sp.stepDist > 8) {
          if (sp.grade > maxGrade) maxGrade = sp.grade;
          if (sp.grade < minGrade) minGrade = sp.grade;
        }
      });

      const netEle = endPt.ele - startPt.ele;
      const avgGrade = distM > 0 ? (netEle / (endPt.dist - startPt.dist)) * 100 : 0;

      return {
        ...def,
        startIdx,
        endIdx,
        startKm: startPt.scaledDist / 1000.0,
        endKm: endPt.scaledDist / 1000.0,
        distM,
        distKm,
        startEle: startPt.ele,
        endEle: endPt.ele,
        netEle,
        gainM,
        lossM,
        avgGrade,
        maxGrade: maxGrade === -99 ? avgGrade : maxGrade,
        minGrade: minGrade === 99 ? avgGrade : minGrade,
        durationSec,
        cumSec: endPt.cumSec,
        paceSecPerKm,
        points: segPoints
      };
    });

    // 4. Constrói a Tabela Km a Km (interpolando exatamente a cada 1000m)
    const kmSplits = [];
    const totalKmCount = Math.ceil(targetTotalDistM / 1000.0 - 0.001);

    function interpolateAtDist(dMeters) {
      if (dMeters <= 0) return { ele: points[0].ele, cumSec: 0, origDist: 0 };
      if (dMeters >= targetTotalDistM) {
        const last = points[points.length - 1];
        return { ele: last.ele, cumSec: last.cumSec, origDist: last.dist };
      }
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        if (curr.scaledDist >= dMeters) {
          const span = curr.scaledDist - prev.scaledDist;
          const ratio = span > 0 ? (dMeters - prev.scaledDist) / span : 0;
          return {
            ele: prev.ele + ratio * (curr.ele - prev.ele),
            cumSec: prev.cumSec + ratio * (curr.cumSec - prev.cumSec),
            origDist: prev.dist + ratio * (curr.dist - prev.dist),
            lat: prev.lat + ratio * (curr.lat - prev.lat),
            lon: prev.lon + ratio * (curr.lon - prev.lon)
          };
        }
      }
      const last = points[points.length - 1];
      return { ele: last.ele, cumSec: last.cumSec, origDist: last.dist, lat: last.lat, lon: last.lon };
    }

    for (let k = 1; k <= totalKmCount; k++) {
      const startD = (k - 1) * 1000.0;
      const endD = Math.min(k * 1000.0, targetTotalDistM);
      const lenM = endD - startD;
      if (lenM < 25) continue;

      const startInterp = interpolateAtDist(startD);
      const endInterp = interpolateAtDist(endD);

      // Soma ganhos e perdas dos pontos internos a este Km
      let gain = 0;
      let loss = 0;
      points.forEach((pt) => {
        if (pt.scaledDist > startD && pt.scaledDist <= endD) {
          if (pt.de > 0) gain += pt.de;
          else loss += Math.abs(pt.de);
        }
      });

      const netEle = endInterp.ele - startInterp.ele;
      const realSpanM = endInterp.origDist - startInterp.origDist;
      const avgGrade = realSpanM > 0 ? (netEle / realSpanM) * 100.0 : 0;
      const splitSec = endInterp.cumSec - startInterp.cumSec;
      const paceSecPerKm = (splitSec / lenM) * 1000.0;

      // Identifica o segmento predominante no meio desse Km
      const midKm = (startD + endD) / 2000.0;
      const matchingSeg =
        segments.find((s) => midKm >= s.startKm && midKm <= s.endKm) || segments[segments.length - 1];

      kmSplits.push({
        kmNumber: k,
        label: lenM >= 995 ? `Km ${k}` : `Km ${ (endD / 1000).toFixed(2).replace(".", ",") }`,
        isPartial: lenM < 995,
        lenM,
        startD,
        endD,
        startEle: startInterp.ele,
        endEle: endInterp.ele,
        netEle,
        gain: Math.max(gain, netEle > 0 ? netEle : 0),
        loss: Math.max(loss, netEle < 0 ? Math.abs(netEle) : 0),
        avgGrade,
        splitSec,
        cumSec: endInterp.cumSec,
        paceSecPerKm,
        segmentName: matchingSeg.shortName,
        segmentColor: matchingSeg.color,
        lat: endInterp.lat,
        lon: endInterp.lon
      });
    }

    // Passagem no ponto de referência da prova (ex: 5 km num 10K) e no meio exato da distância
    const halfwayInterp = interpolateAtDist(RACE.halfwayDistM);
    const midInterp = interpolateAtDist(targetTotalDistM / 2);

    state.computed = {
      points,
      segments,
      kmSplits,
      targetTotalDistM,
      rawTotalDistM,
      avgPaceSecPerKm: state.targetSeconds / (targetTotalDistM / 1000.0),
      halfwaySec: halfwayInterp.cumSec,
      midSec: midInterp.cumSec
    };
  }

  /**
   * Atualiza todos os indicadores KPI, cards, tabelas e gráficos
   */
  function renderAll() {
    computeStrategy();
    const { segments, kmSplits, targetTotalDistM, avgPaceSecPerKm, halfwaySec, midSec } = state.computed;

    // Preview no painel de controle e barra fixa mobile
    elBasePacePreview.textContent = `${formatPace(avgPaceSecPerKm)} /km`;
    if (elMsbGoalText) elMsbGoalText.textContent = `Meta: ${formatDuration(state.targetSeconds)}`;
    if (elMsbPaceText) elMsbPaceText.textContent = `${formatPace(avgPaceSecPerKm)}/km`;

    // KPI 1: Pace Médio e Velocidade
    const speedKmh = 3600 / avgPaceSecPerKm;
    elKpiAvgPace.innerHTML = `${formatPace(avgPaceSecPerKm)}<small>/km</small>`;
    elKpiAvgSpeed.textContent = `${speedKmh.toFixed(2).replace(".", ",")} km/h · Meta: ${formatDuration(state.targetSeconds)}`;

    // KPI 2: Pace Médio nas Subidas (segmentos do tipo "uphill" ou "climb")
    const climbSegs = segments.filter((s) => s.type === "uphill" || s.type === "climb");
    const climbDistKm = climbSegs.reduce((a, s) => a + s.distKm, 0);
    const climbSec = climbSegs.reduce((a, s) => a + s.durationSec, 0);
    const climbPace = climbDistKm > 0 ? climbSec / climbDistKm : avgPaceSecPerKm;
    const climbDiff = Math.round(climbPace - avgPaceSecPerKm);
    elKpiClimbPace.innerHTML = `${formatPace(climbPace)}<small>/km</small>`;
    elKpiClimbInfo.textContent = `${climbDiff >= 0 ? "+" + climbDiff + "s/km acima" : Math.abs(climbDiff) + "s/km abaixo"} da média (${climbDistKm.toFixed(2).replace(".", ",")} km subindo)`;

    // KPI 3: Pace Médio nas Descidas (segmentos do tipo "downhill")
    const downSegs = segments.filter((s) => s.type === "downhill");
    const downDistKm = downSegs.reduce((a, s) => a + s.distKm, 0);
    const downSec = downSegs.reduce((a, s) => a + s.durationSec, 0);
    const downPace = downDistKm > 0 ? downSec / downDistKm : avgPaceSecPerKm;
    const downDiff = Math.round(avgPaceSecPerKm - downPace);
    elKpiDownhillPace.innerHTML = `${formatPace(downPace)}<small>/km</small>`;
    elKpiDownhillInfo.textContent = `${downDiff >= 0 ? "-" + downDiff + "s/km mais rápido" : "+" + Math.abs(downDiff) + "s/km mais lento"} (${downDistKm.toFixed(2).replace(".", ",")} km descendo)`;

    // KPI 4: Passagem no ponto de referência + comparação das duas metades (mesma distância cada)
    elKpiHalfwayTime.textContent = formatDuration(halfwaySec);
    const halfDiff = Math.round(state.targetSeconds - 2 * midSec);
    elKpiSplitDiff.textContent =
      halfDiff > 0
        ? `2ª metade ${halfDiff}s mais lenta que a 1ª`
        : halfDiff < 0
        ? `Negative split: 2ª metade ${Math.abs(halfDiff)}s mais rápida`
        : "Metades no mesmo tempo (split igual)";

    // KPI 5: Faixa de Pace entre Segmentos
    const segPaces = segments.map((s) => s.paceSecPerKm);
    const fastestPace = Math.min(...segPaces);
    const slowestPace = Math.max(...segPaces);
    elKpiPaceRange.textContent = `${formatPace(fastestPace)} – ${formatPace(slowestPace)}`;
    elKpiRangeSub.textContent = `Amplitude tática de ${Math.round(slowestPace - fastestPace)}s/km`;

    renderSegmentStrip();
    renderSegmentCards();
    renderKmTable();
    renderWristbands();
    drawElevationChart();
    updateMapLayers();
  }

  /**
   * Renderiza a barra rápida de segmentos abaixo do gráfico
   */
  function renderSegmentStrip() {
    const { segments, targetTotalDistM } = state.computed;
    elSegmentStripBar.innerHTML = "";
    segments.forEach((seg) => {
      const widthPct = (seg.distM / targetTotalDistM) * 100;
      const div = document.createElement("div");
      div.className = "strip-item" + (state.focusedSegmentId === seg.id ? " active" : "");
      div.style.width = `${widthPct}%`;
      div.style.backgroundColor = seg.color;
      div.textContent = `S${seg.id} (${formatPace(seg.paceSecPerKm)})`;
      div.title = `${seg.shortName}: ${formatPace(seg.paceSecPerKm)}/km`;
      div.addEventListener("click", () => focusSegment(seg.id));
      elSegmentStripBar.appendChild(div);
    });
  }

  /**
   * Renderiza os 8 Cards dos Segmentos Táticos
   */
  function renderSegmentCards() {
    const { segments, avgPaceSecPerKm } = state.computed;
    elSegmentsContainer.innerHTML = "";

    segments.forEach((seg) => {
      const paceDiff = Math.round(seg.paceSecPerKm - avgPaceSecPerKm);
      const diffBadge =
        paceDiff > 1
          ? `<span class="text-climb">(+${paceDiff}s/km vs média)</span>`
          : paceDiff < -1
          ? `<span class="text-downhill">(${paceDiff}s/km vs média)</span>`
          : `<span>(no pace médio)</span>`;

      const card = document.createElement("article");
      card.className = "segment-card" + (state.focusedSegmentId === seg.id ? " focused" : "");
      card.style.borderLeftColor = seg.color;
      card.dataset.segId = seg.id;

      card.innerHTML = `
        <div class="seg-card-top">
          <div>
            <span class="seg-number-badge" style="background: ${seg.color}22; color: ${seg.color}; border: 1px solid ${seg.color}55;">
              Segmento ${seg.id} · ${seg.badge}
            </span>
            <h4 class="seg-title">${seg.name}</h4>
            <span class="seg-km-range">
              Km ${seg.startKm.toFixed(2).replace(".", ",")} até Km ${seg.endKm.toFixed(2).replace(".", ",")} 
              (${seg.distKm.toFixed(2).replace(".", ",")} km)
            </span>
          </div>
          <div class="seg-pace-box">
            <span class="seg-pace-label">Pace Alvo</span>
            <strong class="seg-pace-val" style="color: ${seg.color}">${formatPace(seg.paceSecPerKm)}<small style="font-size:0.75rem;color:#94a3b8">/km</small></strong>
            <div style="font-size: 0.7rem; margin-top: 2px;">${diffBadge}</div>
          </div>
        </div>

        <div class="seg-stats-row">
          <div class="seg-stat-item">
            <span>Desnível Líquido</span>
            <strong class="${seg.netEle > 2 ? "text-climb" : seg.netEle < -2 ? "text-downhill" : ""}">
              ${formatSigned(seg.netEle, 1, " m")}
            </strong>
          </div>
          <div class="seg-stat-item">
            <span>Inclinação Média</span>
            <strong class="${seg.avgGrade > 0.5 ? "text-climb" : seg.avgGrade < -0.5 ? "text-downhill" : ""}">
              ${formatSigned(seg.avgGrade, 2, "%")}
            </strong>
          </div>
          <div class="seg-stat-item">
            <span>Tempo no Trecho</span>
            <strong>${formatDuration(seg.durationSec)}</strong>
          </div>
          <div class="seg-stat-item">
            <span>Relógio ao Final</span>
            <strong style="color: #ff6b35">${formatDuration(seg.cumSec)}</strong>
          </div>
        </div>

        <div class="seg-tactical-box">
          <strong>${seg.tacticalTitle}:</strong> ${seg.tacticalTip}
          <div class="seg-mental-cue">Foco mental: "${seg.mentalCue}"</div>
        </div>
      `;

      card.addEventListener("click", () => focusSegment(seg.id));
      elSegmentsContainer.appendChild(card);
    });
  }

  /**
   * Renderiza a tabela de parciais Km a Km (Desktop) e Cards Compactos (Mobile)
   */
  function renderKmTable() {
    const { kmSplits, avgPaceSecPerKm } = state.computed;
    elKmSplitsBody.innerHTML = "";
    if (elKmMobileList) elKmMobileList.innerHTML = "";

    const allPaces = kmSplits.map((k) => k.paceSecPerKm);
    const minP = Math.min(...allPaces);
    const maxP = Math.max(...allPaces);

    kmSplits.forEach((km) => {
      const tr = document.createElement("tr");
      const diff = Math.round(km.paceSecPerKm - avgPaceSecPerKm);
      const diffText = diff > 0 ? `+${diff}s` : `${diff}s`;
      const gradeClass =
        km.avgGrade > 0.8 ? "text-climb" : km.avgGrade < -0.6 ? "text-downhill" : "";

      // Barra visual: quanto mais rápido, mais preenchida/verde; mais lento, laranja/vermelho
      const norm = maxP > minP ? (km.paceSecPerKm - minP) / (maxP - minP) : 0.5;
      const barWidth = Math.round(35 + norm * 65);
      const barColor =
        km.avgGrade > 1.2 ? "#ef4444" : km.avgGrade > 0.3 ? "#f59e0b" : "#10b981";

      tr.innerHTML = `
        <td class="mono-cell">
          <strong>${km.label}</strong>
          ${km.isPartial ? `<div style="font-size:0.7rem;color:#94a3b8">(${Math.round(km.lenM)}m finais)</div>` : ""}
        </td>
        <td>
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${km.segmentColor};margin-right:6px;"></span>
          ${km.segmentName}
        </td>
        <td class="mono-cell">${km.startEle.toFixed(1).replace(".", ",")}m → ${km.endEle.toFixed(1).replace(".", ",")}m</td>
        <td class="mono-cell">
          <span class="text-climb">+${km.gain.toFixed(1).replace(".", ",")}m</span> / 
          <span class="text-downhill">-${km.loss.toFixed(1).replace(".", ",")}m</span>
        </td>
        <td class="mono-cell ${gradeClass}">${formatSigned(km.avgGrade, 2, "%")}</td>
        <td class="mono-cell" style="font-size:0.96rem;">
          <strong style="color:${barColor}">${formatPace(km.paceSecPerKm)}</strong>/km
          <small style="color:#94a3b8;margin-left:4px;">(${diffText})</small>
        </td>
        <td>
          <div class="pace-bar-wrap">
            <div class="pace-bar-fill" style="width:${barWidth}%;background:${barColor}"></div>
          </div>
        </td>
        <td class="mono-cell">${formatDuration(km.splitSec)}</td>
        <td class="mono-cell" style="color:#ff6b35;font-size:0.95rem;"><strong>${formatDuration(km.cumSec)}</strong></td>
      `;
      elKmSplitsBody.appendChild(tr);

      // Card Mobile sem rolagem horizontal
      if (elKmMobileList) {
        const mCard = document.createElement("div");
        mCard.className = "km-mobile-card";
        mCard.style.borderLeftColor = km.segmentColor;
        mCard.innerHTML = `
          <div class="kmc-top">
            <div class="kmc-title-group">
              <div class="kmc-km-badge">
                ${km.label}
                ${km.isPartial ? `<small style="font-size:0.7rem;color:#94a3b8;font-weight:500;">(${Math.round(km.lenM)}m)</small>` : ""}
              </div>
              <div class="kmc-seg-name">
                <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${km.segmentColor};"></span>
                ${km.segmentName}
              </div>
            </div>
            <div class="kmc-paces-right">
              <div class="kmc-pace-box">
                <span class="kmc-mini-label">Pace (${diffText})</span>
                <strong class="kmc-pace-val" style="color:${barColor}">${formatPace(km.paceSecPerKm)}<small style="font-size:0.68rem;color:#94a3b8">/km</small></strong>
              </div>
              <div class="kmc-clock-box">
                <span class="kmc-mini-label">Relógio</span>
                <strong class="kmc-clock-val">${formatDuration(km.cumSec)}</strong>
              </div>
            </div>
          </div>
          <div class="kmc-bar-row">
            <div class="kmc-bar-fill" style="width:${barWidth}%;background:${barColor}"></div>
          </div>
          <div class="kmc-bottom-metrics">
            <div class="kmc-metric">
              <span>Parcial do Km</span>
              <strong>${formatDuration(km.splitSec)}</strong>
            </div>
            <div class="kmc-metric">
              <span>Subida / Descida</span>
              <strong><span class="text-climb">+${km.gain.toFixed(0)}m</span> / <span class="text-downhill">-${km.loss.toFixed(0)}m</span></strong>
            </div>
            <div class="kmc-metric">
              <span>Inclinação (${km.endEle.toFixed(0)}m)</span>
              <strong class="${gradeClass}">${formatSigned(km.avgGrade, 1, "%")}</strong>
            </div>
          </div>
        `;
        elKmMobileList.appendChild(mCard);
      }
    });
  }

  /**
   * Renderiza as duas pulseiras (Cola de Pulso por Segmento e por Km)
   */
  function renderWristbands() {
    const { segments, kmSplits, avgPaceSecPerKm } = state.computed;
    const goalHeader = `META: ${formatDuration(state.targetSeconds)} (${formatPace(avgPaceSecPerKm)}/km)`;
    elWbSegGoal.textContent = goalHeader;
    elWbKmGoal.textContent = goalHeader;

    elWbSegmentsBody.innerHTML = "";
    segments.forEach((seg) => {
      const icon = seg.netEle > 3 ? "▲" : seg.netEle < -3 ? "▼" : "–";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>S${seg.id}</strong> ${icon} (${formatSigned(seg.netEle, 0, "m")})</td>
        <td>${seg.endKm.toFixed(1).replace(".", ",")}k</td>
        <td><strong>${formatPace(seg.paceSecPerKm)}</strong></td>
        <td><strong>${formatDuration(seg.cumSec)}</strong></td>
      `;
      elWbSegmentsBody.appendChild(tr);
    });

    elWbKmBody.innerHTML = "";
    kmSplits.forEach((km) => {
      const icon = km.avgGrade > 0.8 ? "▲" : km.avgGrade < -0.6 ? "▼" : "–";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${km.label}</strong></td>
        <td>${icon} ${formatSigned(km.netEle, 0, "m")}</td>
        <td><strong>${formatPace(km.paceSecPerKm)}</strong></td>
        <td><strong>${formatDuration(km.cumSec)}</strong></td>
      `;
      elWbKmBody.appendChild(tr);
    });
  }

  function getChartPadding(width) {
    const isCompact = width < 520;
    return {
      top: isCompact ? 24 : 28,
      right: isCompact ? 34 : 48,
      bottom: isCompact ? 28 : 34,
      left: isCompact ? 34 : 48
    };
  }

  /**
   * Desenha o gráfico interativo de Altimetria + Pace no Canvas High-DPI
   */
  function drawElevationChart(hoverDistM = null) {
    if (!canvas || !state.computed) return;
    const { points, segments, targetTotalDistM } = state.computed;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width <= 0 || height <= 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const pad = getChartPadding(width);
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    ctx.clearRect(0, 0, width, height);

    // Eixo de altitude automático a partir do percurso (com folga em cima e embaixo)
    const eleValues = points.map((p) => p.ele);
    const minEle = Math.floor((Math.min(...eleValues) - 6) / 10) * 10;
    const maxEle = Math.ceil((Math.max(...eleValues) + 5) / 10) * 10;

    const xOf = (distM) => pad.left + (distM / targetTotalDistM) * plotW;
    const yOfEle = (ele) => pad.top + plotH - ((ele - minEle) / (maxEle - minEle)) * plotH;

    // 1. Linhas de grade horizontais (Altitude)
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64748b";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";

    const eleStep = maxEle - minEle > 120 ? 20 : 10;
    for (let e = Math.ceil(minEle / eleStep) * eleStep; e <= maxEle; e += eleStep) {
      const y = yOfEle(e);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
      ctx.fillText(`${e}m`, pad.left - 8, y + 4);
    }

    // 2. Linhas verticais de cada Km
    ctx.textAlign = "center";
    const maxKm = Math.floor(targetTotalDistM / 1000);
    for (let k = 0; k <= maxKm; k++) {
      const x = xOf(k * 1000);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + plotH);
      ctx.stroke();
      ctx.fillText(`${k}k`, x, height - 10);
    }

    // 3. Preenchimento colorido sob cada um dos 8 segmentos
    segments.forEach((seg) => {
      const segPts = seg.points;
      if (segPts.length < 2) return;

      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
      const isFocused = state.focusedSegmentId === null || state.focusedSegmentId === seg.id;
      const alphaTop = isFocused ? "88" : "28";
      const alphaBot = isFocused ? "18" : "08";
      grad.addColorStop(0, seg.color + alphaTop);
      grad.addColorStop(1, seg.color + alphaBot);

      ctx.beginPath();
      ctx.moveTo(xOf(segPts[0].scaledDist), pad.top + plotH);
      segPts.forEach((pt) => {
        ctx.lineTo(xOf(pt.scaledDist), yOfEle(pt.ele));
      });
      ctx.lineTo(xOf(segPts[segPts.length - 1].scaledDist), pad.top + plotH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Linha superior de elevação do segmento
      ctx.beginPath();
      segPts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(xOf(pt.scaledDist), yOfEle(pt.ele));
        else ctx.lineTo(xOf(pt.scaledDist), yOfEle(pt.ele));
      });
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = state.focusedSegmentId === seg.id ? 3.5 : 2.2;
      ctx.stroke();

      // Divisor vertical entre segmentos + Rótulo S1..S8 no topo
      const segMidX = xOf((seg.startKm * 1000 + seg.endKm * 1000) / 2);
      ctx.fillStyle = isFocused ? "#e2e8f0" : "#64748b";
      ctx.font = "bold 10px 'Inter', sans-serif";
      ctx.fillText(`S${seg.id}`, segMidX, pad.top - 8);
    });

    // 4. Linha tracejada do Pace Alvo de cada segmento
    const segPaces = segments.map((s) => s.paceSecPerKm);
    const minPace = Math.min(...segPaces) - 10;
    const maxPace = Math.max(...segPaces) + 10;
    const yOfPace = (p) => pad.top + ((p - minPace) / (maxPace - minPace)) * (plotH * 0.75) + plotH * 0.1;

    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    segments.forEach((seg, idx) => {
      const x1 = xOf(seg.startKm * 1000);
      const x2 = xOf(seg.endKm * 1000);
      const yP = yOfPace(seg.paceSecPerKm);
      if (idx === 0) ctx.moveTo(x1, yP);
      else ctx.lineTo(x1, yP);
      ctx.lineTo(x2, yP);
    });
    ctx.stroke();
    ctx.restore();

    // Eixo direito com referência de Pace
    ctx.textAlign = "left";
    ctx.fillStyle = "#ff6b35";
    ctx.font = "10px 'JetBrains Mono', monospace";
    const fastP = Math.min(...segPaces);
    const slowP = Math.max(...segPaces);
    ctx.fillText(`${formatPace(fastP)}`, pad.left + plotW + 6, yOfPace(fastP) + 3);
    ctx.fillText(`${formatPace(slowP)}`, pad.left + plotW + 6, yOfPace(slowP) + 3);

    // 5. Cursor de Hover
    if (hoverDistM !== null && hoverDistM >= 0 && hoverDistM <= targetTotalDistM) {
      const hx = xOf(hoverDistM);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hx, pad.top);
      ctx.lineTo(hx, pad.top + plotH);
      ctx.stroke();

      // Encontra o ponto mais próximo
      let nearest = points[0];
      for (let i = 1; i < points.length; i++) {
        if (Math.abs(points[i].scaledDist - hoverDistM) < Math.abs(nearest.scaledDist - hoverDistM)) {
          nearest = points[i];
        }
      }

      const hy = yOfEle(nearest.ele);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  /**
   * Interação de mouse/toque no gráfico de altimetria
   */
  function setupChartInteractions() {
    function handleMove(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const pad = getChartPadding(rect.width);
      const plotW = rect.width - pad.left - pad.right;
      const relX = clientX - rect.left - pad.left;

      if (relX < 0 || relX > plotW || !state.computed) {
        tooltip.classList.add("hidden");
        drawElevationChart(null);
        return;
      }

      const { points, segments, targetTotalDistM } = state.computed;
      const distM = (relX / plotW) * targetTotalDistM;
      drawElevationChart(distM);

      // Ponto mais próximo
      let nearest = points[0];
      for (let i = 1; i < points.length; i++) {
        if (Math.abs(points[i].scaledDist - distM) < Math.abs(nearest.scaledDist - distM)) {
          nearest = points[i];
        }
      }

      const kmVal = nearest.scaledDist / 1000.0;
      const activeSeg =
        segments.find((s) => kmVal >= s.startKm && kmVal <= s.endKm) || segments[segments.length - 1];

      // Atualiza a barra de inspeção mobile (visível em telas <= 768px)
      if (elMobileChartInspector) {
        elMobileChartInspector.innerHTML = `
          <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <strong style="color:${activeSeg.color};font-size:0.78rem;">${activeSeg.shortName}</strong>
            <span style="font-family:var(--font-mono);font-size:0.75rem;color:#e5e5e5;">Km ${kmVal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;font-family:var(--font-mono);font-size:0.75rem;">
            <span>Alt. ${nearest.ele.toFixed(1).replace(".", ",")}m (${formatSigned(nearest.grade, 1, "%")})</span>
            <span style="color:#ff6b35;">Pace <strong>${formatPace(activeSeg.paceSecPerKm)}/km</strong></span>
            <span>Tempo ${formatDuration(nearest.cumSec)}</span>
          </div>
        `;
      }

      if (window.innerWidth > 768) {
        tooltip.classList.remove("hidden");
        tooltip.innerHTML = `
          <div style="font-weight:700;color:${activeSeg.color};margin-bottom:4px;">${activeSeg.shortName}</div>
          <div><strong>Distância:</strong> Km ${kmVal.toFixed(2).replace(".", ",")}</div>
          <div><strong>Altitude:</strong> ${nearest.ele.toFixed(1).replace(".", ",")} m (${formatSigned(nearest.grade, 1, "%")})</div>
          <div><strong>Pace do segmento:</strong> <strong style="color:#ff6b35">${formatPace(activeSeg.paceSecPerKm)}/km</strong></div>
          <div><strong>Tempo estimado:</strong> ${formatDuration(nearest.cumSec)}</div>
        `;

        // Posiciona o tooltip sem sair do card
        const tipX = Math.min(rect.width - 210, Math.max(10, clientX - rect.left + 14));
        const tipY = Math.max(12, clientY - rect.top - 70);
        tooltip.style.left = `${tipX}px`;
        tooltip.style.top = `${tipY}px`;
      } else {
        tooltip.classList.add("hidden");
      }

      // Move o marcador no mapa Leaflet ou Canvas Offline
      if (map && hoverMarker) {
        hoverMarker.setLatLng([nearest.lat, nearest.lon]);
        hoverMarker.setStyle({ opacity: 1, fillOpacity: 0.9 });
      } else {
        drawOfflineVectorMap(nearest);
      }
    }

    canvas.addEventListener("mousemove", (e) => handleMove(e.clientX, e.clientY));
    canvas.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length > 0) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    canvas.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length > 0) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    canvas.addEventListener("mouseleave", () => {
      tooltip.classList.add("hidden");
      drawElevationChart(null);
      if (hoverMarker) hoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
      else drawOfflineVectorMap(null);
    });
  }

  /**
   * Mapa Vetorial 100% Offline em Canvas (caso não haja internet para carregar o Leaflet CDN)
   */
  function drawOfflineVectorMap(hoverPt = null) {
    const mapContainer = document.getElementById("courseMap");
    if (!mapContainer || !state.computed) return;
    let offCanvas = document.getElementById("offlineMapCanvas");
    if (!offCanvas) {
      mapContainer.innerHTML = "";
      offCanvas = document.createElement("canvas");
      offCanvas.id = "offlineMapCanvas";
      offCanvas.style.width = "100%";
      offCanvas.style.height = "100%";
      offCanvas.style.display = "block";
      mapContainer.appendChild(offCanvas);
    }

    const { points, segments, kmSplits } = state.computed;
    const dpr = window.devicePixelRatio || 1;
    const rect = mapContainer.getBoundingClientRect();
    offCanvas.width = rect.width * dpr;
    offCanvas.height = rect.height * dpr;
    const ctx = offCanvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.fillStyle = "#0b0f19";
    ctx.fillRect(0, 0, w, h);

    const lats = points.map((p) => p.lat);
    const lons = points.map((p) => p.lon);
    const minLat = Math.min(...lats),
      maxLat = Math.max(...lats);
    const minLon = Math.min(...lons),
      maxLon = Math.max(...lons);

    const pad = 32;
    const scaleX = (w - pad * 2) / (maxLon - minLon || 0.001);
    const scaleY = (h - pad * 2) / (maxLat - minLat || 0.001);
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (w - (maxLon - minLon) * scale) / 2;
    const offsetY = (h - (maxLat - minLat) * scale) / 2;

    const toXY = (lat, lon) => ({
      x: offsetX + (lon - minLon) * scale,
      y: h - (offsetY + (lat - minLat) * scale)
    });

    segments.forEach((seg) => {
      ctx.beginPath();
      seg.points.forEach((p, idx) => {
        const { x, y } = toXY(p.lat, p.lon);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      const isFocused = state.focusedSegmentId === null || state.focusedSegmentId === seg.id;
      ctx.strokeStyle = seg.color;
      ctx.globalAlpha = isFocused ? 0.95 : 0.28;
      ctx.lineWidth = state.focusedSegmentId === seg.id ? 6 : 4;
      ctx.lineCap = "round";
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    kmSplits.forEach((km) => {
      if (km.isPartial || !km.lat) return;
      const { x, y } = toXY(km.lat, km.lon);
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(km.kmNumber), x, y + 3);
    });

    if (hoverPt) {
      const { x, y } = toXY(hoverPt.lat, hoverPt.lon);
      ctx.fillStyle = "#fc4c02";
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  /**
   * Inicializa e atualiza o mapa interativo Leaflet
   */
  function initMap() {
    if (typeof L === "undefined") {
      return;
    }
    map = L.map("courseMap", {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView(RACE.mapCenter || [-21.469, -49.225], RACE.mapZoom || 14);

    // Mapa do OpenStreetMap (gratuito, sem chave). O visual escuro vem do filtro CSS .map-tiles-dark.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      className: "map-tiles-dark"
    }).addTo(map);

    kmMarkersLayer = L.layerGroup().addTo(map);
    anomalyMarkersLayer = L.layerGroup().addTo(map);

    hoverMarker = L.circleMarker([-21.46748, -49.23273], {
      radius: 7,
      color: "#ffffff",
      weight: 3,
      fillColor: "#fc4c02",
      fillOpacity: 0,
      opacity: 0
    }).addTo(map);
  }

  function updateMapLayers() {
    if (!state.computed) return;
    if (!map) {
      drawOfflineVectorMap();
      return;
    }
    const { segments, kmSplits, points } = state.computed;

    // Remove polylines antigas
    segmentPolylines.forEach((poly) => map.removeLayer(poly));
    segmentPolylines = [];
    kmMarkersLayer.clearLayers();
    anomalyMarkersLayer.clearLayers();

    // Desenha cada um dos 8 segmentos com sua cor
    segments.forEach((seg) => {
      const latlngs = seg.points.map((p) => [p.lat, p.lon]);
      const isFocused = state.focusedSegmentId === null || state.focusedSegmentId === seg.id;
      const poly = L.polyline(latlngs, {
        color: seg.color,
        weight: state.focusedSegmentId === seg.id ? 7 : 5,
        opacity: isFocused ? 0.92 : 0.3
      }).addTo(map);

      poly.bindPopup(`
        <div style="font-family:'Inter',sans-serif;color:#0f172a;min-width:180px;">
          <strong style="font-size:13px;">${seg.shortName}</strong><br/>
          <span>Km ${seg.startKm.toFixed(2).replace(".", ",")} a ${seg.endKm.toFixed(2).replace(".", ",")} (${formatSigned(seg.netEle, 1, "m")})</span><br/>
          <strong style="color:#fc4c02;font-size:14px;">Pace Alvo: ${formatPace(seg.paceSecPerKm)}/km</strong><br/>
          <small>Passagem final: ${formatDuration(seg.cumSec)}</small>
        </div>
      `);

      poly.on("click", () => focusSegment(seg.id));
      segmentPolylines.push(poly);
    });

    // Marcador de Largada / Chegada
    const startPt = points[0];
    const startIcon = L.divIcon({
      className: "",
      html: `<div class="special-marker-badge" style="background:#10b981;color:#052e16;">Largada/Chegada</div>`,
      iconSize: [96, 24],
      iconAnchor: [48, 12]
    });
    L.marker([startPt.lat, startPt.lon], { icon: startIcon }).addTo(kmMarkersLayer);

    // Marcadores do ponto mais alto e mais baixo do percurso (calculados do GPX)
    const maxPt = points.reduce((best, p) => (p.ele > best.ele ? p : best), points[0]);
    const minPt = points.reduce((best, p) => (p.ele < best.ele ? p : best), points[0]);

    const peakIcon = L.divIcon({
      className: "",
      html: `<div class="special-marker-badge" style="background:#ef4444;color:#fff;">Topo ${formatEle(maxPt.ele)}</div>`,
      iconSize: [96, 22],
      iconAnchor: [48, 26]
    });
    L.marker([maxPt.lat, maxPt.lon], { icon: peakIcon }).addTo(kmMarkersLayer);

    const valleyIcon = L.divIcon({
      className: "",
      html: `<div class="special-marker-badge" style="background:#38bdf8;color:#0f172a;">Vale ${formatEle(minPt.ele)}</div>`,
      iconSize: [96, 22],
      iconAnchor: [48, -6]
    });
    L.marker([minPt.lat, minPt.lon], { icon: valleyIcon }).addTo(kmMarkersLayer);

    // Marcadores de cada Km
    kmSplits.forEach((km) => {
      if (km.isPartial || !km.lat || !km.lon) return;
      const icon = L.divIcon({
        className: "km-marker-badge",
        html: `${km.kmNumber}`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      const m = L.marker([km.lat, km.lon], { icon }).addTo(kmMarkersLayer);
      m.bindPopup(`
        <div style="font-family:'Inter',sans-serif;color:#0f172a;">
          <strong>Placa do Km ${km.kmNumber}</strong><br/>
          Pace deste Km: <strong>${formatPace(km.paceSecPerKm)}/km</strong><br/>
          Tempo no Relógio: <strong>${formatDuration(km.cumSec)}</strong>
        </div>
      `);
    });

    // Marcadores das Anomalias do GPX Original
    if (state.showAnomalies) {
      RACE.anomalyMarkers.forEach((a) => {
        const icon = L.divIcon({
          className: "",
          html: `<div class="special-marker-badge" style="background:#f59e0b;color:#0f172a;">Erro GPX</div>`,
          iconSize: [62, 20],
          iconAnchor: [31, 10]
        });
        L.marker([a.lat, a.lon], { icon })
          .bindPopup(`<div style="color:#0f172a;font-size:12px;"><strong>${a.title}</strong></div>`)
          .addTo(anomalyMarkersLayer);
      });
    }
  }

  /**
   * Destaca um segmento específico no gráfico, mapa e lista de cards
   */
  function focusSegment(segId) {
    state.focusedSegmentId = state.focusedSegmentId === segId ? null : segId;
    renderSegmentStrip();
    renderSegmentCards();
    drawElevationChart();
    updateMapLayers();

    if (state.focusedSegmentId !== null && map) {
      const seg = state.computed.segments.find((s) => s.id === state.focusedSegmentId);
      if (seg && seg.points.length > 1) {
        const bounds = L.latLngBounds(seg.points.map((p) => [p.lat, p.lon]));
        map.fitBounds(bounds, { padding: [35, 35] });
      }
    }
  }

  /**
   * Renderiza a lista de anomalias na aba de Diagnóstico
   */
  function renderDiagnosisAnomalies() {
    if (!elAnomaliesList) return;
    const list = window.COURSE_DATA.metadata.anomaliesDetected;
    elAnomaliesList.innerHTML = "";
    list.forEach((item) => {
      const div = document.createElement("div");
      div.className = "anomaly-item";
      div.innerHTML = `
        <strong>${item.title} (${item.points}) ${item.extraDistM > 0 ? `— +${item.extraDistM}m extras` : ""}</strong>
        <span>${item.description}</span>
      `;
      elAnomaliesList.appendChild(div);
    });
  }

  /**
   * Sincroniza os campos de hora, minuto e segundo com state.targetSeconds
   */
  function syncInputsFromTargetSeconds() {
    const h = Math.floor(state.targetSeconds / 3600);
    const m = Math.floor((state.targetSeconds % 3600) / 60);
    const s = state.targetSeconds % 60;
    elHours.value = h;
    elMinutes.value = String(m).padStart(2, "0");
    elSeconds.value = String(s).padStart(2, "0");

    elPresetBtns.forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.seconds) === state.targetSeconds);
    });
  }

  function handleTimeInputChange() {
    const h = Math.max(0, Math.min(RACE.maxHours, parseInt(elHours.value, 10) || 0));
    const m = Math.max(0, Math.min(59, parseInt(elMinutes.value, 10) || 0));
    const s = Math.max(0, Math.min(59, parseInt(elSeconds.value, 10) || 0));
    const total = h * 3600 + m * 60 + s;
    // Garante um tempo mínimo realista para a prova (RACE.minTargetSeconds)
    state.targetSeconds = Math.max(RACE.minTargetSeconds, total);
    elPresetBtns.forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.seconds) === state.targetSeconds);
    });
    renderAll();
  }

  /**
   * Gera o texto resumido da estratégia para compartilhamento / cópia
   */
  function buildStrategySummaryText() {
    const { segments, avgPaceSecPerKm } = state.computed;
    const lines = [
      `🏃‍♂️ *${RACE.title.toUpperCase()}*`,
      `🎯 *Tempo Alvo:* ${formatDuration(state.targetSeconds)} (Pace médio: ${formatPace(avgPaceSecPerKm)}/km)`
    ];
    if (RACE.summaryElevation) lines.push(`⛰️ *Desnível:* ${RACE.summaryElevation}`);
    lines.push(`----------------------------------------`);
    segments.forEach((s) => {
      const signEle = formatSigned(s.netEle, 1, "m");
      lines.push(
        `*S${s.id} (${s.startKm.toFixed(1).replace(".", ",")}-${s.endKm.toFixed(1).replace(".", ",")}km | ${signEle}):* Pace *${formatPace(s.paceSecPerKm)}/km* ⏱️ Relógio: ${formatDuration(s.cumSec)}`
      );
    });
    lines.push(`----------------------------------------`);
    if (RACE.summaryReminder) lines.push(`💡 *Lembrete:* ${RACE.summaryReminder}`);
    return lines.join("\n");
  }

  /**
   * Copia resumo tático formatado para WhatsApp / Bloco de Notas
   */
  function copyStrategyToClipboard() {
    const text = buildStrategySummaryText();
    navigator.clipboard.writeText(text).then(() => {
      const fb = document.getElementById("copyFeedback");
      fb.classList.remove("hidden");
      setTimeout(() => fb.classList.add("hidden"), 3500);
    });
  }

  /**
   * Compartilha nativamente no celular (Web Share API) ou copia como fallback
   */
  function shareStrategyMobile() {
    const text = buildStrategySummaryText();
    if (navigator.share) {
      navigator
        .share({
          title: `${RACE.title} (${formatDuration(state.targetSeconds)})`,
          text
        })
        .catch(() => {
          copyStrategyToClipboard();
        });
    } else {
      copyStrategyToClipboard();
    }
  }

  /**
   * Permite testar o upload de outro arquivo .GPX
   */
  /**
   * Inicialização de Eventos
   */
  function init() {
    // O menu da navbar é controlado pelo /js/navbar.js do site.
    initMap();
    renderDiagnosisAnomalies();
    setupChartInteractions();

    [elHours, elMinutes, elSeconds].forEach((input) => {
      input.addEventListener("input", handleTimeInputChange);
      input.addEventListener("change", () => {
        syncInputsFromTargetSeconds();
        renderAll();
      });
    });

    elPresetBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        state.targetSeconds = Number(btn.dataset.seconds);
        syncInputsFromTargetSeconds();
        renderAll();
      });
    });

    const strategyDescriptions = Object.assign(
      {
        "even-effort":
          "Mantém seu batimento cardíaco e esforço estáveis: reduz o ritmo proporcionalmente nas subidas e compensa nas descidas.",
        conservative:
          "Poupa energia no começo da prova para enfrentar as subidas mais fortes e sobrar fôlego no final.",
        "aggressive-downhill":
          "Ataca forte as descidas favoráveis e adota postura mais cautelosa nas rampas íngremes."
      },
      RACE.strategyDescriptions
    );

    elStrategySelect.addEventListener("change", () => {
      state.strategy = elStrategySelect.value;
      elStrategyDesc.textContent = strategyDescriptions[state.strategy] || "";
      renderAll();
    });

    const distanceHints = RACE.distanceHints;

    elDistanceModeSelect.addEventListener("change", () => {
      state.customTrack = null;
      state.distanceMode = elDistanceModeSelect.value;
      elDistanceModeHint.textContent = distanceHints[state.distanceMode] || "";
      renderAll();
    });

    elHillSensitivity.addEventListener("input", () => {
      const val = Number(elHillSensitivity.value);
      state.hillSensitivity = val / 100.0;
      const label =
        val < 90
          ? `Forte em Subida (${val}%)`
          : val > 110
          ? `Cauteloso em Subida (${val}%)`
          : `Padrão (${val}%)`;
      elHillSensitivityLabel.textContent = label;
      renderAll();
    });

    if (elToggleAnomalies) {
      elToggleAnomalies.addEventListener("change", () => {
        state.showAnomalies = elToggleAnomalies.checked;
        updateMapLayers();
      });
    }

    document.getElementById("resetMapBtn").addEventListener("click", () => {
      state.focusedSegmentId = null;
      renderAll();
      if (map && state.computed) {
        map.fitBounds(L.latLngBounds(state.computed.points.map((p) => [p.lat, p.lon])), {
          padding: [25, 25]
        });
      }
    });

    // Botões de ajuste rápido (-1m, -30s, +30s, +1m)
    document.querySelectorAll(".step-time-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = Number(btn.dataset.delta) || 0;
        state.targetSeconds = Math.max(RACE.minTargetSeconds, Math.min(RACE.maxHours * 3600, state.targetSeconds + delta));
        syncInputsFromTargetSeconds();
        renderAll();
      });
    });

    // Alternador de visualização Mobile (Gráfico + Mapa / Só Altimetria / Só Mapa)
    const mvsBtns = document.querySelectorAll(".mvs-btn");
    const visualsGrid = document.getElementById("visualsGridSection");
    mvsBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        mvsBtns.forEach((b) => b.classList.toggle("active", b === btn));
        if (visualsGrid) {
          visualsGrid.classList.remove("mobile-only-chart", "mobile-only-map");
          if (view === "chart") visualsGrid.classList.add("mobile-only-chart");
          else if (view === "map") visualsGrid.classList.add("mobile-only-map");
        }
        setTimeout(() => {
          drawElevationChart();
          if (map) map.invalidateSize();
          else drawOfflineVectorMap();
        }, 50);
      });
    });

    // Tabs Navigation
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    function activateTab(targetId, scrollToTabs = false) {
      tabBtns.forEach((b) => {
        const isMatch = b.dataset.tab === targetId;
        b.classList.toggle("active", isMatch);
        b.setAttribute("aria-selected", isMatch ? "true" : "false");
      });
      tabContents.forEach((content) => {
        content.classList.toggle("active", content.id === targetId);
      });
      if (scrollToTabs) {
        const tabsSection = document.getElementById("tabsSection");
        if (tabsSection) {
          const y = tabsSection.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => activateTab(btn.dataset.tab, false));
    });

    // Barra Fixa Mobile (Sticky Bar) ao rolar a página
    const stickyBar = document.getElementById("mobileStickyBar");
    const controlCard = document.getElementById("controlCardSection");
    if (stickyBar && controlCard) {
      window.addEventListener(
        "scroll",
        () => {
          const rect = controlCard.getBoundingClientRect();
          const shouldShow = rect.bottom < 0;
          stickyBar.classList.toggle("visible", shouldShow);
          stickyBar.setAttribute("aria-hidden", shouldShow ? "false" : "true");
        },
        { passive: true }
      );
    }

    const msbEditGoalBtn = document.getElementById("msbEditGoalBtn");
    if (msbEditGoalBtn && controlCard) {
      msbEditGoalBtn.addEventListener("click", () => {
        controlCard.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    const msbSegmentsBtn = document.getElementById("msbSegmentsBtn");
    if (msbSegmentsBtn) {
      msbSegmentsBtn.addEventListener("click", () => activateTab("tab-segments", true));
    }
    const msbSplitsBtn = document.getElementById("msbSplitsBtn");
    if (msbSplitsBtn) {
      msbSplitsBtn.addEventListener("click", () => activateTab("tab-kms", true));
    }
    const msbWristbandBtn = document.getElementById("msbWristbandBtn");
    if (msbWristbandBtn) {
      msbWristbandBtn.addEventListener("click", () => activateTab("tab-wristband", true));
    }

    const shareMobileBtn = document.getElementById("shareMobileBtn");
    if (shareMobileBtn) {
      shareMobileBtn.addEventListener("click", shareStrategyMobile);
    }
    document.getElementById("copySummaryTextBtn").addEventListener("click", copyStrategyToClipboard);
    document.getElementById("printStrategyBtn").addEventListener("click", () => window.print());
    // Impressão só das pulseiras: marca o <html> para o CSS de impressão esconder todo o resto
    document.getElementById("printWristbandOnlyBtn").addEventListener("click", () => {
      const root = document.documentElement;
      const clear = () => root.classList.remove("print-wristbands");
      root.classList.add("print-wristbands");
      window.addEventListener("afterprint", clear, { once: true });
      window.print();
      // Alguns navegadores de celular não disparam "afterprint": garante a limpeza depois
      setTimeout(clear, 1000);
    });

    window.addEventListener("resize", () => drawElevationChart());

    syncInputsFromTargetSeconds();
    renderAll();

    if (map && state.computed) {
      map.fitBounds(L.latLngBounds(state.computed.points.map((p) => [p.lat, p.lon])), {
        padding: [25, 25]
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
