import type { Config } from '../types/config'

export const defaultConfig: Config = {
  configFile: 'package.json',
  shouldPush: false,
  shouldPublish: false,
  publish: {
    name: 'npm',
    command: 'npm publish',
    options: ['--otp']
  }
}
