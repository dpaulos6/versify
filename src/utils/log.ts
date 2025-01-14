type Variant = 'info' | 'success' | 'warning' | 'error'

export const write = ({
  message,
  variant
}: { message: string; variant: Variant }) => {
  const chalk = require('chalk')
  switch (variant) {
    case 'info':
      process.stdout.write(chalk.blue(message))
      break
    case 'success':
      process.stdout.write(chalk.green(message))
      break
    case 'warning':
      process.stdout.write(chalk.yellow(message))
      break
    case 'error':
      process.stdout.write(chalk.red(message))
      break
    default:
      process.stdout.write(chalk.white(message))
      break
  }
}
