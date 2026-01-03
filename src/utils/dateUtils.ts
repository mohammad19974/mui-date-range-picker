import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday as isTodayFn,
  isWithinInterval,
  isBefore,
  isAfter,
  addMonths,
  subMonths,
  addDays,
  subDays,
  format,
  getDay,
  isWeekend as isWeekendFn,
  startOfDay,
  endOfDay,
  type Locale,
} from 'date-fns'
import type { DateRange, DayState } from '../types'

/**
 * Get all days to display in a calendar month view
 * Includes days from previous and next months to fill the grid
 */
export function getCalendarDays(
  month: Date,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn })

  return eachDayOfInterval({ start, end })
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
  if (!range.startDate || !range.endDate) return false

  return isWithinInterval(date, {
    start: startOfDay(range.startDate),
    end: endOfDay(range.endDate),
  })
}

/**
 * Check if a date is the start of a range
 */
export function isRangeStart(date: Date, range: DateRange): boolean {
  if (!range.startDate) return false
  return isSameDay(date, range.startDate)
}

/**
 * Check if a date is the end of a range
 */
export function isRangeEnd(date: Date, range: DateRange): boolean {
  if (!range.endDate) return false
  return isSameDay(date, range.endDate)
}

/**
 * Check if a date is selected (either start or end)
 */
export function isDateSelected(date: Date, range: DateRange): boolean {
  return isRangeStart(date, range) || isRangeEnd(date, range)
}

/**
 * Check if a date is disabled
 */
export function isDateDisabled(
  date: Date,
  options: {
    minDate?: Date
    maxDate?: Date
    disabledDates?: Date[]
    disabledDaysOfWeek?: number[]
  }
): boolean {
  const { minDate, maxDate, disabledDates, disabledDaysOfWeek } = options

  // Check min date
  if (minDate && isBefore(date, startOfDay(minDate))) {
    return true
  }

  // Check max date
  if (maxDate && isAfter(date, endOfDay(maxDate))) {
    return true
  }

  // Check disabled dates
  if (disabledDates?.some((d) => isSameDay(date, d))) {
    return true
  }

  // Check disabled days of week
  if (disabledDaysOfWeek?.includes(getDay(date))) {
    return true
  }

  return false
}

/**
 * Get the state of a day for rendering
 */
export function getDayState(
  date: Date,
  currentMonth: Date,
  value: DateRange,
  hoveredDate: Date | null,
  options: {
    minDate?: Date
    maxDate?: Date
    disabledDates?: Date[]
    disabledDaysOfWeek?: number[]
  }
): DayState {
  // Calculate hover range
  let effectiveRange = value
  if (value.startDate && !value.endDate && hoveredDate) {
    // When selecting end date, show preview range
    const isHoveredAfterStart = isAfter(hoveredDate, value.startDate)
    effectiveRange = {
      startDate: isHoveredAfterStart ? value.startDate : hoveredDate,
      endDate: isHoveredAfterStart ? hoveredDate : value.startDate,
    }
  }

  return {
    date,
    isToday: isTodayFn(date),
    isSelected: isDateSelected(date, value),
    isRangeStart: isRangeStart(date, effectiveRange),
    isRangeEnd: isRangeEnd(date, effectiveRange),
    isInRange: isDateInRange(date, effectiveRange),
    isDisabled: isDateDisabled(date, options),
    isOutsideMonth: !isSameMonth(date, currentMonth),
    isWeekend: isWeekendFn(date),
  }
}

/**
 * Format a date range as a string
 */
export function formatDateRange(
  range: DateRange,
  dateFormat: string = 'MMM d, yyyy',
  locale?: Locale
): string {
  if (!range.startDate && !range.endDate) {
    return ''
  }

  const options = locale ? { locale } : undefined

  if (range.startDate && range.endDate) {
    return `${format(range.startDate, dateFormat, options)} - ${format(range.endDate, dateFormat, options)}`
  }

  if (range.startDate) {
    return format(range.startDate, dateFormat, options)
  }

  return ''
}

/**
 * Navigate to previous month
 */
export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1)
}

/**
 * Navigate to next month
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1)
}

/**
 * Navigate to previous day
 */
export function getPrevDay(date: Date): Date {
  return subDays(date, 1)
}

/**
 * Navigate to next day
 */
export function getNextDay(date: Date): Date {
  return addDays(date, 1)
}

/**
 * Navigate to previous week
 */
export function getPrevWeek(date: Date): Date {
  return subDays(date, 7)
}

/**
 * Navigate to next week
 */
export function getNextWeek(date: Date): Date {
  return addDays(date, 7)
}

/**
 * Get today's date at start of day
 */
export function getToday(): Date {
  return startOfDay(new Date())
}

/**
 * Check if two date ranges are equal
 */
export function areRangesEqual(a: DateRange, b: DateRange): boolean {
  const startEqual =
    (a.startDate === null && b.startDate === null) ||
    (a.startDate !== null && b.startDate !== null && isSameDay(a.startDate, b.startDate))

  const endEqual =
    (a.endDate === null && b.endDate === null) ||
    (a.endDate !== null && b.endDate !== null && isSameDay(a.endDate, b.endDate))

  return startEqual && endEqual
}

/**
 * Normalize a date range (ensure start is before end)
 */
export function normalizeRange(range: DateRange): DateRange {
  if (!range.startDate || !range.endDate) return range

  if (isAfter(range.startDate, range.endDate)) {
    return {
      startDate: range.endDate,
      endDate: range.startDate,
    }
  }

  return range
}
