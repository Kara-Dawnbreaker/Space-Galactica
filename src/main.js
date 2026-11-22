import { Game } from "./core/Game.js";

const elements = {
  canvas: document.querySelector("#game-canvas"),
  startScreen: document.querySelector("#start-screen"),
  pauseScreen: document.querySelector("#pause-screen"),
  gameOverScreen: document.querySelector("#game-over-screen"),
  pauseButton: document.querySelector("#pause-button"),
  soundButton: document.querySelector("#sound-button"),
  abilityButton: document.querySelector("#ability-button"),
  weaponValue: document.querySelector("#weapon-value"),
  creditValue: document.querySelector("#credit-value"),
  abilityStatus: document.querySelector("#ability-status"),
  resumeButton: document.querySelector("#resume-button"),
  restartButton: document.querySelector("#restart-button"),
  gameOverRestartButton: document.querySelector("#game-over-restart-button"),
  modeLabel: document.querySelector("#mode-label"),
  statusLabel: document.querySelector("#status-label"),
  scoreValue: document.querySelector("#score-value"),
  waveValue: document.querySelector("#wave-value"),
  healthValue: document.querySelector("#health-value"),
  shieldValue: document.querySelector("#shield-value"),
  livesValue: document.querySelector("#lives-value"),
  healthFill: document.querySelector("#health-fill"),
  shieldFill: document.querySelector("#shield-fill"),
  finalScore: document.querySelector("#final-score")
};

const missing = Object.entries(elements).filter(([, element]) => !element);
if (missing.length) throw new Error(`Space Galactica is missing required page elements: ${missing.map(([name]) => name).join(", ")}`);

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
    elements.gameOverScreen.hidden = true;
    elements.pauseButton.hidden = false;
    elements.soundButton.hidden = false;
  },
  onWeaponChange(weapon) {
    elements.weaponValue.textContent = weapon.name;
  },
  onSoundChange(enabled) {
    elements.soundButton.textContent = enabled ? "Sound: ON" : "Sound: OFF";
    elements.soundButton.setAttribute("aria-pressed", String(enabled));
  },
  onHudUpdate(hud) {
    elements.scoreValue.textContent = hud.score.toLocaleString();
    elements.waveValue.textContent = String(hud.wave).padStart(2, "0");
    elements.healthValue.textContent = Math.ceil(hud.health);
    elements.shieldValue.textContent = Math.ceil(hud.shield);
    elements.livesValue.textContent = "♥".repeat(hud.lives) || "—";
    elements.weaponValue.textContent = hud.weapon;
    elements.creditValue.textContent = hud.credits.toLocaleString();
    elements.abilityStatus.textContent = hud.abilityReady ? "READY" : `${hud.abilityCooldown.toFixed(1)}s`;
    elements.abilityButton.disabled = !hud.abilityReady;
    elements.abilityButton.setAttribute("aria-label", hud.abilityReady ? "Activate Overcharge" : `Overcharge recharging: ${hud.abilityCooldown.toFixed(1)} seconds`);
    elements.healthFill.style.width = `${(hud.health / hud.maxHealth) * 100}%`;
    elements.shieldFill.style.width = `${(hud.shield / hud.maxShield) * 100}%`;
  },
  onGameOverChange(gameOver) {
    elements.gameOverScreen.hidden = !gameOver;
    if (gameOver) {
      elements.pauseButton.hidden = true;
      elements.abilityButton.disabled = true;
      elements.statusLabel.textContent = "RUN ENDED";
      elements.finalScore.textContent = elements.scoreValue.textContent;
    }
  }
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => game.start(button.dataset.mode));
});
elements.pauseButton.addEventListener("click", () => game.togglePause());
elements.soundButton.addEventListener("click", () => game.toggleSound());
elements.abilityButton.addEventListener("click", () => game.activateOvercharge());
elements.resumeButton.addEventListener("click", () => game.resume());
elements.restartButton.addEventListener("click", () => game.restart());
elements.gameOverRestartButton.addEventListener("click", () => game.restart());

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.code === "Space") {
    event.preventDefault();
    game.activateOvercharge();
  }
  if (event.key === "Escape" || event.key.toLowerCase() === "p") {
    if (elements.startScreen.hidden && elements.gameOverScreen.hidden) game.togglePause();
  }
});

window.addEventListener("beforeunload", () => game.destroy(), { once: true });
game.initialize();
