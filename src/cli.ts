import { program } from 'commander'
import inquirer from 'inquirer'
import { automateVersioning } from './index'
import { getConfig, saveConfig } from './utils/file' // Import file utility functions
import { write } from './utils/log'

program.name('autover').usage('<command> [options]').version('1.3.6')

program
  .command('bump <type>')
  .description('Bump the version (major, minor, patch)')
  .option('--push', 'Push changes and tags to remote')
  .option('--publish', 'Publish the package after version bump')
  .action(async (type: 'major' | 'minor' | 'patch') => {
    if (!['major', 'minor', 'patch'].includes(type)) {
      write({
        message: 'Invalid version type. Please use major, minor, or patch.',
        variant: 'error'
      })
      process.exit(1)
    }

    const config = getConfig()

    if (!config.push || !config.publish) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'push',
          message:
            'Would you like to automatically push changes and tags to remote?',
          default: false
        },
        {
          type: 'confirm',
          name: 'publish',
          message:
            'Would you like to automatically publish the package after the version bump?',
          default: false
        }
      ])

      config.push = answers.push
      config.publish = answers.publish
      saveConfig(config)
    }

    const newVersion = await automateVersioning(
      type,
      config.push,
      config.publish
    )

    write({
      message: `Bumped version to ${newVersion}`,
      variant: 'success'
    })
  })

program.parse(process.argv)
