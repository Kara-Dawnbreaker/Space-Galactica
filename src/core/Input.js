const MOVEMENT_KEYS = new Set([
  "w", "a", "s", "d",
  "arrowup", "arrowleft", "arrowdown", "arrowright"
]);

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pointer = null;
    this.pointerId = null;

    this.handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (!MOVEMENT_KEYS.has(key)) return;
      if (key.startsWith("arrow")) event.preventDefault();
      this.keys.add(key);
    };

    this.handleKeyUp = (event) => {
      this.keys.delete(event.key.toLowerCase());
    };

    this.handleBlur = () => this.reset();

    this.handlePointerDown = (event) => {
      if (this.pointerId !== null || event.isPrimary === false) return;
      this.pointerId = event.pointerId;
      this.pointer = this.positionFromEvent(event);
      this.canvas.setPointerCapture?.(event.pointerId);
    };

    this.handlePointerMove = (event) => {
      if (event.pointerId !== this.pointerId) return;
      this.pointer = this.positionFromEvent(event);
    };

    this.handlePointerEnd = (event) => {
      if (event.pointerId !== this.pointerId) return;
      this.pointer = null;
      this.pointerId = null;
    };

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleBlur);

    canvas.addEventListener("pointerdown", this.handlePointerDown);
    canvas.addEventListener("pointermove", this.handlePointerMove);
    canvas.addEventListener("pointerup", this.handlePointerEnd);
    canvas.addEventListener("pointercancel", this.handlePointerEnd);
    canvas.addEventListener("lostpointercapture", this.handlePointerEnd);
  }

  positionFromEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(event.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(event.clientY - rect.top, rect.height))
    };
  }

  getMovement() {
    let x = 0;
    let y = 0;

    if (this.keys.has("a") || this.keys.has("arrowleft")) x -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) x += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) y -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) y += 1;

    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }

    return { x, y, pointer: this.pointer };
  }

  reset() {
    this.keys.clear();
    this.pointer = null;
    this.pointerId = null;
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleBlur);

    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerEnd);
    this.canvas.removeEventListener("pointercancel", this.handlePointerEnd);
    this.canvas.removeEventListener("lostpointercapture", this.handlePointerEnd);
    this.reset();
  }
}
