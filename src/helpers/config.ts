import { defaultConfig } from '../data/config'
import { setupWizard } from '../helpers/setup'
import type { Preset } from '../types/preset'
import { getConfig, saveConfig } from '../utils/file'
import { write } from '../utils/log'

/**
 * Ensures that the configuration is set up correctly.
 * @returns {Promise<void>} A promise that resolves when the configuration is set up.
 */
export const ensureConfig = async (): Promise<void> => {
  const config = getConfig()
  if (
    config === undefined ||
    !config.configFile ||
    config.shouldPush === undefined ||
    config.shouldPublish === undefined
  ) {
    await setupWizard({ bypass: false })
  }
}

/**
 * Stores the publish configuration in the publish-config.json file.
 * @param {string} projectType - The registry to publish to.
 * @param {boolean} isPackage - Whether the project is a package.
 * @param {boolean} shouldPush - Whether to push changes automatically.
 * @param {boolean} shouldPublish - Whether to publish the package automatically.
 * @returns {boolean} Whether the configuration was saved successfully.
 */
export const storePublishConfig = (
  configFile: string,
  shouldPush: boolean,
  shouldPublish: boolean,
  publish: Preset
): boolean => {
  const config = getConfig() || defaultConfig

  config.configFile = configFile
  config.shouldPush = shouldPush
  config.shouldPublish = shouldPublish
  config.publish = publish

  try {
    saveConfig(config)
    return true
  } catch (error: unknown) {
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}\n`,
      variant: 'error'
    })
    return false
  }
}
