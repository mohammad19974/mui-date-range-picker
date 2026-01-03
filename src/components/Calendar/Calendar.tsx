import { memo, useCallback, useState, useMemo } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { startOfMonth } from 'date-fns'
import { CalendarHeader } from './CalendarHeader'
import { CalendarDay } from './CalendarDay'
import { getCalendarDays, getDayState, getPrevMonth, getNextMonth } from '../../utils/dateUtils'
import type { DateRange, DateRangePickerLocale, NavigationDirection, DayState } from '../../types'

export interface CalendarProps {
  /** Current displayed month */
  month?: Date
  /** Default month (uncontrolled) */
  defaultMonth?: Date
  /** Selected date range */
  value: DateRange
  /** Hovered date for range preview */
  hoveredDate?: Date | null
  /** Callback when date is selected */
  onDateSelect: (date: Date) => void
  /** Callback when date is hovered */
  onDateHover?: (date: Date | null) => void
  /** Callback when month changes */
  onMonthChange?: (date: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Array of disabled dates */
  disabledDates?: Date[]
  /** Disabled days of week (0 = Sunday, 6 = Saturday) */
  disabledDaysOfWeek?: number[]
  /** Show week numbers */
  showWeekNumbers?: boolean
  /** Week starts on (0 = Sunday, 1 = Monday, etc.) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Locale */
  locale: DateRangePickerLocale
  /** Show quick month/year jumper */
  showQuickJumper?: boolean
  /** Custom day renderer */
  renderDay?: (props: DayState & { onClick: () => void }) => React.ReactNode
}

export const Calendar = memo(function Calendar({
  month: controlledMonth,
  defaultMonth = new Date(),
  value,
  hoveredDate = null,
  onDateSelect,
  onDateHover,
  onMonthChange,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],
  showWeekNumbers = false,
  weekStartsOn = 0,
  locale,
  showQuickJumper = true,
  renderDay,
}: CalendarProps) {
  const theme = useTheme()
  const isRtl = locale.direction === 'rtl'

  // Month state
  const [internalMonth, setInternalMonth] = useState(() => startOfMonth(defaultMonth))
  const isMonthControlled = controlledMonth !== undefined
  const currentMonth = isMonthControlled ? controlledMonth : internalMonth

  // Get calendar days
  const days = useMemo(
    () => getCalendarDays(currentMonth, weekStartsOn),
    [currentMonth, weekStartsOn]
  )

  // Get weekday headers
  const weekdayHeaders = useMemo(() => {
    const headers = [...locale.strings.weekdays.short]
    // Rotate array based on weekStartsOn
    for (let i = 0; i < weekStartsOn; i++) {
      headers.push(headers.shift()!)
    }
    return isRtl ? headers.reverse() : headers
  }, [locale.strings.weekdays.short, weekStartsOn, isRtl])

  // Handle month navigation
  const handleNavigate = useCallback(
    (direction: NavigationDirection) => {
      const newMonth =
        direction === 'prev' ? getPrevMonth(currentMonth) : getNextMonth(currentMonth)

      if (!isMonthControlled) {
        setInternalMonth(newMonth)
      }
      onMonthChange?.(newMonth)
    },
    [currentMonth, isMonthControlled, onMonthChange]
  )

  const handleMonthChange = useCallback(
    (newMonth: Date) => {
      if (!isMonthControlled) {
        setInternalMonth(startOfMonth(newMonth))
      }
      onMonthChange?.(newMonth)
    },
    [isMonthControlled, onMonthChange]
  )

  // Handle date selection
  const handleDateClick = useCallback(
    (date: Date) => {
      onDateSelect(date)
    },
    [onDateSelect]
  )

  // Handle date hover
  const handleDateHover = useCallback(
    (date: Date) => {
      onDateHover?.(date)
    },
    [onDateHover]
  )

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    onDateHover?.(null)
  }, [onDateHover])

  // Render days in rows
  const weeks = useMemo(() => {
    const result: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7)
      result.push(isRtl ? week.reverse() : week)
    }
    return result
  }, [days, isRtl])

  return (
    <Box
      sx={{
        width: 280,
        direction: locale.direction,
      }}
      role="grid"
      aria-label="Calendar"
    >
      {/* Header with navigation */}
      <CalendarHeader
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        onNavigate={handleNavigate}
        locale={locale}
        minDate={minDate}
        maxDate={maxDate}
        showQuickJumper={showQuickJumper}
      />

      {/* Weekday headers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)',
          gap: 0,
          px: 1,
          py: 0.5,
        }}
        role="row"
      >
        {showWeekNumbers && (
          <Box sx={{ width: 32 }} role="columnheader" aria-label="Week number" />
        )}
        {weekdayHeaders.map((day, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 36,
            }}
            role="columnheader"
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box
        sx={{ px: 1, pb: 1 }}
        onMouseLeave={handleMouseLeave}
      >
        {weeks.map((week, weekIndex) => (
          <Box
            key={weekIndex}
            sx={{
              display: 'grid',
              gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)',
              gap: 0,
            }}
            role="row"
          >
            {showWeekNumbers && (
              <Box
                sx={{
                  width: 32,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                role="rowheader"
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.disabled,
                    fontSize: '0.7rem',
                  }}
                >
                  {/* Week number calculation could be added here */}
                </Typography>
              </Box>
            )}
            {week.map((date) => {
              const dayState = getDayState(date, currentMonth, value, hoveredDate, {
                minDate,
                maxDate,
                disabledDates,
                disabledDaysOfWeek,
              })

              if (renderDay) {
                return renderDay({
                  ...dayState,
                  onClick: () => handleDateClick(date),
                })
              }

              return (
                <CalendarDay
                  key={date.toISOString()}
                  {...dayState}
                  onClick={handleDateClick}
                  onMouseEnter={handleDateHover}
                />
              )
            })}
          </Box>
        ))}
      </Box>
    </Box>
  )
})
