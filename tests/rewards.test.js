import test from "node:test";
import assert from "node:assert/strict";
import { DropSystem } from "../src/systems/DropSystem.js";
import { DropPickup } from "../src/entities/DropPickup.js";
import { Player } from "../src/entities/Player.js";
import { AbilitySystem } from "../src/systems/AbilitySystem.js";

function sequence(values) {
  let index = 0;
  return () => values[index++] ?? 0;
}

test("reward drops are uncommon and the system exposes a strict active-drop cap", () => {
  const system = new DropSystem();
  assert.equal(system.rollDrop(() => 0.99), null);
  assert.equal(system.maxActiveDrops, 3);
});

test("weighted reward rolls produce all four supported reward types", () => {
  const system = new DropSystem();
  assert.deepEqual(system.rollDrop(sequence([0, 0])), { type: "credits", value: 12 });
  assert.deepEqual(system.rollDrop(sequence([0, 0.6])), { type: "repair", value: 25 });
  assert.deepEqual(system.rollDrop(sequence([0, 0.8])), { type: "shield", value: 20 });
  assert.deepEqual(system.rollDrop(sequence([0, 0.95])), { type: "overcharge", value: 4 });
});

test("reward pickup falls and deactivates after leaving the playfield", () => {
  const pickup = new DropPickup({ x: 20, y: 10, type: "credits", value: 12 });
  pickup.update(1, 100);
  assert.equal(pickup.y, 115);
  assert.equal(pickup.active, false);
});

test("hull repair restores health without exceeding maximum health", () => {
  const player = new Player();
  player.reset(800, 600);
  player.health = 60;
  assert.equal(player.restoreHealth(25), 25);
  assert.equal(player.health, 85);
  assert.equal(player.restoreHealth(50), 15);
  assert.equal(player.health, 100);
  assert.equal(player.restoreHealth(-10), 0);
});

test("Overcharge cells reduce cooldown but never below zero", () => {
  const ability = new AbilitySystem();
  ability.activate({ x: 0, y: 0 }, []);
  assert.equal(ability.reduceCooldown(4), 4);
  assert.equal(ability.cooldown, 8);
  assert.equal(ability.reduceCooldown(99), 8);
  assert.equal(ability.cooldown, 0);
  assert.equal(ability.reduceCooldown(-1), 0);
});
