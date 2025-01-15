# Versioning Automation CLI

A Command Line Interface (CLI) tool for automating version bumps, Git tagging, and package publishing in your projects. This tool bumps your version based on Semantic Versioning (SemVer) principles, commits and tags the new version in Git, and optionally publishes the package.

## Installation

You can install the tool globally via npm:

```bash
npm install -g @dpaulos6/versify
```

## Usage

After installing, you can use the `versify` command to bump the version of your project, tag the release in Git, and optionally publish the package.

### Bump the version

To bump the version, run the following command:

```bash
versify bump <type>
```

Where `<type>` can be one of the following:

- `major`: Increments the major version (e.g., `1.0.0` → `2.0.0`).
- `minor`: Increments the minor version (e.g., `1.1.0` → `1.2.0`).
- `patch`: Increments the patch version (e.g., `1.1.1` → `1.1.2`).

### Example

To bump the major version:

```bash
versify bump major
```

This will:

1. Read the current version from `package.json`.
2. Increment the version based on the specified type (major, minor, or patch).
3. Update `package.json` with the new version.
4. Commit all changes to Git with a message `chore: release version <new_version>`.
5. Tag the release in Git with the new version.
6. Optionally push changes to the remote repository.
7. Optionally publish the package if configured.

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

You can manually push changes and tags by running:

```bash
git push && git push --tags
```

### Package Publishing

If your project is a package that needs to be published, you can configure the tool to automatically publish the package after versioning.

### Configuration

When you run the tool for the first time, you will be prompted to save your configuration settings in a configuration file. The settings include:

1. Do you want to automatically publish the package after versioning?
2. Do you want to automatically push changes after versioning?

If the cli founds more than one configuration file (`package.json`, `deno.json`, `jsr.json`, ...), it will prompt you to choose one of them and will use that file for next version bumps.

You can always change the file by running the setup wizard:

```bash
versify setup
```

The configuration will be saved in a `config.json` file in your project directory.

### Example Configuration File

The base configuration is as follows:

```json
{
  "configFile": "package.json",
  "shouldPush": false,
  "shouldPublish": false,
  "publish": {
    "name": "npm",
    "command": "npm publish",
    "options": [
      "--otp"
    ]
  }
}
```

If you want to use default configuration even if you already setup your configuration file, do so by running:

```bash
versify bump minor -d # use flag -d or --default to ignore your saved configuration and use defaults
```

### Package Publishing Commands

The tool supports publishing to npm and jsr:

- `npm` with One-Time Password (OTP) (Will be asked during the version bump process).
- `jsr` with browser based authentication. (Might not work as expected or even crash due to not being 100% tested yet.)

## License

MIT License. See [LICENSE](LICENSE) for details.
