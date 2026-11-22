export class DropPickup {
  constructor({ x, y, type, value }) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.value = value;
    this.radius = 12;
    this.speed = 105;
    this.age = 0;
    this.active = true;
  }

  update(delta, height) {
    const elapsed = Math.max(0, delta);
    this.age += elapsed;
    this.y += this.speed * elapsed;
    if (this.y > height + this.radius + 8) this.active = false;
  }
}
