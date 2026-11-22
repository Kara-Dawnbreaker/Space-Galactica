export class SoundManager {
  constructor() {
    this.enabled = true;
    this.context = null;
  }

  unlock() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      if (!this.context) this.context = new AudioContextClass();
      if (this.context.state === "suspended") this.context.resume();
    } catch {
      this.context = null;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.unlock();
    return this.enabled;
  }

  play(kind = "hit") {
    if (!this.enabled || !this.context || this.context.state !== "running") return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const settings = kind === "destroy"
      ? { start: 520, end: 180, duration: 0.11, volume: 0.055, wave: "square" }
      : { start: 180, end: 75, duration: 0.16, volume: 0.07, wave: "sawtooth" };
    oscillator.type = settings.wave;
    oscillator.frequency.setValueAtTime(settings.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(settings.end, now + settings.duration);
    gain.gain.setValueAtTime(settings.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + settings.duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + settings.duration);
  }

  destroy() {
    if (this.context && this.context.state !== "closed") this.context.close();
    this.context = null;
  }
}
