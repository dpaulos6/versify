import chalk from 'chalk'

type Variant = 'info' | 'success' | 'warning' | 'error'

export const write = ({
  message,
  variant
}: { message: string; variant: Variant }) => {
  const variantIcons: Record<Variant, string> = {
    info: 'ℹ️',
    success: '✔️',
    warning: '⚠️',
    error: '❌'
  }
  const icon = variantIcons[variant]

  process.stdout.write(chalk.white(`${icon} ${message}`))
}
