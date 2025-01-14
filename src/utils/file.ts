import * as fs from 'node:fs'
import * as path from 'node:path'
import { write } from './log'

const configFilePath = path.join(__dirname, '..', './config.json')

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
  try {
    const directory = path.dirname(configFilePath)
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))
  } catch (error) {
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      variant: 'error'
    })
  }
}
