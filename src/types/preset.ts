export type Preset = {
  name: string
  command: string
  options: string[]
}

export type PresetsConfig = {
  [key: string]: {
    publish: Preset
  }
}
