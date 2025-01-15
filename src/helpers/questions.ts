import inquirer from 'inquirer'

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
