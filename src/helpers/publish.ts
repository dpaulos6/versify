import { getConfig } from '../utils/file'
import { askOtp } from '../helpers/questions'
import ora from 'ora'
import { exec } from 'node:child_process'
import { write } from '../utils/log'

/**
 * Publishes the package to the registry using the configuration from the publish-config.json.
 * @param {string} command - The command to execute for publishing.
 * @returns {Promise<void>} A promise that resolves when the package has been successfully published, or rejects if an error occurs during the process.
 */
export const publishPackage = (command: string): Promise<void> => {
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
 * Handles the package publishing process.
 * @param {boolean} shouldPublish - Whether to publish the package.
 * @returns {Promise<void>} A promise that resolves when the package has been published, or rejects if an error occurs during the process.
 */
export const handlePackagePublishing = async (): Promise<void> => {
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

    await publishPackage(await command)
  }
}
