import { Game } from "./core/Game.js";

const elements = {
  canvas: document.querySelector("#game-canvas"),
  startScreen: document.querySelector("#start-screen"),
  pauseScreen: document.querySelector("#pause-screen"),
  pauseButton: document.querySelector("#pause-button"),
  resumeButton: document.querySelector("#resume-button"),
  restartButton: document.querySelector("#restart-button"),
  modeLabel: document.querySelector("#mode-label"),
  statusLabel: document.querySelector("#status-label")
};

const requiredElements = Object.entries(elements).filter(([, element]) => !element);
if (requiredElements.length) {
  throw new Error(`Space Galactica is missing required page elements: ${requiredElements.map(([name]) => name).join(", ")}`);
}

const game = new Game(elements.canvas, {
  onPauseChange(paused, reason) {
    elements.pauseScreen.hidden = !paused;
    elements.pauseButton.textContent = paused ? "Paused" : "Pause";
    elements.statusLabel.textContent = paused
      ? (reason === "visibility" ? "PAUSED // TAB HIDDEN" : "SYSTEM PAUSED")
      : "PILOT ACTIVE";
  },
  onModeChange(mode) {
    elements.modeLabel.textContent = mode === "space" ? "DEEP SPACE" : "DEEP SEA";
    elements.statusLabel.textContent = "PILOT ACTIVE";
    elements.startScreen.hidden = true;
    elements.pauseButton.hidden = false;
  }
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => game.start(button.dataset.mode));
});

elements.pauseButton.addEventListener("click", () => game.togglePause());
elements.resumeButton.addEventListener("click", () => game.resume());
elements.restartButton.addEventListener("click", () => game.restart());

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.key === "Escape" || event.key.toLowerCase() === "p") {
    if (elements.startScreen.hidden) game.togglePause();
  }
});

window.addEventListener("beforeunload", () => game.destroy(), { once: true });
game.initialize();
