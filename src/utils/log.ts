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

  process.stdout.write(`${icon} ${chalk.white(message)}`)
}
