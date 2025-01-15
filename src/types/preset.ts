export type Preset = {
  publish: {
    name: string
    command: string
    options: string[]
  }
}

export type PresetsConfig = {
  [key: string]: Preset
}
