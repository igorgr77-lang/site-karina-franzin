// Usado pelas páginas antigas em /estrategia-de-prova/: leva para /percursos/ mantendo
// os parâmetros do link (ex.: ?utm_source=instagram) e a âncora. Fica em arquivo próprio
// porque a CSP do site não permite script inline.
(function () {
  var MAPA = {
    "/estrategia-de-prova/2-zrun-fernandopolis/": "/percursos/zrun-night-run-fernandopolis/",
    "/estrategia-de-prova/10k-novo-horizonte/": "/percursos/corrida-passo-a-passo-novo-horizonte/",
    "/estrategia-de-prova/": "/percursos/"
  };
  var p = location.pathname.replace(/index\.html$/, "");
  if (p.charAt(p.length - 1) !== "/") p += "/";
  var destino = MAPA[p] || "/percursos/";
  location.replace(destino + location.search + location.hash);
})();
