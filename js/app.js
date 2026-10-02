
(function () {
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const dialog = document.getElementById("info-dialog");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogText = document.getElementById("dialog-text");
  const dialogClose = document.getElementById("dialog-close");

  function finishSplash() {
    splash.classList.add("hidden");
    app.classList.add("ready");
    app.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      splash.style.display = "none";
    }, 360);
  }

  // Mindestens 2 Sekunden Splash anzeigen.
  window.setTimeout(finishSplash, 2000);

  function switchTab(name) {
    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.toggle("active", screen.id === "view-" + name);
    });

    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === name);
    });
  }

  document.querySelectorAll("[data-tab]").forEach(button => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  function showInfo(title, text) {
    dialogTitle.textContent = title;
    dialogText.textContent = text;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      alert(title + "\\n\\n" + text);
    }
  }

  document.getElementById("new-day-button").addEventListener("click", () => {
    showInfo(
      "Code001",
      "Die Erfassung eines Angeltages ist in Code001 bewusst noch nicht aktiv. Erst nach deiner Freigabe dieser Vorschau gehen wir zu Code002 weiter."
    );
  });

  document.getElementById("new-season-button").addEventListener("click", () => {
    showInfo(
      "Code002 folgt später",
      "Die echte Saisonverwaltung wird erst im nächsten Entwicklungsstand umgesetzt – nachdem du Code001 geprüft und freigegeben hast."
    );
  });

  dialogClose.addEventListener("click", () => dialog.close());
})();
