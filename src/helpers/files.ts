import path from 'node:path'
import fs from 'node:fs'
import { files } from '../data/files'
import { write } from '../utils/log'
import inquirer from 'inquirer'

export const findConfigFiles = async (): Promise<{
  configFile: string
  publish: string
}> => {
  const currentDir = process.cwd()
  const foundFiles: string[] = []
  let filePath = ''
  let publishProvider = ''

  for (const file of files) {
    const filePath = path.join(currentDir, file.name)
    if (fs.existsSync(filePath)) {
      foundFiles.push(filePath)
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
          value: files.find((f) => f.name === path.basename(file))?.publish
        }))
      }
    ])
    filePath = foundFiles[selectedFile]
    publishProvider = selectedFile
  }

  const config = {
    configFile: filePath,
    publish: publishProvider
  }

  return config
}
