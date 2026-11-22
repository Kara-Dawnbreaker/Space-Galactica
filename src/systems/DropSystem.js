export const DROP_CATALOG = [
  { type: "credits", value: 12, weight: 50, label: "Salvage" },
  { type: "repair", value: 25, weight: 20, label: "Hull Repair" },
  { type: "shield", value: 20, weight: 20, label: "Shield Cell" },
  { type: "overcharge", value: 4, weight: 10, label: "Overcharge Cell" }
];

export class DropSystem {
  constructor({ chance = 0.12, maxActiveDrops = 3 } = {}) {
    this.chance = Math.max(0, Math.min(1, chance));
    this.maxActiveDrops = Math.max(1, Math.floor(maxActiveDrops));
  }

  rollDrop(random = Math.random) {
    if (random() >= this.chance) return null;
    const totalWeight = DROP_CATALOG.reduce((sum, item) => sum + item.weight, 0);
    let roll = random() * totalWeight;
    for (const item of DROP_CATALOG) {
      roll -= item.weight;
      if (roll < 0) return { type: item.type, value: item.value };
    }
    const last = DROP_CATALOG[DROP_CATALOG.length - 1];
    return { type: last.type, value: last.value };
  }
}
