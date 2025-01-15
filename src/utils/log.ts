import * as fs from 'node:fs'
import * as path from 'node:path'
import type chalk from 'chalk'
import { info, success, warning, error, text, debug } from '../config/chalk'

type Variant = 'info' | 'success' | 'warning' | 'error' | 'debug'

export const write = ({
  message,
  variant
}: { message: string; variant: Variant }) => {
  const variantColors: Record<Variant, chalk.Chalk> = {
    info: info,
    success: success,
    warning: warning,
    error: error,
    debug: debug
  }

  process.stdout.write(
    `${variantColors[variant](variant.toUpperCase())}: ${text(message)}\n`
  )
}

const logFilePath = path.join(__dirname, '..', './log.txt')

/**
 * Writes a log message to the log file.
 * @param {Object} log - The log object containing the message and variant.
 * @param {string} log.message - The log message.
 * @param {string} log.variant - The log variant (info, success, warning, error).
 * @returns {void}
 */
export const log = ({
  message,
  variant
}: { message: string; variant: string }): void => {
  const logMessage = `[${new Date().toISOString()}] [${variant.toUpperCase().slice(0, 4)}] ${message}\n`
  fs.appendFileSync(logFilePath, logMessage)
}
