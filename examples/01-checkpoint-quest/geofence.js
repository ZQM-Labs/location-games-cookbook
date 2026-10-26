import { evaluateCheckpoint } from "./checkpoint.js";

const DEFAULT_MAX_FIX_AGE_MS = 30_000;

/**
 * Evaluate a browser geolocation fix with freshness checks before checkpoint
 * evaluation. Coordinates remain in memory; this function does not request,
 * persist, or transmit location.
 *
 * @param {object} input
 * @param {{lat:number,lng:number,accuracy:number}} input.position
 * @param {number} input.fixTimestampMs Timestamp from GeolocationPosition.timestamp.
 * @param {number} input.nowMs Caller-supplied clock value (injectable for tests).
 * @param {number} [input.maxFixAgeMs=30000]
 * @param {object} input.target
 * @param {number} [input.arrivalRadiusMeters=30]
 * @param {number} [input.maxAccuracyMeters=50]
 */
export function evaluateFreshCheckpoint({
  target,
  position,
  fixTimestampMs,
  nowMs,
  maxFixAgeMs = DEFAULT_MAX_FIX_AGE_MS,
  arrivalRadiusMeters = 30,
  maxAccuracyMeters = 50,
} = {}) {
  if (!Number.isFinite(fixTimestampMs) || !Number.isFinite(nowMs) ||
      !Number.isFinite(maxFixAgeMs) || maxFixAgeMs < 0) {
    return { status: "invalid_timestamp" };
  }

  const ageMs = nowMs - fixTimestampMs;
  if (ageMs < 0) return { status: "future_timestamp" };
  if (ageMs > maxFixAgeMs) return { status: "stale_position", ageMs };

  return {
    ...evaluateCheckpoint({
      target,
      position,
      arrivalRadiusMeters,
      maxAccuracyMeters,
    }),
    ageMs,
  };
}
