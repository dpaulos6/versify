import { program } from 'commander'
import { automateVersioning } from './index'

program.name('autover').usage('<command> [options]')

program
  .command('bump <type>')
  .description('Bump the version (major, minor, patch)')
  .option('--push', 'Push changes and tags to remote')
  .action(
    async (type: 'major' | 'minor' | 'patch', options: { push: boolean }) => {
      if (!['major', 'minor', 'patch'].includes(type)) {
        console.error(
          'Error: Please provide a valid bump type (major, minor, patch).'
        )
        process.exit(1)
      }

      // Pass the `--push` flag to automateVersioning
      await automateVersioning(type, options.push)
    }
  )

program.parse(process.argv)
