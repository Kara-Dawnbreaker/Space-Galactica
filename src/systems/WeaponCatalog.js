export const WEAPON_CATALOG = [
  { id: "pulse", name: "Pulse Blaster", description: "Balanced single shots.", cooldown: 0.27, unlockScore: 0, pattern: [{ vx: 0, damage: 20, speed: 590, radius: 4 }] },
  { id: "twin-lance", name: "Twin Lance", description: "Two parallel bolts.", cooldown: 0.34, unlockScore: 0, pattern: [{ vx: -48, damage: 15, speed: 570 }, { vx: 48, damage: 15, speed: 570 }] },
  { id: "spread-shot", name: "Spread Shot", description: "Three-way fan.", cooldown: 0.42, unlockScore: 0, pattern: [{ vx: -125, damage: 13, speed: 520 }, { vx: 0, damage: 15, speed: 560 }, { vx: 125, damage: 13, speed: 520 }] },
  { id: "heavy-bolt", name: "Heavy Bolt", description: "Slow, powerful impact.", cooldown: 0.58, unlockScore: 0, pattern: [{ vx: 0, damage: 48, speed: 450, radius: 7 }] },
  { id: "needle-stream", name: "Needle Stream", description: "Rapid lightweight fire.", cooldown: 0.12, unlockScore: 0, pattern: [{ vx: 0, damage: 8, speed: 650, radius: 3 }] },
  { id: "burst-cannon", name: "Burst Cannon", description: "A compact three-shot burst.", cooldown: 0.48, unlockScore: 500, pattern: [{ vx: -24, damage: 17, speed: 590 }, { vx: 0, damage: 17, speed: 590 }, { vx: 24, damage: 17, speed: 590 }] },
  { id: "sidewinders", name: "Sidewinders", description: "Two outward-curving lanes.", cooldown: 0.36, unlockScore: 900, pattern: [{ vx: -155, damage: 18, speed: 520 }, { vx: 155, damage: 18, speed: 520 }] },
  { id: "arc-splitter", name: "Arc Splitter", description: "Five-shot electric fan.", cooldown: 0.55, unlockScore: 1400, pattern: [-2,-1,0,1,2].map(n => ({ vx: n * 95, damage: 12, speed: 540 })) },
  { id: "plasma-orb", name: "Plasma Orb", description: "Large, slow plasma rounds.", cooldown: 0.68, unlockScore: 2000, pattern: [{ vx: 0, damage: 62, speed: 380, radius: 9 }] },
  { id: "piercer", name: "Piercer", description: "A narrow high-velocity lance.", cooldown: 0.46, unlockScore: 2700, pattern: [{ vx: 0, damage: 30, speed: 900, radius: 3, pierce: 3 }] },
  { id: "nova-fan", name: "Nova Fan", description: "Wide seven-lane burst.", cooldown: 0.72, unlockScore: 3500, pattern: [-3,-2,-1,0,1,2,3].map(n => ({ vx: n * 88, damage: 10, speed: 500 })) },
  { id: "wave-beam", name: "Wave Beam", description: "Broad, steady energy waves.", cooldown: 0.32, unlockScore: 4400, pattern: [{ vx: 0, damage: 23, speed: 500, radius: 7 }] },
  { id: "rail-shot", name: "Rail Driver", description: "Very fast precision fire.", cooldown: 0.82, unlockScore: 5400, pattern: [{ vx: 0, damage: 90, speed: 1150, radius: 5, pierce: 5 }] },
  { id: "flak-burst", name: "Flak Burst", description: "Five compact explosive pellets.", cooldown: 0.62, unlockScore: 6500, pattern: [-2,-1,0,1,2].map(n => ({ vx: n * 72, damage: 16, speed: 570, radius: 5 })) },
  { id: "prism-array", name: "Prism Array", description: "Alternating three-colour bolts.", cooldown: 0.25, unlockScore: 7700, pattern: [{ vx: -34, damage: 16, speed: 630 }, { vx: 34, damage: 16, speed: 630 }] },
  { id: "vortex-disc", name: "Vortex Disc", description: "Heavy discs with broad impact.", cooldown: 0.76, unlockScore: 9000, pattern: [{ vx: 0, damage: 70, speed: 430, radius: 10 }] },
  { id: "solar-flare", name: "Solar Flare", description: "A hot three-lane volley.", cooldown: 0.5, unlockScore: 10400, pattern: [{ vx: -70, damage: 24, speed: 600 }, { vx: 0, damage: 28, speed: 640 }, { vx: 70, damage: 24, speed: 600 }] },
  { id: "void-repeater", name: "Void Repeater", description: "Rapid paired dark-energy shots.", cooldown: 0.18, unlockScore: 11900, pattern: [{ vx: -26, damage: 12, speed: 700 }, { vx: 26, damage: 12, speed: 700 }] },
  { id: "meteor-driver", name: "Meteor Driver", description: "A massive, slow impact round.", cooldown: 0.95, unlockScore: 13500, pattern: [{ vx: 0, damage: 115, speed: 330, radius: 12 }] },
  { id: "singularity", name: "Singularity", description: "A concentrated piercing core.", cooldown: 0.7, unlockScore: 15200, pattern: [{ vx: 0, damage: 58, speed: 760, radius: 8, pierce: 2 }] }
];

export function getWeapon(id) {
  return WEAPON_CATALOG.find((weapon) => weapon.id === id) ?? WEAPON_CATALOG[0];
}
