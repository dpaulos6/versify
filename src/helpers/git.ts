import ora from 'ora'
import simpleGit from 'simple-git'
import { getConfig } from '../utils/file'
import { write } from '../utils/log'

export const git = simpleGit()

/**
 * Pushes changes and tags to the remote repository.
 * @returns {Promise<void>} A promise that resolves when the push is complete.
 */
export const pushChanges = async (): Promise<void> => {
  const config = getConfig()
  if (!config) {
    write({
      message: 'Configuration not found. Please run the setup wizard.',
      variant: 'error'
    })
    process.exit(1)
  }

  const spinnerChanges = ora('Pushing changes to remote repository...').start()
  try {
    await git.push('origin', 'main')
    spinnerChanges.succeed('Pushed changes to remote repository.')
  } catch (error: unknown) {
    spinnerChanges.fail('Failed to push changes to remote repository.')
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}\nStack: ${
        error instanceof Error ? error.stack : 'N/A'
      }`,
      variant: 'error'
    })
    process.exit(1)
  }

  const spinnerTags = ora('Checking for tags to push...').start()
  try {
    const tags = await git.tags()
    if (tags.all.length > 0) {
      await git.push('origin', '--tags')
      spinnerTags.succeed('Pushed tags to remote repository.')
    } else {
      spinnerTags.info('No tags to push.')
    }
  } catch (error: unknown) {
    spinnerTags.fail('Failed to push tags to remote repository.')
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}\nStack: ${
        error instanceof Error ? error.stack : 'N/A'
      }`,
      variant: 'error'
    })
    process.exit(1)
  }
}

/**
 * Commits and tags the release in Git.
 * @param {string} version - The new version to tag.
 * @returns {Promise<void>} A promise that resolves when the commit and tag are complete.
 */
export const commitAndTagRelease = async (version: string): Promise<void> => {
  const spinner = ora('Committing and tagging release...').start()

  try {
    await git.add('./*')
    await git.commit(`chore(release): ${version}`)
    await git.addTag(version)
    spinner.succeed(`Committed and tagged release ${version}`)
  } catch (error: unknown) {
    spinner.fail('Failed to commit and tag release.')
    write({
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      variant: 'error'
    })
    process.exit(1)
  }
}
