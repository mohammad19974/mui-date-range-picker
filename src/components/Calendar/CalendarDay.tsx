import React, { memo, useCallback } from 'react'
import { ButtonBase, Typography, alpha, useTheme } from '@mui/material'
import { format } from 'date-fns'
import type { DayState } from '../../types'

export interface CalendarDayProps extends DayState {
  onClick: (date: Date) => void
  onMouseEnter: (date: Date) => void
  onKeyDown?: (event: React.KeyboardEvent, date: Date) => void
  tabIndex?: number
}

export const CalendarDay = memo(function CalendarDay({
  date,
  isToday,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isDisabled,
  isOutsideMonth,
  isWeekend,
  onClick,
  onMouseEnter,
  onKeyDown,
  tabIndex = -1,
}: CalendarDayProps) {
  const theme = useTheme()

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onClick(date)
    }
  }, [date, isDisabled, onClick])

  const handleMouseEnter = useCallback(() => {
    if (!isDisabled) {
      onMouseEnter(date)
    }
  }, [date, isDisabled, onMouseEnter])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      onKeyDown?.(event, date)
    },
    [date, onKeyDown]
  )

  // Calculate styles based on state
  const getBackgroundColor = () => {
    if (isSelected || isRangeStart || isRangeEnd) {
      return theme.palette.primary.main
    }
    if (isInRange) {
      return alpha(theme.palette.primary.main, 0.12)
    }
    return 'transparent'
  }

  const getTextColor = () => {
    if (isDisabled) {
      return theme.palette.text.disabled
    }
    if (isSelected || isRangeStart || isRangeEnd) {
      return theme.palette.primary.contrastText
    }
    if (isOutsideMonth) {
      return theme.palette.text.disabled
    }
    if (isWeekend) {
      return theme.palette.error.main
    }
    return theme.palette.text.primary
  }

  const getBorderRadius = () => {
    if (isRangeStart && isRangeEnd) {
      return '50%'
    }
    if (isRangeStart) {
      return '50% 0 0 50%'
    }
    if (isRangeEnd) {
      return '0 50% 50% 0'
    }
    if (isInRange) {
      return 0
    }
    return '50%'
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(isInRange &&
          !isRangeStart &&
          !isRangeEnd && {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          }),
      }}
    >
      <ButtonBase
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        tabIndex={tabIndex}
        sx={{
          width: 36,
          height: 36,
          borderRadius: getBorderRadius(),
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
          fontWeight: isToday ? 700 : 400,
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.short,
          }),
          '&:hover': {
            backgroundColor: isSelected
              ? theme.palette.primary.dark
              : alpha(theme.palette.primary.main, 0.08),
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            opacity: 0.5,
          },
          ...(isToday && {
            border: `1px solid ${theme.palette.primary.main}`,
          }),
        }}
        aria-label={format(date, 'EEEE, MMMM d, yyyy')}
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        role="gridcell"
      >
        <Typography
          variant="body2"
          component="span"
          sx={{
            lineHeight: 1,
            fontWeight: 'inherit',
          }}
        >
          {format(date, 'd')}
        </Typography>
      </ButtonBase>
    </div>
  )
})
