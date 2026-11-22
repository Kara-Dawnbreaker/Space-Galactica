export class Enemy {
  constructor({ x, y, type = "drone", wave = 1, seed = 0 }) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = type === "tank" ? 19 : type === "scout" ? 11 : 14;
    this.maxHealth = (type === "tank" ? 90 : type === "scout" ? 22 : 40) + Math.max(0, wave - 1) * 3;
    this.health = this.maxHealth;
    this.speed = (type === "tank" ? 48 : type === "scout" ? 112 : 72) + Math.min(45, wave * 2);
    this.scoreValue = type === "tank" ? 250 : type === "scout" ? 125 : 100;
    this.fireRate = type === "tank" ? 2.4 : type === "scout" ? 3.1 : 2.8;
    this.fireTimer = 1.2 + (seed % 10) * 0.11;
    this.phase = seed * 1.7;
    this.age = 0;
    this.wave = wave;
  }

  update(delta, width, height) {
    this.age += delta;
    this.y += this.speed * delta;
    this.x += Math.sin(this.age * (this.type === "scout" ? 2.7 : 1.25) + this.phase) * (this.type === "scout" ? 92 : 34) * delta;
    this.x = Math.max(this.radius + 5, Math.min(width - this.radius - 5, this.x));
    this.fireTimer -= delta;
    return this.fireTimer <= 0 && this.y < height * 0.78;
  }

  resetFireTimer() {
    this.fireTimer = this.fireRate;
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - Math.max(0, amount));
    return this.health === 0;
  }

  get destroyed() {
    return this.health <= 0;
  }
}
