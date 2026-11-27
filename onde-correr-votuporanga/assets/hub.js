/**
 * Hub Onde correr em Votuporanga: filtra os cards dos locais pelas etiquetas (data-tags).
 * ?treino=tiro no endereço já abre filtrado (bom para links do Instagram).
 */
(function () {
  "use strict";
  function init() {
    var botoes = document.querySelectorAll(".oc-filtro");
    var cards = document.querySelectorAll(".oc-card");
    var vazio = document.getElementById("ocVazio");
    if (!botoes.length) return;

    function filtrar(tag) {
      var visiveis = 0;
      cards.forEach(function (c) {
        var ok = !tag || (" " + c.getAttribute("data-tags") + " ").indexOf(" " + tag + " ") >= 0;
        c.hidden = !ok;
        if (ok) visiveis++;
      });
      botoes.forEach(function (b) {
        var ativo = b.getAttribute("data-filtro") === tag;
        b.classList.toggle("is-ativo", ativo);
        b.setAttribute("aria-pressed", ativo ? "true" : "false");
      });
      if (vazio) vazio.hidden = visiveis > 0;
    }

    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        var tag = b.getAttribute("data-filtro");
        filtrar(tag);
        if (typeof window.gtag === "function" && tag) window.gtag("event", "onde_correr_filtro", { event_category: "onde_correr_hub", event_label: tag });
      });
    });

    var inicial = new URLSearchParams(location.search).get("treino");
    if (inicial && document.querySelector('.oc-filtro[data-filtro="' + inicial.replace(/[^a-z0-9]/gi, "") + '"]')) filtrar(inicial);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
