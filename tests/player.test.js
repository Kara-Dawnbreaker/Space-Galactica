import test from "node:test";
import assert from "node:assert/strict";
import { Player } from "../src/entities/Player.js";

const idleInput = { getMovement: () => ({ x: 0, y: 0, pointer: null }) };

test("player resets to the expected starting position", () => {
  const player = new Player();
  player.reset(800, 600);
  assert.equal(player.x, 400);
  assert.equal(player.y, 468);
});

test("keyboard movement is scaled by elapsed time", () => {
  const player = new Player();
  player.reset(800, 600);
  player.update(0.5, { getMovement: () => ({ x: 1, y: 0, pointer: null }) }, 800, 600);
  assert.equal(player.x, 550);
});

test("pointer movement cannot overshoot its target", () => {
  const player = new Player();
  player.reset(800, 600);
  player.update(1, { getMovement: () => ({ x: 0, y: 0, pointer: { x: 500, y: 400 } }) }, 800, 600);
  assert.equal(player.x, 500);
  assert.equal(player.y, 400);
});

test("player remains inside bounds after movement and resizing", () => {
  const player = new Player();
  player.reset(800, 600);
  player.update(10, { getMovement: () => ({ x: 1, y: -1, pointer: null }) }, 800, 600);
  assert.ok(player.x <= 784 && player.x >= 16);
  assert.ok(player.y <= 584 && player.y >= 16);
  player.setBounds(320, 240);
  assert.ok(player.x <= 304 && player.x >= 16);
  assert.ok(player.y <= 224 && player.y >= 16);
});

test("small playfields do not produce inverted clamp ranges", () => {
  const player = new Player();
  player.reset(10, 10);
  player.update(1, idleInput, 10, 10);
  assert.ok(Number.isFinite(player.x));
  assert.ok(Number.isFinite(player.y));
});
