import chalk from 'chalk'

type Variant = 'info' | 'success' | 'warning' | 'error'

export const write = ({
  message,
  variant
}: { message: string; variant: Variant }) => {
  const variantColors: Record<Variant, (text: string) => string> = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red
  }

  const colorize = variantColors[variant] || chalk.white

  process.stdout.write(`${colorize(message)}\n`)
}
