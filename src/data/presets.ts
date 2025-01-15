import type { PresetsConfig } from '../types/preset'

export const presets: PresetsConfig = {
  npm: {
    publish: {
      name: 'npm',
      command: 'npm publish',
      options: ['--otp']
    }
  },
  jsr: {
    publish: {
      name: 'jsr',
      command: 'jsr publish',
      options: []
    }
  }
}
