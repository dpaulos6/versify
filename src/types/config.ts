export type Config = {
  isPackage: boolean
  shouldPush: boolean
  shouldPublish: boolean
  publish: {
    name: string
    command: string
    options?: string[]
  }
  useGitCredentials: boolean
  gitCredentials?: {
    username: string
    email: string
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
  },
  useGitCredentials: false,
  gitCredentials: {
    username: '',
    email: ''
  }
}
