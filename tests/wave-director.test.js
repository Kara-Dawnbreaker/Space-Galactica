import test from "node:test";
import assert from "node:assert/strict";
import { WaveDirector } from "../src/systems/WaveDirector.js";

test("wave begins at one and schedules a finite enemy group", () => {
  const director = new WaveDirector();
  director.begin();
  assert.equal(director.wave, 1);
  assert.equal(director.total, 9);
  assert.equal(director.spawned, 0);
});

test("director emits exactly one spawn event per scheduled enemy", () => {
  const director = new WaveDirector();
  director.begin(1);
  let spawns = 0;
  for (let i = 0; i < 100; i++) {
    if (director.update(1, 9).spawn) spawns++;
  }
  assert.equal(spawns, 9);
  assert.equal(director.spawned, director.total);
});

test("next wave starts only after the group is spawned and the field is clear", () => {
  const director = new WaveDirector();
  director.begin(1);
  for (let i = 0; i < 9; i++) director.update(1, 1);
  const waiting = director.update(0.5, 1);
  assert.equal(waiting.waveStarted, false);
  const next = director.update(2, 0);
  assert.equal(next.waveStarted, true);
  assert.equal(director.wave, 2);
  assert.equal(director.spawned, 0);
});
