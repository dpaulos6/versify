import fs from 'node:fs'
import simpleGit, { type SimpleGit } from 'simple-git'
import semver from 'semver'

// Create a Git instance
const git: SimpleGit = simpleGit()

// Function to read the current version from package.json
const getCurrentVersion = (): string => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return packageJson.version
}

// Function to bump the version based on the type (major, minor, patch)
const bumpVersion = (type: 'major' | 'minor' | 'patch'): string => {
  const currentVersion = getCurrentVersion()
  const newVersion = semver.inc(currentVersion, type)
  if (!newVersion) {
    throw new Error('Invalid version bump')
  }
  return newVersion
}

// Function to update the version in package.json
const updateVersionInPackageJson = (newVersion: string): void => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  packageJson.version = newVersion
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
}

// Function to commit and tag the new version
const commitAndTagRelease = async (newVersion: string): Promise<void> => {
  await git
    .add('./*')
    .commit(`chore: release version ${newVersion}`)
    .tag([newVersion], (err) => {
      if (err) {
        console.error('Error tagging release:', err)
        process.exit(1)
      }
      console.log(`Release ${newVersion} tagged successfully.`)
    })
}

// Function to push the changes and tags to the remote repository
const pushChanges = async (): Promise<void> => {
  await git.push('origin', 'main', ['--follow-tags'])
  console.log('Changes and tags pushed to remote.')
}

// Main function to automate versioning with optional push
export const automateVersioning = async (
  bumpType: 'major' | 'minor' | 'patch',
  push = false // Default to false, push only if true
): Promise<void> => {
  const newVersion = bumpVersion(bumpType)
  updateVersionInPackageJson(newVersion)
  await commitAndTagRelease(newVersion)

  if (push) {
    await pushChanges()
  }

  console.log(`Version bumped to ${newVersion} and tagged in Git.`)
}
