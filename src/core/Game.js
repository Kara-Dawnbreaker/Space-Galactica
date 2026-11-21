import { Input } from "./Input.js";
import { Renderer } from "./Renderer.js";
import { Player } from "../entities/Player.js";

export class Game {
  constructor(canvas, callbacks = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError("Game requires a valid canvas element.");
    }

    this.canvas = canvas;
    this.callbacks = callbacks;
    this.context = canvas.getContext("2d", { alpha: false });

    if (!this.context) {
      throw new Error("This browser could not create a 2D canvas context.");
    }

    this.input = new Input(canvas);
    this.renderer = new Renderer(this.context);
    this.player = new Player();

    this.mode = "space";
    this.state = "menu";
    this.lastTime = 0;
    this.frameId = null;
    this.width = 1;
    this.height = 1;

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
    const surface = this.canvas.parentElement ?? this.canvas;
    const rect = surface.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);

    this.width = width;
    this.height = height;

    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);

    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
    }

    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.player.setBounds(width, height);
    this.render();
  }

  start(mode) {
    if (mode !== "space" && mode !== "sea") return;

    this.mode = mode;
    this.player.reset(this.width, this.height);
    this.input.reset();
    this.state = "running";
    this.lastTime = 0;

    this.callbacks.onModeChange?.(mode);
    this.stopFrame();
    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    if (this.state !== "running") return;

    const delta = this.lastTime === 0
      ? 0
      : Math.min(Math.max((time - this.lastTime) / 1000, 0), 0.033);

    this.lastTime = time;
    this.update(delta);
    this.render();

    if (this.state === "running") {
      this.frameId = requestAnimationFrame((nextTime) => this.loop(nextTime));
    }
  }

  update(delta) {
    this.player.update(delta, this.input, this.width, this.height);
  }

  render() {
    this.renderer.draw(this.width, this.height, this.mode, this.player, this.state);
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

    this.player.reset(this.width, this.height);
    this.input.reset();
    this.state = "running";
    this.lastTime = 0;
    this.callbacks.onPauseChange?.(false, "restart");
    this.stopFrame();
    this.frameId = requestAnimationFrame((time) => this.loop(time));
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
  }
}
