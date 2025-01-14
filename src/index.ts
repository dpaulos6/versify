import fs from 'node:fs'
import simpleGit, { type SimpleGit } from 'simple-git'
import semver from 'semver'
import { exec } from 'node:child_process'
import { write } from './utils/log'
import inquirer from 'inquirer'
import ora from 'ora' // Import ora for loading spinners

const git: SimpleGit = simpleGit()

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

const askOtp = (): Promise<string> => {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'otp',
        message: 'Please enter your OTP (leave blank if not needed):',
        default: ''
      }
    ])
    .then((answers) => answers.otp)
}

/**
 * Pushes changes and tags to the remote repository.
 * @returns {Promise<void>} A promise that resolves when the push is complete.
 */
const pushChanges = async (): Promise<void> => {
  const spinner = ora('Pushing changes to remote repository...').start()

  try {
    await git.push('origin', 'main', ['--follow-tags'])
    spinner.succeed('Pushed changes to remote repository.')
  } catch (error: unknown) {
    spinner.fail('Failed to push changes to remote repository.')
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      variant: 'error'
    })
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
  const spinner = ora('Committing and tagging release...').start()

  try {
    await git.add('./*')
    await git.commit(`chore(release): ${version}`)
    await git.addTag(version)
    spinner.succeed(`Committed and tagged release ${version}`)
  } catch (error: unknown) {
    spinner.fail('Failed to commit and tag release.')
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      variant: 'error'
    })
    process.exit(1)
  }
}

/**
 * Publishes the package to the registry using the configuration from the publish-config.json.
 * @param {string} [otp] - The one-time password (OTP) from the authenticator app, required if 2FA is enabled on your npm account.
 * @returns {Promise<void>} A promise that resolves when the package has been successfully published, or rejects if an error occurs during the process.
 */
const publishPackage = (otp?: string): Promise<void> => {
  const spinner = ora('Publishing package...').start()

  return new Promise((resolve, reject) => {
    const { publish } = config

    if (!publish) {
      write({
        message: 'Publishing is disabled in the configuration file.',
        variant: 'warning'
      })
      spinner.succeed('Publishing is disabled.')
      return resolve()
    }

    const commandWithOtp = otp ? `npm publish --otp=${otp}` : 'npm publish'

    exec(commandWithOtp, (error) => {
      if (error) {
        spinner.fail('Failed to publish package')
        write({
          message: 'Failed to publish package',
          variant: 'error'
        })
        return reject(error)
      }
      spinner.succeed('Package published successfully')
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
    const otp = otpCode || (await askOtp())
    await publishPackage(otp)
  }

  return newVersion
}
