import { program } from 'commander'
import { automateVersioning } from './index'

program.name('autover').usage('<command> [options]')

program
  .command('bump <type>')
  .description('Bump the version (major, minor, patch)')
  .option('--push', 'Push changes and tags to remote')
  .option('--publish', 'Publish the package after version bump')
  .action(async (type: 'major' | 'minor' | 'patch', options) => {
    if (!['major', 'minor', 'patch'].includes(type)) {
      console.error(
        'Error: Please provide a valid bump type (major, minor, patch).'
      )
      process.exit(1)
    }

    // Automate versioning
    const newVersion = await automateVersioning(
      type,
      options.push,
      options.publish
    )

    // Print the bumped version
    console.log(`Version bumped to ${newVersion}`)
  })

program.parse(process.argv)
