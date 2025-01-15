import { program } from 'commander'
import { automateVersioning } from './'
import {} from './utils/file'
import { write } from './utils/log'
import { setupWizard } from './helpers/setup'

program.name('versify').usage('<command> [options]').version('2.0.0')

program
  .command('bump <type>')
  .description('Bump the version (major, minor, patch)')
  .option('-d, --default', 'Use default preferences')
  .action(async (type: 'major' | 'minor' | 'patch', options) => {
    if (!['major', 'minor', 'patch'].includes(type)) {
      write({
        message: 'Invalid version type. Please use major, minor, or patch.',
        variant: 'error'
      })
      process.exit(1)
    }

    const newVersion = await automateVersioning(type, options)

    write({
      message: `Bumped version to ${newVersion}\n`,
      variant: 'success'
    })
  })

program
  .command('setup')
  .description('Runs the setup wizard')
  .action(async () => {
    await setupWizard({ bypass: true })
  })

program.parse(process.argv)
