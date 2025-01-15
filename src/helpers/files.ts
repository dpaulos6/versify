import path from 'node:path'
import fs from 'node:fs'
import { files } from '../data/files'
import { write } from '../utils/log'
import inquirer from 'inquirer'
import { getConfig } from '../utils/file'

export const findConfigFiles = async (
  bypass?: boolean
): Promise<{
  configFile: string
  publish: string
}> => {
  if (!bypass) {
    const config = getConfig()
    if (config !== undefined && config.configFile !== undefined) {
      return {
        configFile: config.configFile,
        publish: config.publish.name
      }
    }
  }

  const currentDir = process.cwd()
  const foundFiles: string[] = []
  let filePath = ''
  let publishProvider = ''

  for (const file of files) {
    const filePath = path.join(currentDir, file.name)
    if (fs.existsSync(filePath)) {
      foundFiles.push(path.basename(filePath))
      if (!publishProvider) {
        publishProvider = file.publish
      } else if (publishProvider !== file.publish) {
        write({
          message: 'Warning: Two different publisher files found.',
          variant: 'warning'
        })
      }
    }
  }

  if (foundFiles.length > 1) {
    const { selectedFile } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedFile',
        message:
          'Multiple publisher files found. Which one do you want to use?',
        choices: foundFiles.map((file) => ({
          name: path.basename(file),
          value: path.basename(file)
        }))
      }
    ])
    filePath = selectedFile
  }

  const configData = {
    configFile: filePath,
    publish: publishProvider
  }

  return configData
}
