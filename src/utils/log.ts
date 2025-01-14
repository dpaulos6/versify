import * as fs from 'node:fs'
import * as path from 'node:path'
import chalk from 'chalk'

type Variant = 'info' | 'success' | 'warning' | 'error'

export const write = ({
  message,
  variant
}: { message: string; variant: Variant }) => {
  const variantIcons: Record<Variant, string> = {
    info: `${chalk.blue('ℹ️')}`,
    success: `${chalk.green('✔')}`,
    warning: `${chalk.yellow('⚠️')}`,
    error: `${chalk.red('❌')}`
  }
  const icon = variantIcons[variant]

  process.stdout.write(`${icon} ${chalk.white(message)}\n`)
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
