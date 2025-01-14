import * as fs from 'node:fs'
import * as path from 'node:path'

// Define the path to the configuration file (you can modify this to a different location if needed)
const configFilePath = path.join(__dirname, '..', 'config.json')

// Function to read the existing config or return an empty object if not found
export const getConfig = (): Record<string, any> => {
  if (fs.existsSync(configFilePath)) {
    const config = fs.readFileSync(configFilePath, 'utf-8')
    return JSON.parse(config)
  }
  return {}
}

// Function to save the config to the local file system
export const saveConfig = (config: Record<string, any>): void => {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))
}
