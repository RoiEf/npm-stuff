# npm-stuff README

npm-stuff is a Visual Studio Code extension inspired by [npm-dependency-links](https://github.com/herrmannplatz/npm-dependency-links), but with its own evolving feature set. The extension has been updated to use Node.js 24 and ESM, diverging from the original yo/generator-code template. More features are planned for future releases.

## Features

- Turns dependencies in `package.json` into clickable links. Clicking a link with CMD/Ctrl opens the npm page for the dependency package.
- Not all functionality from npm-dependency-links is implemented; this extension is evolving independently.
- Unique features and improvements may be added over time.

## Planned Features

- Detect when `npm install` is needed after syncing with git (e.g., after running `git pull` if dependencies have changed).
- Additional enhancements and features are planned—stay tuned!

## Requirements

- Node.js 24 is required.
- Extension uses ESM modules.
- Migrated from yo/generator-code template.

## Extension Settings

This extension contributes the following setting:

- `NPM Stuff Configuration: registryUrl` (default: `https://www.npmjs.com/package/`): Registry URL to be used for package links.

## Known Issues

- Please report any issues or feature requests via the repository.

## Release Notes

### 0.0.1

- Initial release based on npm-dependency-links.

- Migrated to Node.js 24 and ESM. Added dependency link feature.

### Upcoming

- Planned: npm install detection after git pull.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details. No liability or warranty is provided.
