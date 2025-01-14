export type Config = {
  isPackage: boolean
  shouldPush: boolean
  shouldPublish: boolean
  publish: {
    name: string
    command: string
    options?: string[]
  }
}

export const defaultConfig = {
  isPackage: false,
  shouldPush: false,
  shouldPublish: false,
  publish: {
    name: 'npm',
    command: 'npm publish',
    options: ['--otp']
  }
}
