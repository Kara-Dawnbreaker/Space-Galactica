import test from "node:test";
import assert from "node:assert/strict";
import { Enemy } from "../src/entities/Enemy.js";
import { Projectile } from "../src/entities/Projectile.js";

test("enemy classes have distinct durability and movement profiles", () => {
  const drone = new Enemy({ x: 100, y: 0, type: "drone", wave: 1 });
  const scout = new Enemy({ x: 100, y: 0, type: "scout", wave: 1 });
  const tank = new Enemy({ x: 100, y: 0, type: "tank", wave: 1 });
  assert.ok(scout.speed > drone.speed);
  assert.ok(tank.maxHealth > drone.maxHealth);
  assert.ok(tank.scoreValue > drone.scoreValue);
});

test("enemy health never falls below zero and destruction is reported", () => {
  const enemy = new Enemy({ x: 50, y: 50 });
  assert.equal(enemy.takeDamage(10), false);
  assert.equal(enemy.takeDamage(1000), true);
  assert.equal(enemy.health, 0);
  assert.equal(enemy.destroyed, true);
});

test("enemy firing timer triggers and can be reset", () => {
  const enemy = new Enemy({ x: 50, y: 50, seed: 0 });
  assert.equal(enemy.update(1.3, 400, 600), true);
  enemy.resetFireTimer();
  assert.equal(enemy.update(0.1, 400, 600), false);
});

test("projectiles move according to velocity and deactivate outside the playfield", () => {
  const shot = new Projectile({ x: 100, y: 100, vx: 20, vy: -100 });
  shot.update(0.5, 400, 600);
  assert.equal(shot.x, 110);
  assert.equal(shot.y, 50);
  shot.y = -20;
  shot.update(0.01, 400, 600);
  assert.equal(shot.active, false);
});
