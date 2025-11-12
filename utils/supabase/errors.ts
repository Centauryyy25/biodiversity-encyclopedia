export function isMissingTableError(error: any, table: string) {
  const msg = typeof error?.message === 'string' ? error.message : ''
  const code = typeof error?.code === 'string' ? error.code : ''
  return (
    code === '42P01' ||
    msg.includes(`table '${table}'`) ||
    msg.includes(`relation "${table}" does not exist`) ||
    msg.includes('schema cache')
  )
}

