# npm-stuff README

npm-stuff is a Visual Studio Code extension inspired by [npm-dependency-links](https://github.com/herrmannplatz/npm-dependency-links), but with its own evolving feature set. The extension has been updated to use Node.js 24 and ESM, diverging from the original yo/generator-code template. More features are planned for future releases.

## Features

- Turns dependencies in `package.json` into clickable links. Clicking a link with CMD/Ctrl opens the npm page for the dependency package.
- Shows a project-level status bar alert when dependency drift suggests `npm install` is required after git sync/branch changes.
- Supports migration alerts only when `prisma` is present in dependencies/devDependencies; currently Prisma ORM is the only implemented migration provider and migration status relies on Prisma tooling.
- Not all functionality from npm-dependency-links is implemented; this extension is evolving independently.
- Unique features and improvements may be added over time.

## Planned Features

- Additional enhancements and support for other ORMs may be added in the future based on requests.

## Requirements

- These requirements apply only if you want to build/compile the extension from source.
- Node.js 24 is required.
- Extension uses ESM modules.
- Migrated from yo/generator-code template.

## Extension Settings

This extension contributes the following settings:

- `npm-stuff.alwaysShowAlerts.enabled` (default: `true`): Show npm-stuff status bar alerts even when no active warning is present.
- `npm-stuff.dependenciesLinks.enabled` (default: `true`): Enable or disable links for dependencies in `package.json`.
- `npm-stuff.dependenciesLinks.registryUrl` (default: `https://www.npmjs.com/package/`): Registry URL used for package links.
- `npm-stuff.dependenciesAlerts.enabled` (default: `true`): Enable or disable project-level alerts when dependencies changed after git sync.
- `npm-stuff.migrationAlerts.enabled` (default: `true`): Enable migration alerts for projects that include `prisma` in `dependencies` or `devDependencies`.

## Known Issues

- Please report any issues or feature requests via the repository.

## Release Notes

For the full release history, see [CHANGELOG.md](./CHANGELOG.md).

### Latest Releases

- **0.0.6 (2026-02-18):** Added project-level `npm install` drift alerts with status bar and alert commands.
- **0.0.5 (2026-02-18):** Updated VS Code engine requirement to `^1.107.0` for compatibility with current Google Antigravity.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details. No liability or warranty is provided.
