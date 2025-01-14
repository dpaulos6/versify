import * as fs from 'node:fs'
import * as path from 'node:path'
import { write } from './log'

const configFilePath = path.join(__dirname, '..', './config.json')

/**
 * Reads the configuration file. If the file does not exist, it creates a default configuration file.
 * @returns {Record<string, any>} The configuration object.
 */
export const getConfig = (): Record<string, any> => {
  if (fs.existsSync(configFilePath)) {
    try {
      const config = fs.readFileSync(configFilePath, 'utf-8')
      return JSON.parse(config)
    } catch (error) {
      write({
        message: `Error reading config file: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'error'
      })
    }
  } else {
    write({
      message: 'Config file does not exist. Creating default config file.',
      variant: 'warning'
    })
    const defaultConfig = createDefaultConfig()
    saveConfig(defaultConfig)
    return defaultConfig
  }
  return {}
}

/**
 * Saves the configuration object to the configuration file.
 * @param {Record<string, any>} config - The configuration object to save.
 * @returns {void}
 */
export const saveConfig = (config: Record<string, any>): void => {
  try {
    const directory = path.dirname(configFilePath)
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))
  } catch (error) {
    write({
      message: `Error saving config file: ${error instanceof Error ? error.message : String(error)}`,
      variant: 'error'
    })
  }
}

/**
 * Creates a default configuration object.
 * @returns {Record<string, any>} The default configuration object.
 */
const createDefaultConfig = (): Record<string, any> => {
  return {
    publishConfig: {
      isPackage: true,
      publishTo: 'npm',
      shouldPush: true,
      shouldPublish: true,
      commands: {
        npm: {
          publish: 'npm publish',
          options: ['--otp']
        },
        jsr: {
          publish: 'jsr publish',
          options: ['--username', '--password']
        }
      }
    }
  }
}
