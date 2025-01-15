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
