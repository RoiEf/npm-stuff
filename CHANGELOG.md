# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Planned: Detect when a Prisma ORM database migration is needed after `git pull`.

## [0.0.6] - 2026-02-18

### Added

- Added project-level dependency alerts to indicate when `npm install` is required after dependency drift.
- Added dependency alert commands for running `npm install` and manual refresh.

### Changed

- Refactored extension code into feature modules for dependency links and dependency alerts.
- Added stricter detection logic for meaningful `overrides` entries.

## [0.0.5] - 2026-02-18

### Changed

- Downgraded VS Code engine requirement to `^1.107.0` to support the current version of Google Antigravity.

## [0.0.1] - 2026-02-17

### Added

- Initial release.
- Added clickable npm package links for dependencies, including `overrides` entries.
