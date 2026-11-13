(() => {
  const buttons = [...document.querySelectorAll("[data-preview-target]")];
  const panels = [...document.querySelectorAll("[data-preview-panel]")];
  const title = document.querySelector("#previewTitle");
  const eyebrow = document.querySelector("#previewEyebrow");

  function activatePreview(target, updateHash = true) {
    const button = buttons.find((item) => item.dataset.previewTarget === target) || buttons[0];
    if (!button) return;

    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-current", active ? "page" : "false");
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.previewPanel !== button.dataset.previewTarget;
    });

    title.textContent = button.dataset.previewTitle || "";
    eyebrow.textContent = button.dataset.previewEyebrow || "";
    document.documentElement.dataset.previewModule = button.dataset.previewTarget;

    if (updateHash) {
      history.replaceState(null, "", `#${button.dataset.previewTarget}`);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => activatePreview(button.dataset.previewTarget));
  });

  const requested = window.location.hash.replace(/^#/, "");
  activatePreview(requested, false);
})();
