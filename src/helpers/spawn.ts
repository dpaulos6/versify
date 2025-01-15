import { spawn } from 'node:child_process'

export const spawnAsync = (command: string, args: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const process = spawn(command, args)
    process.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(`Process failed with code ${code}`)
      }
    })
  })
}
