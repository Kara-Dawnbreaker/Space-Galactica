const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

export class Player {
  constructor() {
    this.radius = 12;
    this.speed = 300;
    this.x = 0;
    this.y = 0;
    this.bounds = { width: 1, height: 1 };
  }

  reset(width, height) {
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
}
