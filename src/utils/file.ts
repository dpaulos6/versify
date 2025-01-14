import * as fs from 'node:fs'
import * as path from 'node:path'

const configFilePath = path.join(__dirname, '..', 'config.json')

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getConfig = (): Record<string, any> => {
  if (fs.existsSync(configFilePath)) {
    const config = fs.readFileSync(configFilePath, 'utf-8')
    return JSON.parse(config)
  }
  return {}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const saveConfig = (config: Record<string, any>): void => {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))
}
