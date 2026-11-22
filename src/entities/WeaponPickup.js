export class WeaponPickup {
  constructor({ x, y, weaponId }) {
    this.x = x;
    this.y = y;
    this.weaponId = weaponId;
    this.radius = 13;
    this.speed = 95;
    this.age = 0;
    this.active = true;
  }

  update(delta, height) {
    this.age += delta;
    this.y += this.speed * delta;
    if (this.y > height + this.radius) this.active = false;
  }
}
