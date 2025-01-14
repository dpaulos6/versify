# Versioning Automation CLI

A Command Line Interface (CLI) tool for automating version bumps and Git tagging in your projects. This tool bumps your version based on Semantic Versioning (SemVer) principles and commits and tags the new version in Git.

## Installation

You can install the tool globally via npm:

```bash
npm install -g @dpaulos6/autover
```

## Usage

After installing, you can use the `autover` command to bump the version of your project and tag the release in Git.

### Bump the version

To bump the version, run the following command:

```bash
autover bump <type>
```

Where `<type>` can be one of the following:

- `major`: Increments the major version (e.g., `1.0.0` → `2.0.0`).
- `minor`: Increments the minor version (e.g., `1.1.0` → `1.2.0`).
- `patch`: Increments the patch version (e.g., `1.1.1` → `1.1.2`).

### Example

To bump the major version:

```bash
autover bump major
```

This will:

1. Read the current version from `package.json`.
2. Increment the version based on the specified type (major, minor, or patch).
3. Update `package.json` with the new version.
4. Commit all changes to Git with a message `chore: release version <new_version`>.
5. Tag the release in Git with the new version.

### Example Error

If an invalid version type is provided, you will see an error message like this:

```bash
Error: Please provide a valid bump type (major, minor, patch).
```

### Commit and Tagging

The version bump command will also create a Git commit with the following message format:

```bash
chore: release version <new_version>
```

Additionally, it will create a Git tag for the new version, which can be used to track releases.

### Example of a Commit and Tag

For a bump type of `patch`, the commit message will look like:

```bash
chore: release version 1.1.2
```

The Git tag will be applied as:

```bash
1.1.2
```

## License

MIT License. See [LICENSE](../LICENSE) for details.
