import { defaultConfig } from '../data/config'
import { setupWizard } from '../helpers/setup'
import type { Preset } from '../types/preset'
import { getConfig, saveConfig } from '../utils/file'
import { write } from '../utils/log'

/**
 * Ensures that the configuration is properly initialized.
 * If the config is missing or incomplete, triggers the setup wizard.
 *
 * @returns {Promise<void>} A promise that resolves when the setup completes.
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
 * Stores the publish configuration in the selected config file.
 *
 * @param {string} configFile - The full path to the configuration file.
 * @param {boolean} shouldPush - Whether to automatically push after versioning.
 * @param {boolean} shouldPublish - Whether to automatically publish after versioning.
 * @param {Preset} publish - The publish provider configuration preset.
 * @returns {boolean} True if config was saved successfully, false otherwise.
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
