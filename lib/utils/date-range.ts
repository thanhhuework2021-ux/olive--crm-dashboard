export function getDateRange(range: string) {
  const now = new Date()

  let from = new Date()
  let to = new Date()

  switch (range) {
    case "today":
      from.setHours(0, 0, 0, 0)
      break

    case "yesterday":
      from.setDate(from.getDate() - 1)
      from.setHours(0, 0, 0, 0)

      to = new Date(from)
      to.setHours(23, 59, 59, 999)

      return { from, to }

    case "7d":
      from.setDate(from.getDate() - 6)
      from.setHours(0, 0, 0, 0)
      break

    case "30d":
    default:
      from.setDate(from.getDate() - 29)
      from.setHours(0, 0, 0, 0)
      break
  }

  return {
    from,
    to: now,
  }
}
