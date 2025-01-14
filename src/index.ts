import fs from 'node:fs'
import simpleGit, { type SimpleGit } from 'simple-git'
import semver from 'semver'
import { exec } from 'node:child_process'

const git: SimpleGit = simpleGit()

// Load config from a JSON file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

/**
 * Pushes changes and tags to the remote repository.
 * @returns {Promise<void>} A promise that resolves when the push is complete.
 */
const pushChanges = async (): Promise<void> => {
  try {
    await git.push('origin', 'main', ['--follow-tags'])
    console.log('Changes and tags pushed to remote.')
  } catch (error) {
    console.error('Error pushing changes:', error)
    process.exit(1)
  }
}

/**
 * Gets the current version from the package.json file.
 * @returns {string} The current version.
 */
const getCurrentVersion = (): string => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return packageJson.version
}

/**
 * Bumps the version in the package.json file.
 * @param {'major' | 'minor' | 'patch'} type - The type of version bump.
 * @returns {string} The new version.
 * @throws {Error} If the version bump is invalid.
 */
const bumpVersion = (type: 'major' | 'minor' | 'patch'): string => {
  const currentVersion = getCurrentVersion()
  const newVersion = semver.inc(currentVersion, type)
  if (!newVersion) {
    throw new Error('Invalid version bump')
  }
  return newVersion
}

/**
 * Updates the version in the package.json file.
 * @param {string} newVersion - The new version to set.
 * @returns {void}
 */
const updateVersionInPackageJson = (newVersion: string): void => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  packageJson.version = newVersion
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
}

/**
 * Commits and tags the release in Git.
 * @param {string} version - The new version to tag.
 * @returns {Promise<void>} A promise that resolves when the commit and tag are complete.
 */
const commitAndTagRelease = async (version: string): Promise<void> => {
  try {
    await git.add('./*')
    await git.commit(`chore(release): ${version}`)
    await git.addTag(version)
    await pushChanges() // Push the commit and tag
    console.log(`Release ${version} tagged and pushed.`)
  } catch (error) {
    console.error('Error during Git commit/tag:', error)
    process.exit(1)
  }
}

/**
 * Publishes the package to the registry using the configuration from the publish-config.json.
 *
 * This function constructs and executes the `npm publish` command based on the configuration options.
 * If Two-Factor Authentication (2FA) is required, an OTP can be provided as an argument.
 *
 * @param {string} [otp] - The one-time password (OTP) from the authenticator app, required if 2FA is enabled on your npm account.
 * @returns {Promise<void>} A promise that resolves when the package has been successfully published, or rejects if an error occurs during the process.
 *
 * @example
 * // Publishing with OTP
 * publishPackage("123456")
 *   .then(() => console.log("Package published successfully"))
 *   .catch(err => console.error("Failed to publish package", err));
 */
const publishPackage = (otp?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!config.publish.enabled) {
      console.log('Publish is disabled in the configuration.')
      return resolve() // Skip publishing if disabled
    }

    const { command, registry, options } = config.publish
    const publishCommand = `${command} --registry ${registry}`

    // Add OTP to command if available
    const commandWithOtp = otp
      ? `${publishCommand} --otp=${otp}`
      : publishCommand

    // Add additional options to the command
    const commandWithOptions = Object.keys(options).reduce((cmd, key) => {
      const optionValue = options[key]
      return optionValue ? `${cmd} --${key}=${optionValue}` : cmd
    }, commandWithOtp)

    exec(commandWithOptions, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error publishing package: ${stderr}`)
        return reject(error)
      }
      console.log(`Package published: ${stdout}`)
      resolve()
    })
  })
}

/**
 * Automates the versioning process.
 * @param {'major' | 'minor' | 'patch'} bumpType - The type of version bump.
 * @param {boolean} [shouldPublish=false] - Whether to publish the package after versioning.
 * @returns {Promise<string>} A promise that resolves to the new version.
 */
export const automateVersioning = async (
  bumpType: 'major' | 'minor' | 'patch',
  shouldPush = false,
  shouldPublish = false,
  otpCode = ''
): Promise<string> => {
  const newVersion = bumpVersion(bumpType)
  updateVersionInPackageJson(newVersion)
  await commitAndTagRelease(newVersion)

  if (shouldPush) {
    await pushChanges()
  }

  if (shouldPublish) {
    await publishPackage(otpCode)
  }

  return newVersion
}
