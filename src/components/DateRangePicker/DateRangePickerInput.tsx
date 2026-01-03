import React, { memo, forwardRef, useCallback } from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material'
import { CalendarMonth, Clear } from '@mui/icons-material'
import type { DateRange, DateRangePickerLocale } from '../../types'
import { formatDateRange } from '../../utils/dateUtils'

export interface DateRangePickerInputProps {
  value: DateRange
  onClick: () => void
  onClear: () => void
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  placeholder?: string
  label?: string
  helperText?: string
  dateFormat?: string
  locale: DateRangePickerLocale
  showClearButton?: boolean
  fullWidth?: boolean
  size?: 'small' | 'medium'
  variant?: 'outlined' | 'filled' | 'standard'
  className?: string
}

export const DateRangePickerInput = memo(
  forwardRef<HTMLDivElement, DateRangePickerInputProps>(function DateRangePickerInput(
    {
      value,
      onClick,
      onClear,
      disabled = false,
      readOnly = false,
      error = false,
      placeholder,
      label,
      helperText,
      dateFormat = 'MMM d, yyyy',
      locale,
      showClearButton = true,
      fullWidth = true,
      size = 'medium',
      variant = 'outlined',
      className,
    },
    ref
  ) {
    const theme = useTheme()
    const isRtl = locale.direction === 'rtl'

    const displayValue = formatDateRange(value, dateFormat, locale.dateFnsLocale)
    const hasValue = value.startDate !== null || value.endDate !== null

    const handleClear = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation()
        onClear()
      },
      [onClear]
    )

    const handleClick = useCallback(() => {
      if (!disabled && !readOnly) {
        onClick()
      }
    }, [disabled, readOnly, onClick])

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleClick()
        }
      },
      [handleClick]
    )

    return (
      <TextField
        ref={ref}
        value={displayValue}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        error={error}
        label={label}
        placeholder={placeholder || locale.strings.selectRange}
        helperText={helperText}
        fullWidth={fullWidth}
        size={size}
        variant={variant}
        className={className}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <CalendarMonth
                sx={{
                  color: disabled
                    ? theme.palette.action.disabled
                    : theme.palette.action.active,
                }}
              />
            </InputAdornment>
          ),
          endAdornment: showClearButton && hasValue && !disabled && !readOnly && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                size="small"
                edge="end"
                aria-label={locale.strings.clear}
                sx={{
                  visibility: hasValue ? 'visible' : 'hidden',
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            cursor: disabled ? 'not-allowed' : 'pointer',
            direction: isRtl ? 'rtl' : 'ltr',
            '& input': {
              cursor: disabled ? 'not-allowed' : 'pointer',
            },
          },
        }}
        inputProps={{
          'aria-label': label || locale.strings.selectRange,
          'aria-haspopup': 'dialog',
          tabIndex: disabled ? -1 : 0,
        }}
      />
    )
  })
)
