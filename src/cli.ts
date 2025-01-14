#!/usr/bin/env node
import { program } from 'commander'
import { automateVersioning } from './index'

program
  .command('bump <type>')
  .description('Bump the version (major, minor, patch)')
  .action(async (type: 'major' | 'minor' | 'patch') => {
    if (!['major', 'minor', 'patch'].includes(type)) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error(
        'Error: Please provide a valid bump type (major, minor, patch).'
      )
      process.exit(1)
    }
    await automateVersioning(type)
  })

program.parse(process.argv)
