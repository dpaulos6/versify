import * as fs from 'node:fs'
import * as path from 'node:path'
import { write } from './log'
import type { Config } from '../types/config'

const configFilePath = path.join(__dirname, '..', './config.json')

/**
 * Reads the configuration file and parses it into a JavaScript object.
 * If the configuration file does not exist, it creates a default configuration file.
 * @returns {Config | undefined} The parsed configuration object, or undefined if an error occurred.
 */
export const getConfig = (): Config | undefined => {
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
      message: 'Config file does not exist. Creating a config file.',
      variant: 'warning'
    })
    createDefaultConfig()
  }
  return undefined
}

/**
 * Saves the configuration object to the configuration file.
 * @param {Config} config - The configuration object to save.
 * @returns {void}
 */
export const saveConfig = (config: Config): void => {
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
const createDefaultConfig = (): Config => {
  const configPath = path.resolve(__dirname, 'config.json')
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}, null, 2))
  }
  return undefined as unknown as Config
}
