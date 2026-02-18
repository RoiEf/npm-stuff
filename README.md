# npm-stuff README

npm-stuff is a Visual Studio Code extension inspired by [npm-dependency-links](https://github.com/herrmannplatz/npm-dependency-links), but with its own evolving feature set. The extension has been updated to use Node.js 24 and ESM, diverging from the original yo/generator-code template. More features are planned for future releases.

## Features

- Turns dependencies in `package.json` into clickable links. Clicking a link with CMD/Ctrl opens the npm page for the dependency package.
- Shows a project-level status bar alert when dependency drift suggests `npm install` is required after git sync/branch changes.
- Not all functionality from npm-dependency-links is implemented; this extension is evolving independently.
- Unique features and improvements may be added over time.

## Planned Features

- Detect when a Prisma ORM database migration is needed after `git pull`.
- Additional enhancements and features are planned—stay tuned!

## Requirements

- Node.js 24 is required.
- Extension uses ESM modules.
- Migrated from yo/generator-code template.

## Extension Settings

This extension contributes the following settings:

- `npm-stuff.dependenciesLinks.enabled` (default: `true`): Enable or disable links for dependencies in `package.json`.
- `npm-stuff.dependenciesLinks.registryUrl` (default: `https://www.npmjs.com/package/`): Registry URL used for package links.
- `npm-stuff.dependenciesAlerts.enabled` (default: `true`): Enable or disable project-level alerts when dependencies changed after git sync.
- `npm-stuff.dependenciesAlerts.alwaysShow.enable` (default: `true`): Show the project dependency status item even when no out-of-sync warning is active.

## Known Issues

- Please report any issues or feature requests via the repository.

## Release Notes

For the full release history, see [CHANGELOG.md](./CHANGELOG.md).

### Latest Releases

- **0.0.6 (2026-02-18):** Added project-level `npm install` drift alerts with status bar and alert commands.
- **0.0.5 (2026-02-18):** Updated VS Code engine requirement to `^1.107.0` for compatibility with current Google Antigravity.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details. No liability or warranty is provided.
