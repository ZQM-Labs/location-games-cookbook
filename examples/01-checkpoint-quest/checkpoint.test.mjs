import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCheckpoint } from "./checkpoint.js";

const target = { lat: 0, lng: 0 };

test("accepts a precise fix at the checkpoint", () => {
  assert.deepEqual(
    evaluateCheckpoint({ target, position: { lat: 0, lng: 0, accuracy: 5 } }),
    { status: "arrived", distanceMeters: 0, accuracyMeters: 5 },
  );
});

test("rejects a position outside the arrival radius", () => {
  const result = evaluateCheckpoint({
    target,
    position: { lat: 0, lng: 0.001, accuracy: 5 },
    arrivalRadiusMeters: 30,
  });
  assert.equal(result.status, "outside_radius");
  assert.ok(result.distanceMeters > 100);
});

test("does not accept a nearby but low-confidence fix", () => {
  assert.deepEqual(
    evaluateCheckpoint({ target, position: { lat: 0, lng: 0, accuracy: 75 } }),
    { status: "poor_accuracy", accuracyMeters: 75 },
  );
});

test("rejects malformed coordinates and invalid configuration", () => {
  assert.equal(evaluateCheckpoint({ target: { lat: 91, lng: 0 }, position: { lat: 0, lng: 0, accuracy: 1 } }).status,
    "invalid_target");
  assert.equal(evaluateCheckpoint({ target, position: { lat: 0, lng: 0, accuracy: -1 } }).status,
    "invalid_position");
  assert.equal(evaluateCheckpoint({ target, position: { lat: 0, lng: 0, accuracy: 1 }, arrivalRadiusMeters: 0 }).status,
    "invalid_configuration");
});

test("handles the antimeridian using the shortest great-circle distance", () => {
  const result = evaluateCheckpoint({
    target: { lat: 0, lng: 179.9999 },
    position: { lat: 0, lng: -179.9999, accuracy: 2 },
    arrivalRadiusMeters: 30,
  });
  assert.equal(result.status, "arrived");
  assert.ok(result.distanceMeters < 30);
});
