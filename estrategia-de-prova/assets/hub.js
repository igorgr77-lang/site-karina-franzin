/**
 * Página raiz da Estratégia de Prova: depois da data de cada corrida (time[datetime] do card),
 * o card ganha o selo "Prova realizada" e vai para depois das provas que ainda vão acontecer.
 * Para testar antes da data: adicione ?simular=pos-prova ao endereço.
 */
(function () {
  "use strict";
  function todayIso() {
    if (new URLSearchParams(location.search).get("simular") === "pos-prova") return "9999-12-31";
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function init() {
    var grid = document.querySelector(".hub-grid");
    if (!grid) return;
    var today = todayIso();
    var soon = grid.querySelector(".hub-card-soon");
    var past = [];

    grid.querySelectorAll("a.hub-card").forEach(function (card) {
      var time = card.querySelector("time[datetime]");
      if (!time || time.getAttribute("datetime") >= today) return;
      card.classList.add("is-past");
      var meta = card.querySelector(".hub-card-meta");
      if (meta && !meta.querySelector(".hub-card-status")) {
        var status = document.createElement("span");
        status.className = "hub-card-status";
        status.textContent = "Prova realizada";
        meta.appendChild(status);
      }
      var btn = card.querySelector(".hub-card-btn");
      if (btn) btn.textContent = "Ver o percurso →";
      past.push(card);
    });

    // Provas que ainda vão acontecer primeiro; realizadas depois (antes do card "em breve")
    past.forEach(function (card) { grid.insertBefore(card, soon || null); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
