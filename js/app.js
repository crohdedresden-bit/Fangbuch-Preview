\
(() => {
  const splash = document.getElementById("splash");
  const application = document.getElementById("application");

  // Gemäß UI-Spezifikation bleibt Code001 mindestens 2 Sekunden sichtbar.
  window.setTimeout(() => {
    splash.classList.add("hidden");
    application.classList.add("ready");
    application.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      splash.style.display = "none";
    }, 380);
  }, 2000);

  const views = {
    days: document.getElementById("view-days"),
    report: document.getElementById("view-report"),
    season: document.getElementById("view-season")
  };

  function switchTab(name) {
    Object.entries(views).forEach(([key, view]) => {
      view.classList.toggle("active", key === name);
    });

    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === name);
    });
  }

  document.querySelectorAll("[data-tab]").forEach(button => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  const dialog = document.getElementById("info-dialog");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogText = document.getElementById("dialog-text");
  const dialogClose = document.getElementById("dialog-close");

  function showInfo(title, text) {
    dialogTitle.textContent = title;
    dialogText.textContent = text;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      alert(`${title}\n\n${text}`);
    }
  }

  document.getElementById("new-day-button").addEventListener("click", () => {
    showInfo(
      "Code001",
      "Die Erfassung eines Angeltages ist in Code001 bewusst noch nicht aktiv. Zuerst wird in Code002 die Saison- und Datenbasis aufgebaut."
    );
  });

  document.getElementById("new-season-button").addEventListener("click", () => {
    showInfo(
      "Nächster Entwicklungsschritt",
      "Die echte Saisonverwaltung wird in Code002 umgesetzt – erst nachdem du diese Code001-Vorschau geprüft und freigegeben hast."
    );
  });

  dialogClose.addEventListener("click", () => dialog.close());
})();
