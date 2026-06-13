/**
 * ISO Week utilities for "Best of the Week" feature
 */

/**
 * Get the ISO week number for a given date
 * ISO 8601: Week 1 is the week containing January 4th
 */
export function getISOWeekNumber(date: Date): number {
  const d = new Date(date.getTime())
  d.setHours(0, 0, 0, 0)
  // Set to nearest Thursday: current date + 4 - current day number (make Sunday day 7)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  )
  return weekNo
}

/**
 * Get the ISO week year for a given date
 * Note: ISO week year may differ from calendar year at year boundaries
 */
export function getISOWeekYear(date: Date): number {
  const d = new Date(date.getTime())
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  return d.getFullYear()
}

/**
 * Format a date as an ISO week string (e.g., "2024-W48")
 */
export function formatISOWeek(date: Date): string {
  const year = getISOWeekYear(date)
  const week = getISOWeekNumber(date)
  return `${year}-W${week.toString().padStart(2, "0")}`
}

/**
 * Get the current ISO week string
 */
export function getCurrentISOWeek(): string {
  return formatISOWeek(new Date())
}

/**
 * Parse an ISO week string to get the start date (Monday) of that week
 */
export function parseISOWeekToDate(isoWeek: string): Date {
  const match = isoWeek.match(/^(\d{4})-W(\d{2})$/)
  if (!match) {
    throw new Error(`Invalid ISO week format: ${isoWeek}`)
  }

  const year = parseInt(match[1]!, 10)
  const weekNum = parseInt(match[2]!, 10)

  // Calculate the start of the ISO week (Monday)
  // ISO week 1 is the week containing January 4th
  const jan4 = new Date(year, 0, 4)
  const jan4DayOfWeek = jan4.getDay() || 7 // Convert Sunday (0) to 7
  const firstMonday = new Date(jan4)
  firstMonday.setDate(jan4.getDate() - jan4DayOfWeek + 1)

  const weekStart = new Date(firstMonday)
  weekStart.setDate(firstMonday.getDate() + (weekNum - 1) * 7)
  weekStart.setHours(0, 0, 0, 0)

  return weekStart
}

/**
 * Get the week date range for an ISO week string (inclusive end, for display)
 */
export function getWeekDateRange(isoWeek: string): { start: Date; end: Date } {
  const start = parseISOWeekToDate(isoWeek)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

/**
 * Get the week date range for database queries (exclusive end)
 * Returns weekStart (Monday 00:00:00) and weekEnd (next Monday 00:00:00)
 */
export function getWeekDateRangeForQuery(isoWeek: string): { weekStart: Date; weekEnd: Date } {
  const weekStart = parseISOWeekToDate(isoWeek)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  weekEnd.setHours(0, 0, 0, 0)

  return { weekStart, weekEnd }
}

/**
 * Get the previous ISO week string
 */
export function getPreviousISOWeek(isoWeek: string): string {
  const currentStart = parseISOWeekToDate(isoWeek)
  const prevWeekDate = new Date(currentStart)
  prevWeekDate.setDate(currentStart.getDate() - 7)
  return formatISOWeek(prevWeekDate)
}

/**
 * Get the next ISO week string
 */
export function getNextISOWeek(isoWeek: string): string {
  const currentStart = parseISOWeekToDate(isoWeek)
  const nextWeekDate = new Date(currentStart)
  nextWeekDate.setDate(currentStart.getDate() + 7)
  return formatISOWeek(nextWeekDate)
}

/**
 * Check if an ISO week is in the future
 */
export function isWeekInFuture(isoWeek: string): boolean {
  const currentWeek = getCurrentISOWeek()
  return isoWeek > currentWeek
}

/**
 * Check if an ISO week is the current week
 */
export function isCurrentWeek(isoWeek: string): boolean {
  return isoWeek === getCurrentISOWeek()
}

/**
 * Validate an ISO week string format
 */
export function isValidISOWeek(isoWeek: string): boolean {
  if (!/^\d{4}-W\d{2}$/.test(isoWeek)) {
    return false
  }

  const match = isoWeek.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return false

  const weekNum = parseInt(match[2]!, 10)
  // ISO week numbers are 1-52 or 1-53 (some years have 53 weeks)
  return weekNum >= 1 && weekNum <= 53
}

/**
 * Format week range for display (e.g., "Dec 2 - Dec 8, 2024")
 */
export function formatWeekRangeDisplay(isoWeek: string): string {
  const { start, end } = getWeekDateRange(isoWeek)

  const startMonth = start.toLocaleString("en-US", { month: "short" })
  const startDay = start.getDate()
  const endMonth = end.toLocaleString("en-US", { month: "short" })
  const endDay = end.getDate()
  const year = end.getFullYear()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
}

/**
 * Get week display label (e.g., "Week 48, 2024")
 */
export function getWeekDisplayLabel(isoWeek: string): string {
  const match = isoWeek.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return isoWeek

  const year = match[1]
  const weekNum = parseInt(match[2]!, 10)
  return `Week ${weekNum}, ${year}`
}

/**
 * Get short week label (e.g., "W48")
 */
export function getShortWeekLabel(isoWeek: string): string {
  const match = isoWeek.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return isoWeek

  const weekNum = parseInt(match[2]!, 10)
  return `W${weekNum}`
}

/**
 * Generate list of recent weeks (up to current week)
 * @param count Number of weeks to generate
 * @returns Array of ISO week strings, most recent first
 */
export function getRecentWeeks(count: number = 20): string[] {
  const weeks: string[] = []
  const currentWeek = getCurrentISOWeek()
  let week = currentWeek

  for (let i = 0; i < count; i++) {
    weeks.push(week)
    week = getPreviousISOWeek(week)
  }

  return weeks
}

/**
 * Generate list of all weeks from October 2024 to current week
 * @returns Array of ISO week strings, most recent first
 */
export function getWeeksSinceOctober2024(): string[] {
  const weeks: string[] = []
  const currentWeek = getCurrentISOWeek()
  const startWeek = "2024-W40" // October 2024 starts around week 40
  
  let week = currentWeek
  
  // Generate weeks from current back to October 2024
  while (week >= startWeek) {
    weeks.push(week)
    week = getPreviousISOWeek(week)
  }

  return weeks
}

