import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFreshCheckpoint } from "./geofence.js";

const target = { lat: 0, lng: 0 };
const position = { lat: 0, lng: 0, accuracy: 5 };
const nowMs = 100_000;

test("accepts a fresh, accurate checkpoint fix", () => {
  assert.deepEqual(
    evaluateFreshCheckpoint({ target, position, fixTimestampMs: 95_000, nowMs }),
    { status: "arrived", distanceMeters: 0, accuracyMeters: 5, ageMs: 5_000 },
  );
});

test("rejects a stale fix before evaluating distance", () => {
  assert.deepEqual(
    evaluateFreshCheckpoint({ target, position, fixTimestampMs: 60_000, nowMs }),
    { status: "stale_position", ageMs: 40_000 },
  );
});

test("rejects a timestamp from the future", () => {
  assert.deepEqual(
    evaluateFreshCheckpoint({ target, position, fixTimestampMs: 100_001, nowMs }),
    { status: "future_timestamp" },
  );
});

test("rejects missing or invalid clock values", () => {
  assert.equal(evaluateFreshCheckpoint({ target, position, nowMs }).status, "invalid_timestamp");
  assert.equal(evaluateFreshCheckpoint({
    target, position, fixTimestampMs: 99_000, nowMs, maxFixAgeMs: -1,
  }).status, "invalid_timestamp");
});

test("freshness check still rejects poor accuracy", () => {
  assert.deepEqual(
    evaluateFreshCheckpoint({
      target,
      position: { ...position, accuracy: 80 },
      fixTimestampMs: 99_000,
      nowMs,
    }),
    { status: "poor_accuracy", accuracyMeters: 80, ageMs: 1_000 },
  );
});
