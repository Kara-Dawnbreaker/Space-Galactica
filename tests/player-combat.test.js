import test from "node:test";
import assert from "node:assert/strict";
import { Player } from "../src/entities/Player.js";

test("shield absorbs incoming damage before hull health", () => {
  const player = new Player();
  player.reset(800, 600);
  const result = player.takeDamage(30);
  assert.equal(result.applied, true);
  assert.equal(player.shield, 20);
  assert.equal(player.health, 100);
});

test("damage spills from shield into hull", () => {
  const player = new Player();
  player.reset(800, 600);
  player.takeDamage(70);
  assert.equal(player.shield, 0);
  assert.equal(player.health, 80);
});

test("losing hull health grants brief protection and consumes one life at zero", () => {
  const player = new Player();
  player.reset(800, 600);
  player.shield = 0;
  player.health = 10;
  const result = player.takeDamage(10);
  assert.equal(result.lifeLost, true);
  assert.equal(result.gameOver, false);
  assert.equal(player.lives, 2);
  assert.equal(player.health, 100);
  assert.equal(player.invulnerableTimer, 1.8);
  assert.equal(player.takeDamage(100).applied, false);
});

test("the third lost life ends the run", () => {
  const player = new Player();
  player.reset(800, 600);
  player.shield = 0;
  player.health = 1;
  player.takeDamage(1);
  player.invulnerableTimer = 0;
  player.health = 1;
  player.takeDamage(1);
  player.invulnerableTimer = 0;
  player.health = 1;
  const result = player.takeDamage(1);
  assert.equal(result.gameOver, true);
  assert.equal(player.lives, 0);
});
