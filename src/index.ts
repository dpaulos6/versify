import fs from 'node:fs'
import simpleGit, { type SimpleGit } from 'simple-git'
import semver from 'semver'
import { exec } from 'node:child_process'
import { write } from './utils/log'
import inquirer from 'inquirer'
import ora from 'ora'
import { getConfig, saveConfig } from './utils/file'
import { presets } from './data/presets'

const git: SimpleGit = simpleGit()

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

export const storePublishConfig = (
  isPackage: boolean,
  publishTo: string,
  shouldPush: boolean,
  shouldPublish: boolean
): boolean => {
  const config = getConfig() || {
    isPackage: false,
    shouldPush: false,
    shouldPublish: false,
    publish: {
      name: '',
      command: '',
      options: []
    }
  }

  config.isPackage = isPackage
  config.shouldPush = shouldPush
  config.shouldPublish = shouldPublish

  const publishConfig = presets[publishTo]
    ? presets[publishTo].publish
    : config.publish

  config.publish = {
    name: publishTo ? publishConfig.name : '',
    command: publishTo ? publishConfig.command : '',
    options: publishTo ? publishConfig.options : []
  }

  try {
    saveConfig(config)
    return true
  } catch (error: unknown) {
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}\nStack: ${
        error instanceof Error ? error.stack : 'N/A'
      }`,
      variant: 'error'
    })
    return false
  }
}

/**
 * Pushes changes and tags to the remote repository.
 * @returns {Promise<void>} A promise that resolves when the push is complete.
 */
const pushChanges = async (): Promise<void> => {
  const spinnerChanges = ora('Pushing changes to remote repository...').start()
  try {
    await git.push('origin', 'main')
    spinnerChanges.succeed('Pushed changes to remote repository.')
  } catch (error: unknown) {
    spinnerChanges.fail('Failed to push changes to remote repository.')
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}\nStack: ${
        error instanceof Error ? error.stack : 'N/A'
      }`,
      variant: 'error'
    })
    process.exit(1)
  }

  const spinnerTags = ora('Checking for tags to push...').start()
  try {
    const tags = await git.tags()
    if (tags.all.length > 0) {
      await git.push('origin', '--tags')
      spinnerTags.succeed('Pushed tags to remote repository.')
    } else {
      spinnerTags.info('No tags to push.')
    }
  } catch (error: unknown) {
    spinnerTags.fail('Failed to push tags to remote repository.')
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}\nStack: ${
        error instanceof Error ? error.stack : 'N/A'
      }`,
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
 * @param {string} command - The command to execute for publishing.
 * @returns {Promise<void>} A promise that resolves when the package has been successfully published, or rejects if an error occurs during the process.
 */
const publishPackage = (command: string): Promise<void> => {
  const spinner = ora('Publishing package...').start()

  return new Promise((resolve, reject) => {
    exec(command, (error, stderr) => {
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
  const config = getConfig()
  if (config !== undefined) {
    const { isPackage, shouldPush, shouldPublish } = config

    const spinner = ora('Automating versioning...\n').start()

    const newVersion = bumpVersion(bumpType)
    updateVersionInPackageJson(newVersion)
    await commitAndTagRelease(newVersion)

    spinner.succeed('Versioning complete')

    if (shouldPush) {
      await pushChanges()
    }

    if (isPackage) {
      await handlePackagePublishing(shouldPublish)
    }

    return newVersion
  }
  process.exit(1)
}

export const setupWizard = async (): Promise<void> => {
  try {
    const isPackage = await askProjectType()
    const publishTo = isPackage ? await askPublishLocation() : ''
    const shouldPublish = isPackage ? await askAutomaticPublish() : false
    const shouldPush = await askAutomaticPush()

    const success = storePublishConfig(
      isPackage,
      publishTo,
      shouldPush,
      shouldPublish
    )

    if (success) {
      write({
        message: 'Setup completed successfully.',
        variant: 'success'
      })
    } else {
      write({
        message: 'Setup failed. Please try again.',
        variant: 'error'
      })
    }
  } catch (error: unknown) {
    write({
      message: `Setup encountered an error: ${error instanceof Error ? error.message : String(error)}`,
      variant: 'error'
    })
  }
}

const ensureConfig = async (): Promise<void> => {
  const config = getConfig()
  if (
    config === undefined ||
    !config.isPackage ||
    !config.shouldPush ||
    !config.shouldPublish
  ) {
    await setupWizard()
  }
}

const handlePackagePublishing = async (
  shouldPublish: boolean
): Promise<void> => {
  const config = getConfig()

  if (config !== undefined) {
    const command = (async () => {
      const publishCommand = config.publish.command
      const options = config.publish.options ?? []
      let commandString = publishCommand

      if (options[0] === '--otp') {
        const otp = await askOtp()
        commandString += ` ${options[0]}=${otp}`
      }

      return commandString
    })()

    if (shouldPublish) {
      await publishPackage(await command)
    }
  }
}
