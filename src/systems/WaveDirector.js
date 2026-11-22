export class WaveDirector {
  constructor() {
    this.wave = 1;
    this.spawned = 0;
    this.total = 0;
    this.spawnTimer = 0;
    this.intermission = 0;
    this.started = false;
  }

  begin(wave = 1) {
    this.wave = Math.max(1, Math.floor(wave));
    this.spawned = 0;
    this.total = Math.min(7 + this.wave * 2, 30);
    this.spawnTimer = 0.35;
    this.intermission = 0;
    this.started = true;
  }

  update(delta, aliveCount) {
    if (!this.started) return { spawn: false, waveStarted: false };
    if (this.spawned < this.total) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        this.spawned += 1;
        this.spawnTimer = Math.max(0.28, 0.82 - this.wave * 0.025);
        return { spawn: true, waveStarted: false };
      }
      return { spawn: false, waveStarted: false };
    }

    if (aliveCount === 0) {
      if (this.intermission === 0) this.intermission = 1.7;
      this.intermission -= delta;
      if (this.intermission <= 0) {
        this.begin(this.wave + 1);
        return { spawn: false, waveStarted: true };
      }
    }
    return { spawn: false, waveStarted: false };
  }

  get progress() {
    return this.total ? this.spawned / this.total : 0;
  }
}
