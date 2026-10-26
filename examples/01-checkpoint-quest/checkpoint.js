/**
 * Dependency-free checkpoint evaluation for browser location games.
 *
 * This module evaluates a position already obtained by the caller. It does not
 * request geolocation, persist coordinates, transmit data, or grant access to
 * gated content. Treat client-side arrival as a gameplay hint, not a security
 * boundary; authoritative rewards/unlocks must be checked by the backend.
 */

const EARTH_RADIUS_METERS = 6_371_000;

function validCoordinate(value, min, max) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function validPoint(point) {
  return point !== null && typeof point === "object" &&
    validCoordinate(point.lat, -90, 90) &&
    validCoordinate(point.lng, -180, 180);
}

function distanceMeters(a, b) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const deltaLat = radians(b.lat - a.lat);
  const deltaLng = radians(b.lng - a.lng);
  const h = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(Math.min(1, h)));
}

/**
 * @param {object} input
 * @param {{lat:number,lng:number}} input.target Checkpoint coordinates.
 * @param {{lat:number,lng:number,accuracy:number}} input.position Geolocation fix.
 * @param {number} [input.arrivalRadiusMeters=30] Allowed checkpoint radius.
 * @param {number} [input.maxAccuracyMeters=50] Reject less accurate fixes.
 * @returns {{status:string, distanceMeters?:number, accuracyMeters?:number}}
 */
export function evaluateCheckpoint({
  target,
  position,
  arrivalRadiusMeters = 30,
  maxAccuracyMeters = 50,
} = {}) {
  if (!validPoint(target)) return { status: "invalid_target" };
  if (!validPoint(position) || !Number.isFinite(position.accuracy) || position.accuracy < 0) {
    return { status: "invalid_position" };
  }
  if (!Number.isFinite(arrivalRadiusMeters) || arrivalRadiusMeters <= 0 ||
      !Number.isFinite(maxAccuracyMeters) || maxAccuracyMeters < 0) {
    return { status: "invalid_configuration" };
  }

  if (position.accuracy > maxAccuracyMeters) {
    return { status: "poor_accuracy", accuracyMeters: position.accuracy };
  }

  const distance = distanceMeters(target, position);
  return {
    status: distance <= arrivalRadiusMeters ? "arrived" : "outside_radius",
    distanceMeters: Math.round(distance * 10) / 10,
    accuracyMeters: position.accuracy,
  };
}
