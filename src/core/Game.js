import { Input } from "./Input.js";
import { Renderer } from "./Renderer.js";
import { Player } from "../entities/Player.js";
import { Enemy } from "../entities/Enemy.js";
import { Projectile } from "../entities/Projectile.js";
import { WaveDirector } from "../systems/WaveDirector.js";
import { SoundManager } from "./SoundManager.js";
import { WeaponSystem } from "../systems/WeaponSystem.js";
import { AbilitySystem } from "../systems/AbilitySystem.js";
import { WeaponPickup } from "../entities/WeaponPickup.js";
import { circleIntersectsCircle } from "./collision.js";

export class Game {
  constructor(canvas, callbacks = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError("Game requires a valid canvas element.");
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.context = canvas.getContext("2d", { alpha: false });
    if (!this.context) throw new Error("This browser could not create a 2D canvas context.");

    this.input = new Input(canvas);
    this.renderer = new Renderer(this.context);
    this.player = new Player();
    this.waveDirector = new WaveDirector();
    this.sound = new SoundManager();
    this.weaponSystem = new WeaponSystem();
    this.abilitySystem = new AbilitySystem();
    this.weaponPickups = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.mode = "space";
    this.state = "menu";
    this.lastTime = 0;
    this.frameId = null;
    this.width = 1;
    this.height = 1;
    this.score = 0;
    this.fireTimer = 0;
    this.enemySequence = 0;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.handleVisibilityChange = () => {
      if (document.hidden && this.state === "running") this.pause("visibility");
    };
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  initialize() {
    this.resizeObserver.observe(this.canvas.parentElement ?? this.canvas);
    this.resize();
  }

  resize() {
    const rect = (this.canvas.parentElement ?? this.canvas).getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    const pixelWidth = Math.round(this.width * dpr);
    const pixelHeight = Math.round(this.height * dpr);
    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
    }
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.player.setBounds(this.width, this.height);
    this.render();
  }

