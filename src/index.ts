import fs from 'node:fs'
import simpleGit, { type SimpleGit } from 'simple-git'
import semver from 'semver'
import { exec } from 'node:child_process'
import { write } from './utils/log'
import inquirer from 'inquirer'
import ora from 'ora'
import { getConfig, saveConfig } from './utils/file'

const git: SimpleGit = simpleGit()

const config = getConfig().publishConfig

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

const askProjectType = async (): Promise<boolean> => {
  const { isPackage } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isPackage',
      message: 'Is this project a package that needs to be published?',
      default: true
    }
  ])
  return isPackage
}

const askAutomaticPush = async (): Promise<boolean> => {
  const { shouldPush } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldPush',
      message: 'Do you want to automatically push changes after versioning?',
      default: true
    }
  ])
  return shouldPush
}

const askAutomaticPublish = async (): Promise<boolean> => {
  const { shouldPublish } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldPublish',
      message:
        'Do you want to automatically publish the package after versioning?',
      default: true
    }
  ])
  return shouldPublish
}

const askPublishLocation = async (): Promise<string> => {
  const { publishTo } = await inquirer.prompt([
    {
      type: 'list',
      name: 'publishTo',
      message: 'Where would you like to publish?',
      choices: ['npm', 'jsr'],
      default: 'npm'
    }
  ])
  return publishTo
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const askCredentials = async (publishTo: string): Promise<any> => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let credentials: Record<string, any> = {}

  if (publishTo === 'npm') {
    credentials = askOtp()
  } else if (publishTo === 'jsr') {
    credentials = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Enter your JSR username:'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your JSR password:'
      }
    ])
    storePublishConfig()
  }

  return credentials
}

const storePublishConfig = (
  isPackage?: boolean,
  publishTo?: string,
  shouldPush?: boolean,
  shouldPublish?: boolean,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  credentials?: Record<string, any>
): void => {
  config.publishConfig = {
    isPackage,
    publishTo,
    shouldPush,
    shouldPublish,
    commands: {
      npm: {
        publish: 'npm publish'
      },
      jsr: {
        publish: `jsr publish --username=${credentials?.username} --password=${credentials?.password}`
      }
    }
  }
  saveConfig(config)
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
const publishPackage = (command: string): Promise<void> => {
  const spinner = ora('Publishing package...').start()

  return new Promise((resolve, reject) => {
    const { publishTo } = config

    if (!publishTo) {
      spinner.fail('Publish configuration missing.')
      return reject(new Error('Publish configuration missing'))
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        spinner.fail('Failed to publish package')
        write({
          message: `Error: ${stderr || error.message}`,
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
 * @param {boolean} [shouldPush=false] - Whether to push the changes automatically after versioning.
 * @param {boolean} [shouldPublish=false] - Whether to publish the package automatically after versioning.
 * @returns {Promise<string>} A promise that resolves to the new version.
 */
export const automateVersioning = async (
  bumpType: 'major' | 'minor' | 'patch'
): Promise<string> => {
  await ensureConfig()
  const { isPackage, publishTo, shouldPush, shouldPublish } = config

  const spinner = ora('Automating versioning...').start()

  const newVersion = bumpVersion(bumpType)
  updateVersionInPackageJson(newVersion)
  await commitAndTagRelease(newVersion)

  spinner.succeed('Versioning complete')

  if (shouldPush) {
    await pushChanges()
  }

  if (isPackage) {
    await handlePackagePublishing(publishTo, shouldPublish)
  }

  return newVersion
}

const ensureConfig = async (): Promise<void> => {
  if (
    !config.isPackage ||
    !config.publishTo ||
    !config.shouldPush ||
    !config.shouldPublish
  ) {
    const isPackage = await askProjectType()
    const publishTo = isPackage ? await askPublishLocation() : ''
    const shouldPublish = isPackage ? await askAutomaticPublish() : false
    const shouldPush = await askAutomaticPush()

    storePublishConfig(isPackage, publishTo, shouldPush, shouldPublish)
  }
}

const handlePackagePublishing = async (
  publishTo: string,
  shouldPublish: boolean
): Promise<void> => {
  const credentials = await askCredentials(publishTo)
  storePublishConfig(undefined, publishTo)

  const command =
    publishTo === 'npm'
      ? `${config.publishConfig.commands.npm.publish} ${credentials?.otp ? `--otp=${credentials.otp}` : ''}`
      : config.publishConfig.commands.jsr.publish

  if (shouldPublish) {
    await publishPackage(command)
  }
}
