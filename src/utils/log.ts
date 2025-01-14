type Variant = 'info' | 'success' | 'warning' | 'error'

export const write = async ({
  message,
  variant
}: { message: string; variant: Variant }) => {
  // Dynamically import chalk
  const { default: chalk } = await import('chalk')

  // Map variants to chalk functions
  const variantColors: Record<Variant, (text: string) => string> = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red
  }

  // Get the appropriate chalk function and apply it to the message
  const colorize = variantColors[variant] || chalk.white

  // Write the colorized message with a newline
  process.stdout.write(`${colorize(message)}\n`)
}
