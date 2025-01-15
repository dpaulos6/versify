import { write } from '../utils/log'
import { storePublishConfig } from '../helpers/config'
import { askAutomaticPublish, askAutomaticPush } from '../helpers/questions'
import { findConfigFiles } from '../helpers/files'
import { presets } from '../data/presets'

export const setupWizard = async (): Promise<void> => {
  try {
    const setupFiles = await findConfigFiles()
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
