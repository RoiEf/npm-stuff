# Agent Notes

## Changelog maintenance policy

- `CHANGELOG.md` must follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Keep exactly one top-level `# Changelog` heading.
- Keep this structure:
  - Intro paragraph
  - Keep a Changelog + SemVer statement
  - `## [Unreleased]` at the top of release entries
  - Version sections in reverse chronological order using `## [x.y.z] - YYYY-MM-DD`
  - Change-type subsections only (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`)
- Do not leave template boilerplate or duplicate headings.
- Move completed unreleased entries into a new version section when releasing.

## README release notes policy

- `README.md` should include:
  - A link to `CHANGELOG.md` for full history.
  - A short `Latest Releases` summary with only the most recent 2 entries.
- When `CHANGELOG.md` gets a new release section, update the README summary in the same change.
- Keep README release bullets concise (one line per release).

## Agent checklist for release-note edits

1. Update `CHANGELOG.md` first.
2. Verify Keep a Changelog section order and headings.
3. Update `README.md` latest 2 releases and changelog link.
4. Confirm no stale template text remains.
