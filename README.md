# Location Games Cookbook

<!-- ZQM-START -->
<!-- markdownlint-disable MD033 -->
<p align="center">
  <strong>ZQM Labs</strong><br>
  <a href="https://github.com/ZQM-Labs">ZQM Labs</a>
</p>
<!-- markdownlint-enable MD033 -->
<!-- ZQM-END -->

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A **location games cookbook** for quest design: checkpoints, geofenced objectives, kit-gated content, and leaderboards. This is the cookbook only ZQM Labs could write — practical patterns for games played in real places, drawn from the Hunt for Wisps style of play: small quests, seasonal editions, and family-friendly objectives. Examples use synthetic coordinates and synthetic players only. Never commit real player data, precise private locations, credentials, or telemetry.

## Repository role and status

**Status:** Active, public — first executable pattern available. The pattern list distinguishes implemented content from planned work.

**What this repository is:** Location-game design patterns — quest progression, geofencing, kit gating, safety, and seasonal leaderboards.

**What it contributes:** Part of the ZQM Labs game-development portfolio. It complements, rather than duplicates, the ZQM Computing geospatial cookbook series: this repository focuses on player experience and operational rules for games played in real places.

**Quality bar:** Examples should be runnable, deterministic where possible, explicit about assumptions, and honest about client-side limitations. Automated checks cover only configured paths and environments; passing them is not production certification.

## Who this is for

Designers and developers building location-based games, especially family-friendly quests in public, accessible places.

## Prerequisites

- A web game client with map and geolocation support
- Node.js 20+ for the checkpoint example tests
- Synthetic quest content for examples (no real player data or private places)
- A backend for kit access and durable leaderboards if running gated or scored quests (see the [PocketBase Cookbook](https://github.com/ZQM-Labs/pocketbase-cookbook))

## Patterns

### 01 — Checkpoint quest (implemented)

[Open the checkpoint recipe](examples/01-checkpoint-quest/). Includes ordered-stop foundations, great-circle distance, accuracy thresholds, explicit error states, deterministic tests, browser integration, and safe fallback guidance.

### 02 — Freshness-aware geofenced objective (implemented helper)

The checkpoint recipe now includes `geofence.js`, which rejects stale and future-dated fixes before delegating to the existing distance/accuracy evaluator. It includes deterministic tests for fix freshness and documents retry/fallback behavior. This is a client-side evaluation helper, not proof of physical presence or authorization.

### 03 — Kit-gated content (planned)

Purchase-to-unlock flow with server-side authorization boundaries and replay-safe unlock operations.

### 04 — Seasonal leaderboard (planned)

Season windows, server-side score validation, closing behavior, and privacy-aware rankings.

## Quick start

Run the implemented checkpoint example tests:

```sh
cd examples/01-checkpoint-quest
npm test
```

The implementation has no third-party dependencies. See the [checkpoint recipe](examples/01-checkpoint-quest/README.md) for browser integration, result statuses, limitations, and safety guidance.

## Repository layout

```text
location-games-cookbook/
├── .github/workflows/examples.yml
├── examples/
│   └── 01-checkpoint-quest/
│       ├── checkpoint.js
│       ├── checkpoint.test.mjs
│       ├── geofence.js
│       ├── geofence.test.mjs
│       ├── package.json
│       └── README.md
├── README.md
└── LICENSE
```

## Engineering and safety principles

- Treat geolocation as a fallible sensor, not a source of truth.
- Explain location permission requests and provide retry and approved manual-recovery paths.
- Never rely on client-side checks to authorize paid content, prizes, or durable score changes.
- Use public, permitted, accessible locations; do not encourage trespass or unsafe movement.
- Minimize precise location collection, avoid unnecessary retention, and use synthetic data in examples.
- Pin dependencies only when a pattern actually needs them; document tested versions and reproduce commands.
- State what was tested. Do not imply runtime or production validation from documentation-only review.

## Roadmap

1. Add a geofenced-objective pattern covering GPS drift, poor accuracy, timeouts, and accessible fallback.
2. Add a kit-gated content example that demonstrates server-side authorization and replay-safe unlocks.
3. Add a seasonal leaderboard example with server-side score validation, close times, and privacy controls.
4. Expand CI to validate Markdown links and every new executable pattern as the cookbook grows.

## Contributing

Contributions should include a runnable example or a clearly scoped design recipe, exact test commands, synthetic data, known limitations, and a short safety/privacy review. Keep changes focused and avoid presenting planned patterns as implemented.

Report security issues to <zqmcomputing@gmail.com> — please do not open a public issue for those.
