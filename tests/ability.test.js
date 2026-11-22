import test from "node:test";
import assert from "node:assert/strict";
import { AbilitySystem } from "../src/systems/AbilitySystem.js";

test("Overcharge damages enemies in range but leaves distant enemies untouched", () => {
  const ability = new AbilitySystem();
  const nearby = { x: 100, y: 100, radius: 10, health: 80, takeDamage(amount) { this.health = Math.max(0, this.health - amount); return this.health === 0; } };
  const distant = { x: 500, y: 500, radius: 10, health: 80, takeDamage(amount) { this.health = Math.max(0, this.health - amount); return this.health === 0; } };
  const result = ability.activate({ x: 100, y: 100 }, [nearby, distant]);
  assert.equal(result.activated, true);
  assert.equal(nearby.health, 0);
  assert.equal(distant.health, 80);
  assert.equal(result.destroyed.length, 1);
});

test("Overcharge cannot activate again before its cooldown ends", () => {
  const ability = new AbilitySystem();
  assert.equal(ability.activate({ x: 0, y: 0 }, []).activated, true);
  assert.equal(ability.ready, false);
  assert.equal(ability.activate({ x: 0, y: 0 }, []).activated, false);
  ability.update(12);
  assert.equal(ability.ready, true);
  assert.equal(ability.progress, 1);
});
