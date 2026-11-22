export class Projectile {
  constructor({ x, y, vx = 0, vy, damage = 10, owner = "player", radius = 4, pierce = 0, style = "pulse" }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.owner = owner;
    this.radius = radius;
    this.pierceRemaining = Math.max(0, Math.floor(pierce));
    this.style = style;
    this.hitTargets = new Set();
    this.active = true;
  }

  registerHit(target) {
    if (this.hitTargets.has(target)) return false;
    this.hitTargets.add(target);
    return true;
  }

  update(delta, width, height) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    if (this.y < -this.radius - 8 || this.y > height + this.radius + 8 ||
        this.x < -this.radius - 8 || this.x > width + this.radius + 8) {
      this.active = false;
    }
  }
}
