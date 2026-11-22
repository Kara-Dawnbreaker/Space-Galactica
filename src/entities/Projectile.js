export class Projectile {
  constructor({ x, y, vx = 0, vy, damage = 10, owner = "player", radius = 4 }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.owner = owner;
    this.radius = radius;
    this.active = true;
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
