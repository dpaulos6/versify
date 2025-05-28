import inquirer from 'inquirer'

/**
 * Prompts the user to enter a one-time password (OTP).
 *
 * @returns {Promise<string>} The OTP entered by the user.
 */
export const askOtp = async (): Promise<string> => {
  const { otp } = await inquirer.prompt([
    {
      type: 'input',
      name: 'otp',
      message: 'Please enter your OTP:',
      default: ''
    }
  ])
  return otp
}

/**
 * Asks the user if the project is a package that needs to be published.
 *
 * @returns {Promise<boolean>} True if it's a package, false otherwise.
 */
export const askIsPackage = async (): Promise<boolean> => {
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

/**
 * Asks the user whether they want to automatically push changes after versioning.
 *
 * @returns {Promise<boolean>} True if auto-push is enabled, false otherwise.
 */
export const askAutomaticPush = async (): Promise<boolean> => {
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

/**
 * Asks the user whether they want to automatically publish after versioning.
 *
 * @returns {Promise<boolean>} True if auto-publish is enabled, false otherwise.
 */
export const askAutomaticPublish = async (): Promise<boolean> => {
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
