export class AbilitySystem {
  constructor() {
    this.cooldown = 0;
    this.cooldownDuration = 12;
    this.radius = 155;
    this.damage = 85;
  }

  update(delta) {
    this.cooldown = Math.max(0, this.cooldown - Math.max(0, delta));
  }

  reduceCooldown(seconds) {
    const before = this.cooldown;
    this.cooldown = Math.max(0, this.cooldown - Math.max(0, seconds));
    return before - this.cooldown;
  }

  activate(player, enemies) {
    if (this.cooldown > 0) return { activated: false, destroyed: [] };
    this.cooldown = this.cooldownDuration;
    const destroyed = [];
    for (const enemy of enemies) {
      if (Math.hypot(enemy.x - player.x, enemy.y - player.y) <= this.radius + enemy.radius) {
        if (enemy.takeDamage(this.damage)) destroyed.push(enemy);
      }
    }
    return { activated: true, destroyed };
  }

  get ready() {
    return this.cooldown <= 0;
  }

  get progress() {
    return this.ready ? 1 : 1 - this.cooldown / this.cooldownDuration;
  }
}
