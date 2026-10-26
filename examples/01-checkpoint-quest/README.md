# 01 — Checkpoint quest

A dependency-free reference implementation for deciding whether a browser-provided location fix is good enough to count as arriving at a quest checkpoint.

## What is included

- `checkpoint.js` — pure great-circle distance calculation and checkpoint evaluation.
- `geofence.js` — freshness-aware wrapper that rejects stale and future-dated fixes before evaluating a checkpoint.
- `checkpoint.test.mjs` — deterministic tests for arrival, outside-radius fixes, poor accuracy, malformed input, invalid configuration, and the antimeridian.
- `geofence.test.mjs` — deterministic freshness, future-timestamp, and accuracy regression tests.
- `package.json` — a minimal Node.js test command; no third-party dependencies.

## Run the tests

Requires Node.js 20 or newer:

```sh
npm test
```

## Use it in a browser

Serve this example over HTTPS (or use localhost during development). Browser geolocation generally requires a secure context and explicit user permission.

```js
import { evaluateFreshCheckpoint } from "./geofence.js";

function getPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("This browser does not support geolocation."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 5_000,
      ...options,
    });
  });
}

const target = { lat: 0, lng: 0 }; // synthetic example only

try {
  const fix = await getPosition();
  const result = evaluateFreshCheckpoint({
    target,
    position: {
      lat: fix.coords.latitude,
      lng: fix.coords.longitude,
      accuracy: fix.coords.accuracy,
    },
    fixTimestampMs: fix.timestamp,
    nowMs: Date.now(),
    arrivalRadiusMeters: 30,
    maxAccuracyMeters: 50,
  });

  if (result.status === "arrived") {
    // Update local presentation. Ask the server to validate any real unlock.
    console.info("Checkpoint reached.");
  } else if (result.status === "stale_position") {
    console.info("Location fix is too old; request a fresh position and retry.");
  } else if (result.status === "future_timestamp") {
    console.info("Location timestamp is invalid; request a fresh position and retry.");
  } else if (result.status === "poor_accuracy") {
    console.info("Location is not precise enough; move to a clearer area and retry.");
  } else if (result.status === "outside_radius") {
    console.info("Not at the checkpoint yet.");
  } else {
    console.info("Location could not be evaluated; offer a retry or approved manual fallback.");
  }
} catch {
  // Permission denied, timeout, or unavailable position. Never trap the player.
  // Explain why location is requested and offer an organizer-approved fallback.
  console.info("Location unavailable; offer a retry or manual check-in.");
}
```

## Result contract

- **`arrived`** — distance is within the configured radius and reported accuracy is acceptable. Show arrival, but validate protected rewards server-side.
- **`outside_radius`** — the fix is usable but outside the radius. Show a neutral retry prompt.
- **`stale_position` / `future_timestamp` / `invalid_timestamp`** — reject a fix whose timestamp is too old, in the future, or not a valid finite number; request a fresh fix and offer recovery.
- **`poor_accuracy`** — reported accuracy exceeds the configured maximum. Ask the player to wait or move to a clearer area, then retry.
- **`invalid_target` / `invalid_position`** — coordinates or accuracy are malformed. Fail closed and offer recovery.
- **`invalid_configuration`** — radius or accuracy configuration is invalid. Treat this as a developer/configuration error, not a player failure.

## Design and safety notes

- **Accuracy is not a guarantee.** Browser-reported accuracy is an estimate. The radius and accuracy threshold must be tested against the target devices and environment.
- **Client checks are not authorization.** A player can modify browser code or fabricate coordinates. Never trust this result to grant paid content, prizes, purchases, or durable leaderboard changes. The server must independently validate authorization and submissions.
- **Permission denial is a normal state.** Explain the purpose before requesting location. Provide a safe retry path and an organizer-approved manual alternative where game rules allow it; do not make a permission prompt the only way out.
- **Minimize collection.** This module does not persist or transmit coordinates. Avoid logging precise location or retaining location histories unless strictly necessary, disclosed, and governed by an appropriate retention policy.
- **Use safe public locations.** Do not place objectives on private property, roadways, hazardous terrain, restricted facilities, or places that encourage trespass. Check accessibility, opening hours, and local rules before publishing a route.
- **Do not treat geofencing as proof of physical presence.** GPS drift, indoor attenuation, spoofing, and device variation are expected failure modes.
