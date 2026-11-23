// Gerado por scripts/gerar-course-data.js a partir de "MONCOES_RUN_ORIGINAL.gpx". NÃO edite à mão:
// mude o estrategia.config.json desta pasta e rode o script de novo.
window.COURSE_DATA = {
  race: {
    "title": "Estratégia Corrida de Rua de Monções",
    "date": "2026-11-29",
    "gaCategory": "corrida_de_rua_de_moncoes",
    "officialDistanceM": 5000,
    "defaultTargetSeconds": 1500,
    "minTargetSeconds": 780,
    "maxHours": 2,
    "halfwayDistM": 2500,
    "summaryElevation": "+68,1m D+ (6 Segmentos Táticos)",
    "summaryReminder": "Não gaste na descida até o retorno do Km 1,5: a subida da Rio Grande do Sul e da Rua Paraná vem logo depois. A chegada é em descida, guarde o sprint para o fim!",
    "strategyDescriptions": {
      "conservative": "Corre os primeiros 2 km (zigue-zague, descida e retorno no vale) um pouco abaixo do ritmo e usa a energia guardada para fechar forte a partir do Km 3,4: fim da Av. Rondônia, subida ao topo e descida final até a chegada.",
      "aggressive-downhill": "Ataca forte as descidas (Seg 2 e 6) e segura o esforço nas subidas (Seg 1, 3 e 5)."
    },
    "mapCenter": [
      -20.8522,
      -50.0946
    ],
    "anomalyMarkers": []
  },
  metadata: {
    "name": "1ª Corrida de Rua de Monções – Monções Run",
    "city": "Monções - SP",
    "author": "Strava (rota publicada pela organização)",
    "startElevation": 447.92,
    "minElevation": 421.73,
    "maxElevation": 461.97,
    "stats": {
      "rawDistM": 5210.5,
      "cleanDistM": 5210.5,
      "rawPoints": 78,
      "cleanPoints": 78,
      "rawGainM": 68.9,
      "cleanGainM": 68.1,
      "cleanLossM": 68.1
    },
    "anomaliesDetected": [
      {
        "id": "ruido-altimetrico",
        "title": "Ruído de altitude em 2 trechos curtos",
        "points": "Pior caso no Km 1,28",
        "extraDistM": 0,
        "description": "Saltos de altitude em trechos de poucos metros criam inclinações falsas (pior caso: -13,3% em 18,5m). A trilha limpa suaviza a altitude num raio de 35m, e o desnível acumulado cai de +68,9m para +68,1m."
      }
    ]
  },
  segmentDefinitions: [
    {
      "id": 1,
      "name": "Largada e Zigue-Zague pelo Bairro",
      "shortName": "Seg 1 · Zigue-Zague",
      "type": "uphill",
      "badge": "Subida Leve",
      "color": "#f59e0b",
      "startOrigIdx": 0,
      "endOrigIdx": 9,
      "tacticalTitle": "+11m em 640m, com quatro curvas fechadas",
      "tacticalTip": "A largada sai pela Av. Rondônia e logo entra num zigue-zague pelas quadras (Rua Rui Barbosa, Rua Bernardino Pinto, Rua Mato Grosso), sempre subindo de leve (média +1,6%). São quatro curvas de 90° em 600m: não brigue por posição em cada esquina, faça a curva por dentro e procure o seu ritmo. O ponto alto deste começo é o Km 0,6, de onde começa a grande descida.",
      "mentalCue": "Calma nas curvas: o ritmo se acha depois do Km 0,6."
    },
    {
      "id": 2,
      "name": "Grande Descida e Retorno no Vale",
      "shortName": "Seg 2 · Descida e Retorno",
      "type": "downhill",
      "badge": "Descida Forte",
      "color": "#10b981",
      "startOrigIdx": 9,
      "endOrigIdx": 24,
      "tacticalTitle": "-37m até o ponto mais baixo, com retorno no Km 1,5",
      "tacticalTip": "Do Km 0,6 o percurso desce firme até a Rua Rio Grande do Sul (cerca de 8% perto do Km 1,1) e chega ao ponto mais baixo da prova (421,7m) na Rodovia Vicinal Fernando Ramirez. Ali vem o 1º retorno (Km 1,5), depois de uma pequena subida. Desça rápido, mas com passos curtos: logo depois do retorno começa a subida mais dura da prova.",
      "mentalCue": "Passos curtos e rápidos, sem frear com o calcanhar."
    },
    {
      "id": 3,
      "name": "Grande Subida da Rio Grande do Sul e da Rua Paraná",
      "shortName": "Seg 3 · Grande Subida",
      "type": "climb",
      "badge": "Subida Forte",
      "color": "#ef4444",
      "startOrigIdx": 24,
      "endOrigIdx": 36,
      "tacticalTitle": "Sobe 34m em 730m: o trecho que decide a prova",
      "tacticalTip": "Na volta do retorno, a Rua Rio Grande do Sul tem a rampa mais íngreme da prova: cerca de 9% perto do Km 1,8. Depois de um respiro curto, a subida continua pela Rua Paraná (média de quase 5%) até o Km 2,3. Segure o esforço, não o pace: perder segundos aqui é normal e já está no plano. Quem desceu forte demais no Seg 2 sente aqui.",
      "mentalCue": "Braços ativos e passada curta: um quarteirão de cada vez."
    },
    {
      "id": 4,
      "name": "Av. Rondônia e Passagem pela Largada",
      "shortName": "Seg 4 · Av. Rondônia",
      "type": "rolling",
      "badge": "Quase Plano",
      "color": "#3b82f6",
      "startOrigIdx": 36,
      "endOrigIdx": 53,
      "tacticalTitle": "1,2 km quase plano para voltar ao ritmo",
      "tacticalTip": "O fim da Rua Paraná já é plano: use esses primeiros 200m para soltar as pernas depois da Grande Subida. No Km 2,6 você chega à Av. Rondônia com uma curva bem fechada, quase um retorno, e segue pela avenida passando em frente à largada (perto do Km 2,9). A metade da prova (Km 2,5) fica neste trecho. A avenida desce de leve até o Km 3,0 e depois sobe de leve (cerca de 1,5%) até a curva do Km 3,5: aqui o pace fica um pouco mais rápido que a média, porque a média da prova inclui as subidas. Acelere de forma controlada, sem se empolgar com o público na largada: ainda falta a subida ao topo.",
      "mentalCue": "Respire fundo e reencaixe a passada."
    },
    {
      "id": 5,
      "name": "Subida da Rua Lidia Genaro Gonçalves",
      "shortName": "Seg 5 · Subida ao Topo",
      "type": "uphill",
      "badge": "Subida com Rampa",
      "color": "#f59e0b",
      "startOrigIdx": 53,
      "endOrigIdx": 61,
      "tacticalTitle": "Sobe 10m em 420m até o ponto mais alto e o 2º retorno",
      "tacticalTip": "No Km 3,5 uma curva fechada leva da Av. Rondônia para a Rua Lidia Genaro Gonçalves, e logo depois vem uma rampa curta e forte (cerca de 8% em 100m). Depois dela a rua fica quase plana e sobe de leve até o ponto mais alto da prova (462m, Km 3,8). O 2º e último retorno fica logo depois do topo (Km 3,9). Encurte a passada na rampa e não tente recuperar agora os segundos perdidos.",
      "mentalCue": "Rampa curta: segure só até o topo."
    },
    {
      "id": 6,
      "name": "Descida Final pela Av. Rondônia",
      "shortName": "Seg 6 · Descida Final",
      "type": "downhill",
      "badge": "Descida Favorável",
      "color": "#10b981",
      "startOrigIdx": 61,
      "endOrigIdx": 77,
      "tacticalTitle": "-13m em 1,1 km até a chegada",
      "tacticalTip": "Logo depois do retorno você passa de novo pelo topo (Km 4,0) e a Rua Lidia Genaro Gonçalves fica plana por 200m. Perto do Km 4,3 ela desce forte (cerca de 6%) até a curva fechada que devolve você à Av. Rondônia. Dali faltam 650m, sempre descendo de leve, até a chegada em frente ao Supermercado Rede Mais. É o trecho para acelerar e recuperar os segundos investidos nas subidas: solte tudo no último quilômetro.",
      "mentalCue": "Incline levemente o corpo à frente e deixe a passada abrir."
    }
  ],
  cleanTrack: [{"origIdx":0,"idx":0,"lat":-20.85077,"lon":-50.09657,"ele":447.92,"dist":0,"stepDist":0,"de":0,"grade":0},{"origIdx":1,"idx":1,"lat":-20.85096,"lon":-50.095925,"ele":447.27,"dist":70.3,"stepDist":70.3,"de":-0.65,"grade":-0.92},{"origIdx":2,"idx":2,"lat":-20.85115,"lon":-50.09528,"ele":448.27,"dist":140.5,"stepDist":70.3,"de":1,"grade":1.42},{"origIdx":3,"idx":3,"lat":-20.85138,"lon":-50.09481,"ele":450.74,"dist":195.7,"stepDist":55.1,"de":2.47,"grade":4.48},{"origIdx":4,"idx":4,"lat":-20.850815,"lon":-50.09414,"ele":449.65,"dist":289.5,"stepDist":93.8,"de":-1.09,"grade":-1.16},{"origIdx":5,"idx":5,"lat":-20.85025,"lon":-50.09347,"ele":453.35,"dist":383.2,"stepDist":93.8,"de":3.7,"grade":3.95},{"origIdx":6,"idx":6,"lat":-20.85087,"lon":-50.092845,"ele":455.91,"dist":477.9,"stepDist":94.7,"de":2.56,"grade":2.7},{"origIdx":7,"idx":7,"lat":-20.85149,"lon":-50.09222,"ele":456.65,"dist":572.7,"stepDist":94.7,"de":0.74,"grade":0.79},{"origIdx":8,"idx":8,"lat":-20.8515,"lon":-50.09221,"ele":456.66,"dist":574.2,"stepDist":1.5,"de":0,"grade":0.01},{"origIdx":9,"idx":9,"lat":-20.85091,"lon":-50.09154,"ele":458.9,"dist":669.8,"stepDist":95.7,"de":2.24,"grade":2.35},{"origIdx":10,"idx":10,"lat":-20.851536,"lon":-50.090914,"ele":457.98,"dist":765.1,"stepDist":95.3,"de":-0.92,"grade":-0.97},{"origIdx":11,"idx":11,"lat":-20.852162,"lon":-50.090288,"ele":451.96,"dist":860.4,"stepDist":95.3,"de":-6.02,"grade":-6.32},{"origIdx":12,"idx":12,"lat":-20.852788,"lon":-50.089662,"ele":445.99,"dist":955.7,"stepDist":95.3,"de":-5.97,"grade":-6.27},{"origIdx":13,"idx":13,"lat":-20.853414,"lon":-50.089036,"ele":441.02,"dist":1050.9,"stepDist":95.3,"de":-4.97,"grade":-5.22},{"origIdx":14,"idx":14,"lat":-20.85404,"lon":-50.08841,"ele":433,"dist":1146.2,"stepDist":95.3,"de":-8.02,"grade":-8.42},{"origIdx":15,"idx":15,"lat":-20.8546,"lon":-50.0891,"ele":429.82,"dist":1241.2,"stepDist":95,"de":-3.18,"grade":-3.34},{"origIdx":16,"idx":16,"lat":-20.85472,"lon":-50.08894,"ele":428.31,"dist":1262.5,"stepDist":21.3,"de":-1.51,"grade":-7.09},{"origIdx":17,"idx":17,"lat":-20.85481,"lon":-50.08879,"ele":426.82,"dist":1281,"stepDist":18.5,"de":-1.49,"grade":-8.04},{"origIdx":18,"idx":18,"lat":-20.85496,"lon":-50.0885,"ele":424.17,"dist":1315.4,"stepDist":34.4,"de":-2.66,"grade":-7.71},{"origIdx":19,"idx":19,"lat":-20.855155,"lon":-50.087975,"ele":421.92,"dist":1374.2,"stepDist":58.7,"de":-2.25,"grade":-3.83},{"origIdx":20,"idx":20,"lat":-20.85535,"lon":-50.08745,"ele":421.73,"dist":1432.9,"stepDist":58.7,"de":-0.19,"grade":-0.32},{"origIdx":21,"idx":21,"lat":-20.85561,"lon":-50.08666,"ele":424.85,"dist":1519.9,"stepDist":87,"de":3.12,"grade":3.58},{"origIdx":22,"idx":22,"lat":-20.85567,"lon":-50.08632,"ele":426.78,"dist":1555.8,"stepDist":36,"de":1.93,"grade":5.37},{"origIdx":23,"idx":23,"lat":-20.85561,"lon":-50.08666,"ele":424.85,"dist":1591.8,"stepDist":36,"de":-1.93,"grade":-5.37},{"origIdx":24,"idx":24,"lat":-20.85535,"lon":-50.08745,"ele":421.73,"dist":1678.8,"stepDist":87,"de":-3.12,"grade":-3.58},{"origIdx":25,"idx":25,"lat":-20.855155,"lon":-50.087975,"ele":421.92,"dist":1737.5,"stepDist":58.7,"de":0.19,"grade":0.32},{"origIdx":26,"idx":26,"lat":-20.85496,"lon":-50.0885,"ele":424.16,"dist":1796.2,"stepDist":58.7,"de":2.24,"grade":3.82},{"origIdx":27,"idx":27,"lat":-20.85481,"lon":-50.08879,"ele":426.83,"dist":1830.7,"stepDist":34.4,"de":2.67,"grade":7.74},{"origIdx":28,"idx":28,"lat":-20.85472,"lon":-50.08894,"ele":428.31,"dist":1849.2,"stepDist":18.5,"de":1.48,"grade":8.02},{"origIdx":29,"idx":29,"lat":-20.8546,"lon":-50.0891,"ele":429.82,"dist":1870.5,"stepDist":21.3,"de":1.51,"grade":7.09},{"origIdx":30,"idx":30,"lat":-20.855175,"lon":-50.08977,"ele":439.02,"dist":1965,"stepDist":94.5,"de":9.2,"grade":9.73},{"origIdx":31,"idx":31,"lat":-20.85575,"lon":-50.09044,"ele":435.04,"dist":2059.6,"stepDist":94.5,"de":-3.98,"grade":-4.21},{"origIdx":32,"idx":32,"lat":-20.85575,"lon":-50.09047,"ele":435.04,"dist":2062.7,"stepDist":3.1,"de":0,"grade":0},{"origIdx":33,"idx":33,"lat":-20.85513,"lon":-50.091084,"ele":439.02,"dist":2156.6,"stepDist":93.9,"de":3.98,"grade":4.24},{"origIdx":34,"idx":34,"lat":-20.85451,"lon":-50.091698,"ele":445.03,"dist":2250.5,"stepDist":93.9,"de":6.01,"grade":6.4},{"origIdx":35,"idx":35,"lat":-20.85389,"lon":-50.092312,"ele":450.06,"dist":2344.5,"stepDist":93.9,"de":5.03,"grade":5.35},{"origIdx":36,"idx":36,"lat":-20.85327,"lon":-50.092926,"ele":451.92,"dist":2438.4,"stepDist":93.9,"de":1.86,"grade":1.98},{"origIdx":37,"idx":37,"lat":-20.85265,"lon":-50.09354,"ele":450.99,"dist":2532.3,"stepDist":93.9,"de":-0.93,"grade":-0.99},{"origIdx":38,"idx":38,"lat":-20.852,"lon":-50.09416,"ele":449.96,"dist":2629.2,"stepDist":96.8,"de":-1.03,"grade":-1.06},{"origIdx":39,"idx":39,"lat":-20.85172,"lon":-50.09447,"ele":450.07,"dist":2674,"stepDist":44.8,"de":0.11,"grade":0.25},{"origIdx":40,"idx":40,"lat":-20.85138,"lon":-50.09481,"ele":449.85,"dist":2725.7,"stepDist":51.7,"de":-0.22,"grade":-0.42},{"origIdx":41,"idx":41,"lat":-20.85127,"lon":-50.09467,"ele":449.24,"dist":2744.7,"stepDist":19,"de":-0.61,"grade":-3.21},{"origIdx":42,"idx":42,"lat":-20.85127,"lon":-50.09466,"ele":449.22,"dist":2745.8,"stepDist":1,"de":-0.02,"grade":-1.91},{"origIdx":43,"idx":43,"lat":-20.851115,"lon":-50.09517,"ele":448.33,"dist":2801.5,"stepDist":55.7,"de":-0.89,"grade":-1.6},{"origIdx":44,"idx":44,"lat":-20.85096,"lon":-50.09568,"ele":448.34,"dist":2857.2,"stepDist":55.7,"de":0.01,"grade":0.02},{"origIdx":45,"idx":45,"lat":-20.850714,"lon":-50.096464,"ele":448.13,"dist":2943.2,"stepDist":85.9,"de":-0.21,"grade":-0.24},{"origIdx":46,"idx":46,"lat":-20.850468,"lon":-50.097248,"ele":447.58,"dist":3029.1,"stepDist":85.9,"de":-0.55,"grade":-0.64},{"origIdx":47,"idx":47,"lat":-20.850222,"lon":-50.098032,"ele":447.08,"dist":3115,"stepDist":85.9,"de":-0.5,"grade":-0.58},{"origIdx":48,"idx":48,"lat":-20.849976,"lon":-50.098816,"ele":447.64,"dist":3201,"stepDist":85.9,"de":0.56,"grade":0.65},{"origIdx":49,"idx":49,"lat":-20.84973,"lon":-50.0996,"ele":448.46,"dist":3286.9,"stepDist":85.9,"de":0.82,"grade":0.95},{"origIdx":50,"idx":50,"lat":-20.849485,"lon":-50.10044,"ele":449.93,"dist":3378.3,"stepDist":91.4,"de":1.47,"grade":1.61},{"origIdx":51,"idx":51,"lat":-20.84924,"lon":-50.10128,"ele":451.36,"dist":3469.8,"stepDist":91.4,"de":1.43,"grade":1.56},{"origIdx":52,"idx":52,"lat":-20.848995,"lon":-50.10212,"ele":452.51,"dist":3561.2,"stepDist":91.4,"de":1.15,"grade":1.26},{"origIdx":53,"idx":53,"lat":-20.84875,"lon":-50.10296,"ele":452.3,"dist":3652.7,"stepDist":91.4,"de":-0.21,"grade":-0.23},{"origIdx":54,"idx":54,"lat":-20.849155,"lon":-50.102725,"ele":456.54,"dist":3703.9,"stepDist":51.2,"de":4.24,"grade":8.28},{"origIdx":55,"idx":55,"lat":-20.84956,"lon":-50.10249,"ele":459.98,"dist":3755.1,"stepDist":51.2,"de":3.44,"grade":6.71},{"origIdx":56,"idx":56,"lat":-20.85022,"lon":-50.10209,"ele":460,"dist":3839.5,"stepDist":84.3,"de":0.02,"grade":0.02},{"origIdx":57,"idx":57,"lat":-20.85054,"lon":-50.10193,"ele":460.39,"dist":3878.7,"stepDist":39.3,"de":0.39,"grade":0.98},{"origIdx":58,"idx":58,"lat":-20.85068,"lon":-50.10182,"ele":460.61,"dist":3898,"stepDist":19.3,"de":0.23,"grade":1.18},{"origIdx":59,"idx":59,"lat":-20.851315,"lon":-50.101435,"ele":461.97,"dist":3979.2,"stepDist":81.2,"de":1.36,"grade":1.67},{"origIdx":60,"idx":60,"lat":-20.85195,"lon":-50.10105,"ele":461.55,"dist":4060.4,"stepDist":81.2,"de":-0.42,"grade":-0.52},{"origIdx":61,"idx":61,"lat":-20.8522,"lon":-50.10114,"ele":461.04,"dist":4089.7,"stepDist":29.3,"de":-0.51,"grade":-1.72},{"origIdx":62,"idx":62,"lat":-20.85221,"lon":-50.10114,"ele":461.04,"dist":4090.8,"stepDist":1.1,"de":0,"grade":0},{"origIdx":63,"idx":63,"lat":-20.85195,"lon":-50.10105,"ele":461.58,"dist":4121.2,"stepDist":30.4,"de":0.53,"grade":1.76},{"origIdx":64,"idx":64,"lat":-20.851315,"lon":-50.101435,"ele":461.97,"dist":4202.3,"stepDist":81.2,"de":0.39,"grade":0.48},{"origIdx":65,"idx":65,"lat":-20.85068,"lon":-50.10182,"ele":460.61,"dist":4283.5,"stepDist":81.2,"de":-1.36,"grade":-1.67},{"origIdx":66,"idx":66,"lat":-20.85054,"lon":-50.10193,"ele":460.39,"dist":4302.8,"stepDist":19.3,"de":-0.23,"grade":-1.18},{"origIdx":67,"idx":67,"lat":-20.85022,"lon":-50.10209,"ele":460,"dist":4342.1,"stepDist":39.3,"de":-0.39,"grade":-0.98},{"origIdx":68,"idx":68,"lat":-20.84956,"lon":-50.10249,"ele":459.98,"dist":4426.4,"stepDist":84.3,"de":-0.02,"grade":-0.02},{"origIdx":69,"idx":69,"lat":-20.84883,"lon":-50.10291,"ele":454.84,"dist":4518.6,"stepDist":92.2,"de":-5.14,"grade":-5.58},{"origIdx":70,"idx":70,"lat":-20.849078,"lon":-50.102073,"ele":454.86,"dist":4609.9,"stepDist":91.3,"de":0.02,"grade":0.02},{"origIdx":71,"idx":71,"lat":-20.849325,"lon":-50.101235,"ele":453.84,"dist":4701.1,"stepDist":91.3,"de":-1.02,"grade":-1.12},{"origIdx":72,"idx":72,"lat":-20.849573,"lon":-50.100398,"ele":452.24,"dist":4792.4,"stepDist":91.3,"de":-1.6,"grade":-1.75},{"origIdx":73,"idx":73,"lat":-20.84982,"lon":-50.09956,"ele":451.97,"dist":4883.7,"stepDist":91.3,"de":-0.27,"grade":-0.3},{"origIdx":74,"idx":74,"lat":-20.850055,"lon":-50.098815,"ele":450.49,"dist":4965.4,"stepDist":81.7,"de":-1.48,"grade":-1.81},{"origIdx":75,"idx":75,"lat":-20.85029,"lon":-50.09807,"ele":449.18,"dist":5047.1,"stepDist":81.7,"de":-1.31,"grade":-1.6},{"origIdx":76,"idx":76,"lat":-20.850525,"lon":-50.097325,"ele":448.46,"dist":5128.8,"stepDist":81.7,"de":-0.72,"grade":-0.88},{"origIdx":77,"idx":77,"lat":-20.85076,"lon":-50.09658,"ele":447.93,"dist":5210.5,"stepDist":81.7,"de":-0.53,"grade":-0.65}],
  rawTrack: [{"origIdx":0,"idx":0,"lat":-20.85077,"lon":-50.09657,"ele":447.92,"dist":0,"stepDist":0,"de":0,"grade":0},{"origIdx":1,"idx":1,"lat":-20.85096,"lon":-50.095925,"ele":447.27,"dist":70.3,"stepDist":70.3,"de":-0.65,"grade":-0.92},{"origIdx":2,"idx":2,"lat":-20.85115,"lon":-50.09528,"ele":448.27,"dist":140.5,"stepDist":70.3,"de":1,"grade":1.42},{"origIdx":3,"idx":3,"lat":-20.85138,"lon":-50.09481,"ele":450.74,"dist":195.7,"stepDist":55.1,"de":2.47,"grade":4.48},{"origIdx":4,"idx":4,"lat":-20.850815,"lon":-50.09414,"ele":449.65,"dist":289.5,"stepDist":93.8,"de":-1.09,"grade":-1.16},{"origIdx":5,"idx":5,"lat":-20.85025,"lon":-50.09347,"ele":453.35,"dist":383.2,"stepDist":93.8,"de":3.7,"grade":3.95},{"origIdx":6,"idx":6,"lat":-20.85087,"lon":-50.092845,"ele":455.91,"dist":477.9,"stepDist":94.7,"de":2.56,"grade":2.7},{"origIdx":7,"idx":7,"lat":-20.85149,"lon":-50.09222,"ele":456.65,"dist":572.7,"stepDist":94.7,"de":0.74,"grade":0.78},{"origIdx":8,"idx":8,"lat":-20.8515,"lon":-50.09221,"ele":456.66,"dist":574.2,"stepDist":1.5,"de":0.01,"grade":0.66},{"origIdx":9,"idx":9,"lat":-20.85091,"lon":-50.09154,"ele":458.9,"dist":669.8,"stepDist":95.7,"de":2.24,"grade":2.34},{"origIdx":10,"idx":10,"lat":-20.851536,"lon":-50.090914,"ele":457.98,"dist":765.1,"stepDist":95.3,"de":-0.92,"grade":-0.97},{"origIdx":11,"idx":11,"lat":-20.852162,"lon":-50.090288,"ele":451.96,"dist":860.4,"stepDist":95.3,"de":-6.02,"grade":-6.32},{"origIdx":12,"idx":12,"lat":-20.852788,"lon":-50.089662,"ele":445.99,"dist":955.7,"stepDist":95.3,"de":-5.97,"grade":-6.27},{"origIdx":13,"idx":13,"lat":-20.853414,"lon":-50.089036,"ele":441.02,"dist":1050.9,"stepDist":95.3,"de":-4.97,"grade":-5.22},{"origIdx":14,"idx":14,"lat":-20.85404,"lon":-50.08841,"ele":433,"dist":1146.2,"stepDist":95.3,"de":-8.02,"grade":-8.42},{"origIdx":15,"idx":15,"lat":-20.8546,"lon":-50.0891,"ele":430.34,"dist":1241.2,"stepDist":95,"de":-2.66,"grade":-2.8},{"origIdx":16,"idx":16,"lat":-20.85472,"lon":-50.08894,"ele":428.56,"dist":1262.5,"stepDist":21.3,"de":-1.78,"grade":-8.35},{"origIdx":17,"idx":17,"lat":-20.85481,"lon":-50.08879,"ele":426.1,"dist":1281,"stepDist":18.5,"de":-2.46,"grade":-13.28},{"origIdx":18,"idx":18,"lat":-20.85496,"lon":-50.0885,"ele":424.08,"dist":1315.4,"stepDist":34.4,"de":-2.02,"grade":-5.86},{"origIdx":19,"idx":19,"lat":-20.855155,"lon":-50.087975,"ele":421.92,"dist":1374.2,"stepDist":58.7,"de":-2.16,"grade":-3.68},{"origIdx":20,"idx":20,"lat":-20.85535,"lon":-50.08745,"ele":421.73,"dist":1432.9,"stepDist":58.7,"de":-0.19,"grade":-0.32},{"origIdx":21,"idx":21,"lat":-20.85561,"lon":-50.08666,"ele":424.85,"dist":1519.9,"stepDist":87,"de":3.12,"grade":3.58},{"origIdx":22,"idx":22,"lat":-20.85567,"lon":-50.08632,"ele":426.78,"dist":1555.8,"stepDist":36,"de":1.93,"grade":5.37},{"origIdx":23,"idx":23,"lat":-20.85561,"lon":-50.08666,"ele":424.85,"dist":1591.8,"stepDist":36,"de":-1.93,"grade":-5.37},{"origIdx":24,"idx":24,"lat":-20.85535,"lon":-50.08745,"ele":421.73,"dist":1678.8,"stepDist":87,"de":-3.12,"grade":-3.58},{"origIdx":25,"idx":25,"lat":-20.855155,"lon":-50.087975,"ele":421.92,"dist":1737.5,"stepDist":58.7,"de":0.19,"grade":0.32},{"origIdx":26,"idx":26,"lat":-20.85496,"lon":-50.0885,"ele":424.08,"dist":1796.2,"stepDist":58.7,"de":2.16,"grade":3.68},{"origIdx":27,"idx":27,"lat":-20.85481,"lon":-50.08879,"ele":426.1,"dist":1830.7,"stepDist":34.4,"de":2.02,"grade":5.86},{"origIdx":28,"idx":28,"lat":-20.85472,"lon":-50.08894,"ele":428.56,"dist":1849.2,"stepDist":18.5,"de":2.46,"grade":13.28},{"origIdx":29,"idx":29,"lat":-20.8546,"lon":-50.0891,"ele":430.34,"dist":1870.5,"stepDist":21.3,"de":1.78,"grade":8.35},{"origIdx":30,"idx":30,"lat":-20.855175,"lon":-50.08977,"ele":439.02,"dist":1965,"stepDist":94.5,"de":8.68,"grade":9.18},{"origIdx":31,"idx":31,"lat":-20.85575,"lon":-50.09044,"ele":435.04,"dist":2059.6,"stepDist":94.5,"de":-3.98,"grade":-4.21},{"origIdx":32,"idx":32,"lat":-20.85575,"lon":-50.09047,"ele":435.04,"dist":2062.7,"stepDist":3.1,"de":0,"grade":0},{"origIdx":33,"idx":33,"lat":-20.85513,"lon":-50.091084,"ele":439.02,"dist":2156.6,"stepDist":93.9,"de":3.98,"grade":4.24},{"origIdx":34,"idx":34,"lat":-20.85451,"lon":-50.091698,"ele":445.03,"dist":2250.5,"stepDist":93.9,"de":6.01,"grade":6.4},{"origIdx":35,"idx":35,"lat":-20.85389,"lon":-50.092312,"ele":450.06,"dist":2344.5,"stepDist":93.9,"de":5.03,"grade":5.35},{"origIdx":36,"idx":36,"lat":-20.85327,"lon":-50.092926,"ele":451.92,"dist":2438.4,"stepDist":93.9,"de":1.86,"grade":1.98},{"origIdx":37,"idx":37,"lat":-20.85265,"lon":-50.09354,"ele":450.99,"dist":2532.3,"stepDist":93.9,"de":-0.93,"grade":-0.99},{"origIdx":38,"idx":38,"lat":-20.852,"lon":-50.09416,"ele":449.96,"dist":2629.2,"stepDist":96.8,"de":-1.03,"grade":-1.06},{"origIdx":39,"idx":39,"lat":-20.85172,"lon":-50.09447,"ele":450.07,"dist":2674,"stepDist":44.8,"de":0.11,"grade":0.25},{"origIdx":40,"idx":40,"lat":-20.85138,"lon":-50.09481,"ele":450.74,"dist":2725.7,"stepDist":51.7,"de":0.67,"grade":1.29},{"origIdx":41,"idx":41,"lat":-20.85127,"lon":-50.09467,"ele":448.92,"dist":2744.7,"stepDist":19,"de":-1.82,"grade":-9.58},{"origIdx":42,"idx":42,"lat":-20.85127,"lon":-50.09466,"ele":448.85,"dist":2745.8,"stepDist":1,"de":-0.07,"grade":-6.74},{"origIdx":43,"idx":43,"lat":-20.851115,"lon":-50.09517,"ele":448.33,"dist":2801.5,"stepDist":55.7,"de":-0.52,"grade":-0.93},{"origIdx":44,"idx":44,"lat":-20.85096,"lon":-50.09568,"ele":448.34,"dist":2857.2,"stepDist":55.7,"de":0.01,"grade":0.02},{"origIdx":45,"idx":45,"lat":-20.850714,"lon":-50.096464,"ele":448.13,"dist":2943.2,"stepDist":85.9,"de":-0.21,"grade":-0.24},{"origIdx":46,"idx":46,"lat":-20.850468,"lon":-50.097248,"ele":447.58,"dist":3029.1,"stepDist":85.9,"de":-0.55,"grade":-0.64},{"origIdx":47,"idx":47,"lat":-20.850222,"lon":-50.098032,"ele":447.08,"dist":3115,"stepDist":85.9,"de":-0.5,"grade":-0.58},{"origIdx":48,"idx":48,"lat":-20.849976,"lon":-50.098816,"ele":447.64,"dist":3201,"stepDist":85.9,"de":0.56,"grade":0.65},{"origIdx":49,"idx":49,"lat":-20.84973,"lon":-50.0996,"ele":448.46,"dist":3286.9,"stepDist":85.9,"de":0.82,"grade":0.95},{"origIdx":50,"idx":50,"lat":-20.849485,"lon":-50.10044,"ele":449.93,"dist":3378.3,"stepDist":91.4,"de":1.47,"grade":1.61},{"origIdx":51,"idx":51,"lat":-20.84924,"lon":-50.10128,"ele":451.36,"dist":3469.8,"stepDist":91.4,"de":1.43,"grade":1.56},{"origIdx":52,"idx":52,"lat":-20.848995,"lon":-50.10212,"ele":452.51,"dist":3561.2,"stepDist":91.4,"de":1.15,"grade":1.26},{"origIdx":53,"idx":53,"lat":-20.84875,"lon":-50.10296,"ele":452.3,"dist":3652.7,"stepDist":91.4,"de":-0.21,"grade":-0.23},{"origIdx":54,"idx":54,"lat":-20.849155,"lon":-50.102725,"ele":456.54,"dist":3703.9,"stepDist":51.2,"de":4.24,"grade":8.28},{"origIdx":55,"idx":55,"lat":-20.84956,"lon":-50.10249,"ele":459.98,"dist":3755.1,"stepDist":51.2,"de":3.44,"grade":6.71},{"origIdx":56,"idx":56,"lat":-20.85022,"lon":-50.10209,"ele":460,"dist":3839.5,"stepDist":84.3,"de":0.02,"grade":0.02},{"origIdx":57,"idx":57,"lat":-20.85054,"lon":-50.10193,"ele":460.19,"dist":3878.7,"stepDist":39.3,"de":0.19,"grade":0.48},{"origIdx":58,"idx":58,"lat":-20.85068,"lon":-50.10182,"ele":460.81,"dist":3898,"stepDist":19.3,"de":0.62,"grade":3.21},{"origIdx":59,"idx":59,"lat":-20.851315,"lon":-50.101435,"ele":461.97,"dist":3979.2,"stepDist":81.2,"de":1.16,"grade":1.43},{"origIdx":60,"idx":60,"lat":-20.85195,"lon":-50.10105,"ele":461.76,"dist":4060.4,"stepDist":81.2,"de":-0.21,"grade":-0.26},{"origIdx":61,"idx":61,"lat":-20.8522,"lon":-50.10114,"ele":460.93,"dist":4089.7,"stepDist":29.3,"de":-0.83,"grade":-2.83},{"origIdx":62,"idx":62,"lat":-20.85221,"lon":-50.10114,"ele":460.93,"dist":4090.8,"stepDist":1.1,"de":0,"grade":0},{"origIdx":63,"idx":63,"lat":-20.85195,"lon":-50.10105,"ele":461.76,"dist":4121.2,"stepDist":30.4,"de":0.83,"grade":2.73},{"origIdx":64,"idx":64,"lat":-20.851315,"lon":-50.101435,"ele":461.97,"dist":4202.3,"stepDist":81.2,"de":0.21,"grade":0.26},{"origIdx":65,"idx":65,"lat":-20.85068,"lon":-50.10182,"ele":460.81,"dist":4283.5,"stepDist":81.2,"de":-1.16,"grade":-1.43},{"origIdx":66,"idx":66,"lat":-20.85054,"lon":-50.10193,"ele":460.19,"dist":4302.8,"stepDist":19.3,"de":-0.62,"grade":-3.21},{"origIdx":67,"idx":67,"lat":-20.85022,"lon":-50.10209,"ele":460,"dist":4342.1,"stepDist":39.3,"de":-0.19,"grade":-0.48},{"origIdx":68,"idx":68,"lat":-20.84956,"lon":-50.10249,"ele":459.98,"dist":4426.4,"stepDist":84.3,"de":-0.02,"grade":-0.02},{"origIdx":69,"idx":69,"lat":-20.84883,"lon":-50.10291,"ele":454.84,"dist":4518.6,"stepDist":92.2,"de":-5.14,"grade":-5.58},{"origIdx":70,"idx":70,"lat":-20.849078,"lon":-50.102073,"ele":454.86,"dist":4609.9,"stepDist":91.3,"de":0.02,"grade":0.02},{"origIdx":71,"idx":71,"lat":-20.849325,"lon":-50.101235,"ele":453.84,"dist":4701.1,"stepDist":91.3,"de":-1.02,"grade":-1.12},{"origIdx":72,"idx":72,"lat":-20.849573,"lon":-50.100398,"ele":452.24,"dist":4792.4,"stepDist":91.3,"de":-1.6,"grade":-1.75},{"origIdx":73,"idx":73,"lat":-20.84982,"lon":-50.09956,"ele":451.97,"dist":4883.7,"stepDist":91.3,"de":-0.27,"grade":-0.3},{"origIdx":74,"idx":74,"lat":-20.850055,"lon":-50.098815,"ele":450.49,"dist":4965.4,"stepDist":81.7,"de":-1.48,"grade":-1.81},{"origIdx":75,"idx":75,"lat":-20.85029,"lon":-50.09807,"ele":449.18,"dist":5047.1,"stepDist":81.7,"de":-1.31,"grade":-1.6},{"origIdx":76,"idx":76,"lat":-20.850525,"lon":-50.097325,"ele":448.46,"dist":5128.8,"stepDist":81.7,"de":-0.72,"grade":-0.88},{"origIdx":77,"idx":77,"lat":-20.85076,"lon":-50.09658,"ele":447.93,"dist":5210.5,"stepDist":81.7,"de":-0.53,"grade":-0.65}]
};
