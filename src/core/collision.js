// Shared collision helpers for upcoming combat and pickup systems.
export function circleIntersectsCircle(a,b){const dx=a.x-b.x,dy=a.y-b.y,radius=(a.radius??0)+(b.radius??0);return dx*dx+dy*dy<=radius*radius}
export function rectanglesIntersect(a,b){return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y}