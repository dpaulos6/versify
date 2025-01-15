export type Config = {
  configFile: string
  shouldPush: boolean
  shouldPublish: boolean
  publish: {
    name: string
    command: string
    options?: string[]
  }
}
