import { write } from '../utils/log'
import { storePublishConfig } from '../helpers/config'
import { askAutomaticPublish, askAutomaticPush } from '../helpers/questions'
import { findConfigFiles } from '../helpers/files'
import { presets } from '../data/presets'

/**
 * Interactive setup wizard to initialize config and preferences.
 * Guides the user through questions and saves the result to a config file.
 *
 * @param {Object} options - Setup options.
 * @param {boolean} [options.bypass] - If true, bypasses existing config and forces full setup.
 * @returns {Promise<void>} A promise that resolves when setup is completed or fails.
 */
export const setupWizard = async ({
  bypass
}: { bypass?: boolean }): Promise<void> => {
  try {
    const setupFiles = await findConfigFiles(bypass)
    const configFile = setupFiles.configFile
    const publish = presets[setupFiles.publish].publish

    const shouldPublish = await askAutomaticPublish()
    const shouldPush = await askAutomaticPush()

    const success = storePublishConfig(
      configFile,
      shouldPush,
      shouldPublish,
      publish
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
