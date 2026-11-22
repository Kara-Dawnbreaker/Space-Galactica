const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

export class Player {
  constructor() {
    this.radius = 12;
    this.speed = 300;
    this.maxHealth = 100;
    this.maxShield = 50;
    this.health = this.maxHealth;
    this.shield = this.maxShield;
    this.lives = 3;
    this.invulnerableTimer = 0;
    this.x = 0;
    this.y = 0;
    this.bounds = { width: 1, height: 1 };
  }

  reset(width, height) {
    this.health = this.maxHealth;
    this.shield = this.maxShield;
    this.lives = 3;
    this.invulnerableTimer = 0;
    this.x = width / 2;
    this.y = height * 0.78;
    this.setBounds(width, height);
  }

  setBounds(width, height) {
    this.bounds.width = Math.max(1, width);
    this.bounds.height = Math.max(1, height);
    const minX = Math.min(this.radius + 4, this.bounds.width / 2);
    const minY = Math.min(this.radius + 4, this.bounds.height / 2);
    const maxX = Math.max(minX, this.bounds.width - this.radius - 4);
    const maxY = Math.max(minY, this.bounds.height - this.radius - 4);
    this.x = clamp(this.x || this.bounds.width / 2, minX, maxX);
    this.y = clamp(this.y || this.bounds.height * 0.78, minY, maxY);
  }

  update(delta, input, width, height) {
    this.invulnerableTimer = Math.max(0, this.invulnerableTimer - delta);
    const movement = input.getMovement();
    if (movement.pointer) {
      const dx = movement.pointer.x - this.x;
      const dy = movement.pointer.y - this.y;
      const distance = Math.hypot(dx, dy);
      const travel = Math.min(distance, this.speed * delta);
      if (distance > 0) {
        this.x += (dx / distance) * travel;
        this.y += (dy / distance) * travel;
      }
    } else {
      this.x += movement.x * this.speed * delta;
      this.y += movement.y * this.speed * delta;
    }
    const minX = Math.min(this.radius + 4, width / 2);
    const minY = Math.min(this.radius + 4, height / 2);
    const maxX = Math.max(minX, width - this.radius - 4);
    const maxY = Math.max(minY, height - this.radius - 4);
    this.x = clamp(this.x, minX, maxX);
    this.y = clamp(this.y, minY, maxY);
  }

  takeDamage(amount) {
    if (this.invulnerableTimer > 0 || amount <= 0) return { applied: false, lifeLost: false, gameOver: false };
    let remaining = amount;
    const shieldDamage = Math.min(this.shield, remaining);
    this.shield -= shieldDamage;
    remaining -= shieldDamage;
    this.health = Math.max(0, this.health - remaining);
    if (this.health > 0) return { applied: true, lifeLost: false, gameOver: false };

    this.lives = Math.max(0, this.lives - 1);
    if (this.lives === 0) return { applied: true, lifeLost: true, gameOver: true };
    this.health = this.maxHealth;
    this.shield = 0;
    this.invulnerableTimer = 1.8;
    return { applied: true, lifeLost: true, gameOver: false };
  }

  restoreHealth(amount) {
    const before = this.health;
    this.health = Math.min(this.maxHealth, this.health + Math.max(0, amount));
    return this.health - before;
  }

  restoreShield(amount) {
    this.shield = Math.min(this.maxShield, this.shield + Math.max(0, amount));
  }
}
