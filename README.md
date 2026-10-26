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

A **location games cookbook** for quest design: checkpoints, geofenced objectives, kit-gated content, and leaderboards. This is the cookbook only ZQM Labs could write — patterns for games played in real places, drawn from the Hunt for Wisps style of play: small quests, seasonal editions, and family-friendly objectives. It is intended for designers of location-based games. Validate each pattern against your own game and operating environment before adopting it. Examples use synthetic places and synthetic players only — never real player data, and never anything describing player telemetry.

## Repository role and status

**Status:** Active, public — seeding. Pattern passes land in follow-up work; the table below lists what is planned, not what is already written.

**What this repository is:** Location-game design patterns — quests, geofencing, kit gating, and leaderboards.

**What it contributes:** Part of the ZQM Labs game-development portfolio, and a sibling to the ZQM Computing geospatial cookbook series.

**Standing:** This repository is maintained independently. Automated checks cover only the paths and environments configured in its workflows; they do not establish production readiness or operational certification.

## Who this is for

Designers of location-based games, especially family-friendly quests in real places.

## Prerequisites

- A web game client with map and geolocation support
- Synthetic quest content for examples (no real player data, no real private places)
- A backend for kits and leaderboards if running gated or scored quests (see pocketbase-cookbook)

## Patterns (planned)

| # | Example | What it will demonstrate |
|---|---------|--------------------------|
| 01 | `01-checkpoint-quest` | A checkpoint quest: ordered stops, arrival checks, and completion |
| 02 | `02-geofenced-objective` | Geofenced objectives with arrival radius, drift tolerance, and failure behavior |
| 03 | `03-kit-gated-content` | Kit-gated quests: purchase, unlock, and access checks |
| 04 | `04-leaderboard-seasonal` | Seasonal leaderboards and limited-window editions (e.g. a Halloween window) |

## Repository layout

```text
location-games-cookbook/
├── examples/  # one directory per pattern
├── README.md
└── LICENSE
```

## Roadmap

- First pattern pass: checkpoint quest (01), then geofenced objectives (02)
- Second pass: kit gating (03) and seasonal leaderboards (04)

## Contributing

A contributing guide lands with the first pattern pass. Report security issues to <zqmcomputing@gmail.com> — please do not open a public issue for those.
