# Versioning Automation CLI

A Command Line Interface (CLI) tool for automating version bumps, Git tagging, and package publishing in your projects. This tool bumps your version based on Semantic Versioning (SemVer) principles, commits and tags the new version in Git, and optionally publishes the package.

## Warning

JSR is still a work in progress, it will not work if you try to use JSR.

## Installation

You can install the tool globally via npm:

```bash
npm install -g @dpaulos6/autover
```

## Usage

After installing, you can use the `autover` command to bump the version of your project, tag the release in Git, and optionally publish the package.

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

1. Is this project a package that needs to be published?
2. Where would you like to publish? (e.g., npm, jsr)
3. Do you want to automatically publish the package after versioning?
4. Do you want to automatically push changes after versioning?

The configuration will be saved in a `config.json` file in your project directory.

### Example Configuration File

The base configuration from `file.ts` is as follows:

```json
{
  "publishConfig": {
    "isPackage": true,
    "publishTo": "npm",
    "shouldPush": true,
    "shouldPublish": true,
    "commands": {
      "npm": {
        "publish": "npm publish",
        "options": ["--otp"]
      },
      "jsr": {
        "publish": "jsr publish",
        "options": ["--username", "--password"]
      }
    }
  }
}
```

### Package Publishing Commands

The tool supports publishing to npm and jsr with the following commands:

- [`npm publish`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5Ccoding%5C%5Cautover%5C%5Csrc%5C%5Cutils%5C%5Cfile.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2Fcoding%2Fautover%2Fsrc%2Futils%2Ffile.ts%22%2C%22path%22%3A%22%2Fc%3A%2Fcoding%2Fautover%2Fsrc%2Futils%2Ffile.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A67%2C%22character%22%3A10%7D%5D "src/utils/file.ts") with `--otp` option for One-Time Password (OTP).
- [`jsr publish`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5Ccoding%5C%5Cautover%5C%5Csrc%5C%5Cutils%5C%5Cfile.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2Fcoding%2Fautover%2Fsrc%2Futils%2Ffile.ts%22%2C%22path%22%3A%22%2Fc%3A%2Fcoding%2Fautover%2Fsrc%2Futils%2Ffile.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A67%2C%22character%22%3A10%7D%5D "src/utils/file.ts") with `--username` and `--password` options for credentials.

## License

MIT License. See [LICENSE](../LICENSE) for details.