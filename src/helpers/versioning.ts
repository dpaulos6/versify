import fs from 'node:fs'
import semver from 'semver'
import { getConfig } from '../utils/file'
import { write } from '../utils/log'

/**
 * Gets the current version from the package.json file.
 * @returns {string} The current version.
 */
export const getCurrentVersion = (): string => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return packageJson.version
}

/**
 * Updates the version in the specified config file.
 * @param {string} newVersion - The new version to set.
 * @returns {void}
 */
export const updateVersion = (newVersion: string): void => {
  const config = getConfig()
  if (config === undefined || config.configFile === undefined) {
    return
  }

  try {
    const fileContent = JSON.parse(fs.readFileSync(config.configFile, 'utf8'))
    fileContent.version = newVersion
    fs.writeFileSync(config.configFile, JSON.stringify(fileContent, null, 2))
  } catch (error: unknown) {
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      variant: 'error'
    })
  }
}

/**
 * Bumps the version in the package.json file.
 * @param {'major' | 'minor' | 'patch'} type - The type of version bump.
 * @returns {string} The new version.
 * @throws {Error} If the version bump is invalid.
 */
export const bumpVersion = (type: 'major' | 'minor' | 'patch'): string => {
  const currentVersion = getCurrentVersion()
  const newVersion = semver.inc(currentVersion, type)
  if (!newVersion) {
    throw new Error('Invalid version bump')
  }
  return newVersion
}