  start(mode) {
    if (mode !== "space" && mode !== "sea") return;
    this.mode = mode;
    this.sound.unlock();
    this.player.reset(this.width, this.height);
    this.input.reset();
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.weaponPickups = [];
    this.weaponSystem.resetRun();
    this.abilitySystem = new AbilitySystem();
    this.score = 0;
    this.enemySequence = 0;
    this.waveDirector.begin(1);
    this.state = "running";
    this.lastTime = 0;
    this.callbacks.onModeChange?.(mode);
    this.callbacks.onPauseChange?.(false, "start");
    this.callbacks.onGameOverChange?.(false);
    this.emitHud();
    this.stopFrame();
    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    if (this.state !== "running") return;
    const delta = this.lastTime === 0 ? 0 : Math.min(Math.max((time - this.lastTime) / 1000, 0), 0.033);
    this.lastTime = time;
    this.update(delta);
    this.render();
    if (this.state === "running") this.frameId = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  update(delta) {
    this.player.update(delta, this.input, this.width, this.height);
    this.weaponSystem.update(delta);
    this.abilitySystem.update(delta);
    for (const shot of this.weaponSystem.fire(this.player.x, this.player.y)) this.projectiles.push(shot);

    const waveEvent = this.waveDirector.update(delta, this.enemies.length);
    if (waveEvent.spawn) this.spawnEnemy();
    if (waveEvent.waveStarted) {
      this.spawnScheduledWeaponDrop(this.waveDirector.wave);
      this.emitHud();
    }

    for (const enemy of this.enemies) {
      enemy.contactCooldown = Math.max(0, (enemy.contactCooldown ?? 0) - delta);
      const shouldFire = enemy.update(delta, this.width, this.height);
      if (shouldFire) {
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const length = Math.max(1, Math.hypot(dx, dy));
        const speed = 220 + Math.min(80, this.waveDirector.wave * 3);
        this.projectiles.push(new Projectile({
          x: enemy.x, y: enemy.y + enemy.radius, vx: (dx / length) * speed * 0.35,
          vy: speed, damage: 12, owner: "enemy", radius: 5
        }));
        enemy.resetFireTimer();
      }
    }

    for (const projectile of this.projectiles) projectile.update(delta, this.width, this.height);
    for (const pickup of this.weaponPickups) pickup.update(delta, this.height);
    this.resolveCollisions();
    this.collectWeaponPickups();
    this.enemies = this.enemies.filter((enemy) => !enemy.destroyed && enemy.y < this.height + enemy.radius + 12);
    this.projectiles = this.projectiles.filter((projectile) => projectile.active);
    this.weaponPickups = this.weaponPickups.filter((pickup) => pickup.active);
    this.updateParticles(delta);
    this.emitHud();
  }

  spawnEnemy() {
    const wave = this.waveDirector.wave;
    const sequence = this.enemySequence++;
    const roll = (sequence + wave) % 7;
    const type = wave >= 2 && roll === 0 ? "tank" : roll === 3 || roll === 5 ? "scout" : "drone";
    const margin = 28;
    const x = margin + Math.random() * Math.max(1, this.width - margin * 2);
    this.enemies.push(new Enemy({ x, y: -24 - (sequence % 3) * 18, type, wave, seed: sequence }));
  }

  resolveCollisions() {
    for (const projectile of this.projectiles) {
      if (!projectile.active) continue;
      if (projectile.owner === "player") {
        for (const enemy of this.enemies) {
          if (enemy.destroyed) continue;
          if (circleIntersectsCircle(projectile, enemy)) {
            if (projectile.pierceRemaining > 0) projectile.pierceRemaining -= 1;
            else projectile.active = false;
            if (enemy.takeDamage(projectile.damage)) {
              this.score += enemy.scoreValue;
              this.weaponSystem.updateProgress(this.score);
              this.sound.play("destroy");
              this.burst(enemy.x, enemy.y, enemy.type === "tank" ? 18 : 10);
            }
            break;
          }
        }
      } else if (circleIntersectsCircle(projectile, this.player)) {
        projectile.active = false;
        const result = this.player.takeDamage(projectile.damage);
        if (result.applied) {
          this.sound.play("hit");
          this.burst(this.player.x, this.player.y, 7);
        }
        if (result.gameOver) this.finishRun();
      }
    }

    for (const enemy of this.enemies) {
      if (enemy.destroyed || enemy.contactCooldown > 0) continue;
      if (circleIntersectsCircle(enemy, this.player)) {
        if (enemy.takeDamage(25)) {
          this.score += enemy.scoreValue;
          this.weaponSystem.updateProgress(this.score);
          this.sound.play("destroy");
        }
        enemy.contactCooldown = 0.7;
        const result = this.player.takeDamage(22);
        if (result.applied) this.sound.play("hit");
        this.burst(enemy.x, enemy.y, 9);
        if (result.gameOver) this.finishRun();
      }
    }
  }

  spawnScheduledWeaponDrop(wave) {
    if (!this.weaponSystem.isDropWave(wave)) return;
    const weaponId = this.weaponSystem.chooseDrop();
    if (!weaponId) return;
    this.weaponSystem.markDrop(wave);
    const margin = 24;
    const x = margin + Math.random() * Math.max(1, this.width - margin * 2);
    this.weaponPickups.push(new WeaponPickup({ x, y: -18, weaponId }));
  }

  collectWeaponPickups() {
    for (const pickup of this.weaponPickups) {
      if (!pickup.active || !circleIntersectsCircle(pickup, this.player)) continue;
      this.weaponSystem.equip(pickup.weaponId);
      pickup.active = false;
      this.sound.play("destroy");
      this.burst(pickup.x, pickup.y, 14);
      this.callbacks.onWeaponChange?.(this.weaponSystem.currentWeapon);
    }
  }

  activateOvercharge() {
    if (this.state !== "running") return false;
    const result = this.abilitySystem.activate(this.player, this.enemies);
    if (!result.activated) return false;
    this.sound.play("destroy");
    this.burst(this.player.x, this.player.y, 30);
    for (const enemy of result.destroyed) {
      this.score += enemy.scoreValue;
      this.weaponSystem.updateProgress(this.score);
      this.burst(enemy.x, enemy.y, 16);
    }
    this.emitHud();
    return true;
  }

  burst(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 35 + (i % 4) * 22;
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.35, maxLife: 0.35 });
    }
  }

  updateParticles(delta) {
    for (const particle of this.particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.life -= delta;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  finishRun() {
    if (this.state !== "running") return;
    this.state = "gameover";
    this.input.reset();
    this.stopFrame();
    this.callbacks.onGameOverChange?.(true);
    this.emitHud();
    this.render();
  }

  emitHud() {
    this.callbacks.onHudUpdate?.({
      score: this.score, wave: this.waveDirector.wave, health: this.player.health,
      maxHealth: this.player.maxHealth, shield: this.player.shield,
      maxShield: this.player.maxShield, lives: this.player.lives,
      weapon: this.weaponSystem.currentWeapon.name,
      abilityReady: this.abilitySystem.ready,
      abilityProgress: this.abilitySystem.progress,
      abilityCooldown: this.abilitySystem.cooldown
    });
  }

  render() {
    this.renderer.draw(this.width, this.height, this.mode, this.player, this.state, this.enemies, this.projectiles, this.particles, this.weaponPickups);
  }

  toggleSound() {
    const enabled = this.sound.toggle();
    this.callbacks.onSoundChange?.(enabled);
    return enabled;
  }

  togglePause() {
    if (this.state === "running") this.pause();
    else if (this.state === "paused") this.resume();
  }

  pause(reason = "manual") {
    if (this.state !== "running") return;
    this.state = "paused";
    this.input.reset();
    this.stopFrame();
    this.callbacks.onPauseChange?.(true, reason);
    this.render();
  }

  resume() {
    if (this.state !== "paused" || document.hidden) return;
    this.state = "running";
    this.lastTime = 0;
    this.callbacks.onPauseChange?.(false, "resume");
    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }

  restart() {
    if (this.state === "menu") return;
    this.start(this.mode);
  }

  stopFrame() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  destroy() {
    this.stopFrame();
    this.resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.input.destroy();
    this.sound.destroy();
  }
}
