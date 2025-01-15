import { write } from './utils/log'
import { getConfig } from './utils/file'
import { defaultConfig } from './data/config'
import type { Config } from './types/config'
import {} from './helpers/questions'
import { handlePackagePublishing } from './helpers/publish'
import { ensureConfig } from './helpers/config'
import { bumpVersion, updateVersion } from './helpers/versioning'
import { commitAndTagRelease, pushChanges } from './helpers/git'

/**
 * Automates the versioning process.
 * @param {'major' | 'minor' | 'patch'} bumpType - The type of version bump.
 * @param {boolean} [shouldPush=false] - Whether to push the changes automatically after versioning.
 * @param {boolean} [shouldPublish=false] - Whether to publish the package automatically after versioning.
 * @returns {Promise<string>} A promise that resolves to the new version.
 */
export const automateVersioning = async (
  bumpType: 'major' | 'minor' | 'patch',
  options: { default: boolean }
): Promise<string> => {
  let config: Config | undefined

  if (options.default) {
    config = defaultConfig
  } else {
    await ensureConfig()
    config = getConfig()
  }

  if (config !== undefined) {
    const { shouldPush, shouldPublish } = config

    write({
      message: 'Starting versioning process...',
      variant: 'info'
    })

    const newVersion = bumpVersion(bumpType)
    updateVersion(newVersion)
    await commitAndTagRelease(newVersion)

    if (shouldPush) {
      await pushChanges()
    }

    if (shouldPublish) {
      await handlePackagePublishing()
    }

    return newVersion
  }

  process.exit(1)
}
