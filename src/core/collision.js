// Shared collision helpers. Touching edges count as an intersection for circles.
export function circleIntersectsCircle(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const radius = Math.max(0, a.radius ?? 0) + Math.max(0, b.radius ?? 0);
  return dx * dx + dy * dy <= radius * radius;
}

// Rectangle edges that only touch are not considered overlapping.
export function rectanglesIntersect(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
