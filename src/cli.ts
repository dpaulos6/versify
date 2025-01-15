import { program } from 'commander'
import { automateVersioning, setupWizard } from '@/index'
import {} from '@/utils/file'
import { write } from '@/utils/log'

program.name('autover').usage('<command> [options]').version('2.0.0')

program
  .command('bump <type>')
  .description('Bump the version (major, minor, patch)')
  .action(async (type: 'major' | 'minor' | 'patch') => {
    if (!['major', 'minor', 'patch'].includes(type)) {
      write({
        message: 'Invalid version type. Please use major, minor, or patch.',
        variant: 'error'
      })
      process.exit(1)
    }

    const newVersion = await automateVersioning(type)

    write({
      message: `Bumped version to ${newVersion}\n`,
      variant: 'success'
    })
  })

program
  .command('setup')
  .description('Runs the setup wizard')
  .action(async () => {
    await setupWizard()
  })

program.parse(process.argv)
