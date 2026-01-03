import { memo, useCallback, useState } from 'react'
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Stack,
  useTheme,
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
} from '@mui/icons-material'
import { format, setMonth, setYear, getYear, getMonth } from 'date-fns'
import type { DateRangePickerLocale, NavigationDirection } from '../../types'

export interface CalendarHeaderProps {
  currentMonth: Date
  onMonthChange: (date: Date) => void
  onNavigate: (direction: NavigationDirection) => void
  locale: DateRangePickerLocale
  minDate?: Date
  maxDate?: Date
  showQuickJumper?: boolean
}

export const CalendarHeader = memo(function CalendarHeader({
  currentMonth,
  onMonthChange,
  onNavigate,
  locale,
  minDate,
  maxDate,
  showQuickJumper = true,
}: CalendarHeaderProps) {
  const theme = useTheme()
  const isRtl = locale.direction === 'rtl'

  const [monthMenuAnchor, setMonthMenuAnchor] = useState<null | HTMLElement>(null)
  const [yearMenuAnchor, setYearMenuAnchor] = useState<null | HTMLElement>(null)

  const currentYear = getYear(currentMonth)
  const currentMonthIndex = getMonth(currentMonth)

  // Generate year options (10 years before and after current year)
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  const handlePrevClick = useCallback(() => {
    onNavigate(isRtl ? 'next' : 'prev')
  }, [onNavigate, isRtl])

  const handleNextClick = useCallback(() => {
    onNavigate(isRtl ? 'prev' : 'next')
  }, [onNavigate, isRtl])

  const handleMonthClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (showQuickJumper) {
      setMonthMenuAnchor(event.currentTarget)
    }
  }, [showQuickJumper])

  const handleYearClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (showQuickJumper) {
      setYearMenuAnchor(event.currentTarget)
    }
  }, [showQuickJumper])

  const handleMonthSelect = useCallback(
    (monthIndex: number) => {
      const newDate = setMonth(currentMonth, monthIndex)
      onMonthChange(newDate)
      setMonthMenuAnchor(null)
    },
    [currentMonth, onMonthChange]
  )

  const handleYearSelect = useCallback(
    (year: number) => {
      const newDate = setYear(currentMonth, year)
      onMonthChange(newDate)
      setYearMenuAnchor(null)
    },
    [currentMonth, onMonthChange]
  )

  const handleCloseMonthMenu = useCallback(() => {
    setMonthMenuAnchor(null)
  }, [])

  const handleCloseYearMenu = useCallback(() => {
    setYearMenuAnchor(null)
  }, [])

  // Check if navigation should be disabled
  const isPrevDisabled = minDate
    ? getYear(currentMonth) <= getYear(minDate) && getMonth(currentMonth) <= getMonth(minDate)
    : false
  const isNextDisabled = maxDate
    ? getYear(currentMonth) >= getYear(maxDate) && getMonth(currentMonth) >= getMonth(maxDate)
    : false

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft
  const NextIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1,
        py: 0.5,
        minHeight: 48,
      }}
      role="presentation"
      aria-live="polite"
    >
      <IconButton
        onClick={handlePrevClick}
        disabled={isPrevDisabled}
        size="small"
        aria-label={isRtl ? 'Next month' : 'Previous month'}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <PrevIcon />
      </IconButton>

      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box
          component="button"
          onClick={handleMonthClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            background: 'none',
            border: 'none',
            cursor: showQuickJumper ? 'pointer' : 'default',
            padding: '4px 8px',
            borderRadius: 1,
            '&:hover': showQuickJumper
              ? {
                  backgroundColor: theme.palette.action.hover,
                }
              : {},
          }}
          aria-haspopup={showQuickJumper ? 'listbox' : undefined}
          aria-expanded={Boolean(monthMenuAnchor)}
        >
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {format(currentMonth, 'MMMM', { locale: locale.dateFnsLocale })}
          </Typography>
          {showQuickJumper && (
            <KeyboardArrowDown
              sx={{ fontSize: 18, color: theme.palette.text.secondary }}
            />
          )}
        </Box>

        <Box
          component="button"
          onClick={handleYearClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            background: 'none',
            border: 'none',
            cursor: showQuickJumper ? 'pointer' : 'default',
            padding: '4px 8px',
            borderRadius: 1,
            '&:hover': showQuickJumper
              ? {
                  backgroundColor: theme.palette.action.hover,
                }
              : {},
          }}
          aria-haspopup={showQuickJumper ? 'listbox' : undefined}
          aria-expanded={Boolean(yearMenuAnchor)}
        >
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {format(currentMonth, 'yyyy')}
          </Typography>
          {showQuickJumper && (
            <KeyboardArrowDown
              sx={{ fontSize: 18, color: theme.palette.text.secondary }}
            />
          )}
        </Box>
      </Stack>

      <IconButton
        onClick={handleNextClick}
        disabled={isNextDisabled}
        size="small"
        aria-label={isRtl ? 'Previous month' : 'Next month'}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <NextIcon />
      </IconButton>

      {/* Month Menu */}
      <Menu
        anchorEl={monthMenuAnchor}
        open={Boolean(monthMenuAnchor)}
        onClose={handleCloseMonthMenu}
        MenuListProps={{
          role: 'listbox',
          'aria-label': 'Select month',
        }}
        slotProps={{
          paper: {
            sx: { maxHeight: 300 },
          },
        }}
      >
        {locale.strings.months.long.map((month, index) => (
          <MenuItem
            key={month}
            onClick={() => handleMonthSelect(index)}
            selected={index === currentMonthIndex}
            role="option"
            aria-selected={index === currentMonthIndex}
          >
            {month}
          </MenuItem>
        ))}
      </Menu>

      {/* Year Menu */}
      <Menu
        anchorEl={yearMenuAnchor}
        open={Boolean(yearMenuAnchor)}
        onClose={handleCloseYearMenu}
        MenuListProps={{
          role: 'listbox',
          'aria-label': 'Select year',
        }}
        slotProps={{
          paper: {
            sx: { maxHeight: 300 },
          },
        }}
      >
        {yearOptions.map((year) => (
          <MenuItem
            key={year}
            onClick={() => handleYearSelect(year)}
            selected={year === currentYear}
            role="option"
            aria-selected={year === currentYear}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
})
