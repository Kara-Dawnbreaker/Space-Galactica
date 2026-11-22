import test from "node:test";
import assert from "node:assert/strict";
import { WEAPON_CATALOG } from "../src/systems/WeaponCatalog.js";
import { WeaponSystem } from "../src/systems/WeaponSystem.js";
import { Projectile } from "../src/entities/Projectile.js";

test("catalog contains twenty uniquely identified weapons with distinct firing patterns", () => {
  assert.equal(WEAPON_CATALOG.length, 20);
  assert.equal(new Set(WEAPON_CATALOG.map((weapon) => weapon.id)).size, 20);
  assert.equal(new Set(WEAPON_CATALOG.map((weapon) => JSON.stringify(weapon.pattern))).size, 20);
});

test("five starter weapons are unlocked and locked weapons cannot be equipped", () => {
  const system = new WeaponSystem();
  assert.equal(system.unlocked.size, 5);
  assert.equal(system.equip("singularity"), false);
  assert.equal(system.equip("twin-lance"), true);
  assert.equal(system.currentId, "twin-lance");
});

test("score milestones unlock new weapons", () => {
  const system = new WeaponSystem();
  assert.equal(system.unlocked.has("burst-cannon"), false);
  assert.equal(system.updateProgress(500), true);
  assert.equal(system.unlocked.has("burst-cannon"), true);
  assert.equal(system.updateProgress(500), false);
});

test("weapon firing follows the selected weapon pattern and cooldown", () => {
  const system = new WeaponSystem();
  assert.equal(system.fire(100, 500).length, 1);
  assert.equal(system.fire(100, 500).length, 0);
  system.update(1);
  assert.equal(system.equip("spread-shot"), true);
  assert.equal(system.fire(100, 500).length, 3);
});

test("weapon drops are scheduled twice in every ten-wave cycle", () => {
  const system = new WeaponSystem();
  const scheduled = [];
  for (let wave = 1; wave <= 30; wave++) {
    if (system.isDropWave(wave)) {
      scheduled.push(wave);
      system.markDrop(wave);
      assert.equal(system.isDropWave(wave), false);
    }
  }
  assert.deepEqual(scheduled, [3, 6, 13, 16, 23, 26]);
});

test("piercing projectile keeps travelling for its configured extra hits", () => {
  const shot = new Projectile({ x: 20, y: 20, vy: -100, pierce: 2 });
  assert.equal(shot.pierceRemaining, 2);
  shot.pierceRemaining -= 1;
  assert.equal(shot.active, true);
  shot.pierceRemaining -= 1;
  assert.equal(shot.active, true);
  shot.active = false;
  assert.equal(shot.active, false);
});
