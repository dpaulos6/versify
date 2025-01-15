import type { Config } from '../types/config'

export const defaultConfig: Config = {
  isPackage: false,
  shouldPush: false,
  shouldPublish: false,
  publish: {
    name: 'npm',
    command: 'npm publish',
    options: ['--otp']
  }
}
