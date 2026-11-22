import { Projectile } from "../entities/Projectile.js";
import { WEAPON_CATALOG, getWeapon } from "./WeaponCatalog.js";

const STORAGE_KEY = "space-galactica.weapon-unlocks.v1";

export class WeaponSystem {
  constructor() {
    this.unlocked = new Set(WEAPON_CATALOG.filter((weapon) => weapon.unlockScore === 0).map((weapon) => weapon.id));
    this.loadUnlocks();
    this.currentId = "pulse";
    this.cooldown = 0;
    this.cycleDrops = new Set();
  }

  loadUnlocks() {
    try {
      const saved = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        for (const id of saved) if (WEAPON_CATALOG.some((weapon) => weapon.id === id)) this.unlocked.add(id);
      }
    } catch {
      // Storage can be unavailable in private or restricted browsing modes.
    }
  }

  saveUnlocks() {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify([...this.unlocked]));
    } catch {
      // The current session still works when persistent storage is unavailable.
    }
  }

  updateProgress(score) {
    let changed = false;
    for (const weapon of WEAPON_CATALOG) {
      if (score >= weapon.unlockScore && !this.unlocked.has(weapon.id)) {
        this.unlocked.add(weapon.id);
        changed = true;
      }
    }
    if (changed) this.saveUnlocks();
    return changed;
  }

  resetRun() {
    this.currentId = "pulse";
    this.cooldown = 0;
    this.cycleDrops.clear();
  }

  update(delta) {
    this.cooldown = Math.max(0, this.cooldown - Math.max(0, delta));
  }

  fire(x, y) {
    if (this.cooldown > 0) return [];
    const weapon = getWeapon(this.currentId);
    this.cooldown = weapon.cooldown;
    return weapon.pattern.map((shot) => new Projectile({
      x, y: y - 17, vx: shot.vx, vy: -shot.speed, damage: shot.damage,
      owner: "player", radius: shot.radius ?? 4, pierce: shot.pierce ?? 0, style: weapon.id
    }));
  }

  equip(id) {
    if (!this.unlocked.has(id)) return false;
    this.currentId = id;
    this.cooldown = Math.min(this.cooldown, 0.12);
    return true;
  }

  get currentWeapon() {
    return getWeapon(this.currentId);
  }

  isDropWave(wave) {
    const cycle = Math.floor((wave - 1) / 10);
    const position = ((wave - 1) % 10) + 1;
    return (position === 3 || position === 6) && !this.cycleDrops.has(cycle * 10 + position);
  }

  markDrop(wave) {
    const cycle = Math.floor((wave - 1) / 10);
    const position = ((wave - 1) % 10) + 1;
    this.cycleDrops.add(cycle * 10 + position);
  }

  chooseDrop() {
    const choices = WEAPON_CATALOG.filter((weapon) => this.unlocked.has(weapon.id) && weapon.id !== this.currentId);
    if (!choices.length) return null;
    return choices[Math.floor(Math.random() * choices.length)].id;
  }
}
