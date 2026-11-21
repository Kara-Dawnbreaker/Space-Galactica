import test from "node:test";
import assert from "node:assert/strict";
import { circleIntersectsCircle, rectanglesIntersect } from "../src/core/collision.js";

test("circles intersect when overlapping or touching", () => {
  assert.equal(circleIntersectsCircle({ x: 0, y: 0, radius: 5 }, { x: 10, y: 0, radius: 5 }), true);
  assert.equal(circleIntersectsCircle({ x: 0, y: 0, radius: 5 }, { x: 11, y: 0, radius: 5 }), false);
});

test("negative circle radii are treated as zero", () => {
  assert.equal(circleIntersectsCircle({ x: 0, y: 0, radius: -5 }, { x: 0, y: 0, radius: 1 }), true);
});

test("rectangles require positive-area overlap", () => {
  assert.equal(rectanglesIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 9, y: 9, width: 10, height: 10 }), true);
  assert.equal(rectanglesIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }), false);
});
