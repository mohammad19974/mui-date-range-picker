import { memo, useCallback, useState, useRef } from 'react'
import { Box, ClickAwayListener } from '@mui/material'
import { DateRangePickerInput } from './DateRangePickerInput'
import { DateRangePickerPopover } from './DateRangePickerPopover'
import { Calendar } from '../Calendar'
import { enUSLocale } from '../../locales'
import type { DateRange, DateRangePickerProps } from '../../types'

const defaultRange: DateRange = { startDate: null, endDate: null }

export const DateRangePicker = memo(function DateRangePicker({
  value: controlledValue,
  defaultValue = defaultRange,
  onChange,
  selectionMode: _selectionMode = 'range',
  variant = 'popover',
  inputMode: _inputMode = 'single',
  calendars = 2,
  showPresets = true,
  presets,
  showTimePicker: _showTimePicker = false,
  timeFormat: _timeFormat = '24h',
  timeStep: _timeStep = 30,
  minDate,
  maxDate,
  minRangeDays: _minRangeDays,
  maxRangeDays: _maxRangeDays,
  disabledDates = [],
  disabledDaysOfWeek = [],
  dateValidator: _dateValidator,
  rangeValidator: _rangeValidator,
  showWeekNumbers = false,
  weekStartsOn = 0,
  locale = enUSLocale,
  dateFormat = 'MMM d, yyyy',
  placeholder,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  label,
  closeOnSelect = false,
  closeOnClickOutside = true,
  showTodayButton = true,
  showClearButton = true,
  showActionButtons = true,
  autoApply = false,
  onOpen,
  onClose,
  renderInput,
  renderDay: _renderDay,
  renderHeader: _renderHeader,
  className,
  sx,
}: DateRangePickerProps) {
  const inputRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<DateRange>(defaultValue)

  // Use controlled or uncontrolled value
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  // Handle value change
  const handleChange = useCallback(
    (newValue: DateRange) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    },
    [isControlled, onChange]
  )

  // Handle open
  const handleOpen = useCallback(() => {
    if (disabled || readOnly) return

    setAnchorEl(inputRef.current)
    setIsOpen(true)
    onOpen?.()
  }, [disabled, readOnly, onOpen])

  // Handle close
  const handleClose = useCallback(() => {
    setIsOpen(false)
    setAnchorEl(null)
    onClose?.()
  }, [onClose])

  // Handle clear
  const handleClear = useCallback(() => {
    handleChange(defaultRange)
  }, [handleChange])

  // Handle click away
  const handleClickAway = useCallback(() => {
    if (closeOnClickOutside && isOpen) {
      handleClose()
    }
  }, [closeOnClickOutside, isOpen, handleClose])

  // Render inline variant
  if (variant === 'inline') {
    return (
      <Box className={className} sx={sx}>
        <Calendar
          value={currentValue}
          onDateSelect={(date) => {
            if (!currentValue.startDate || currentValue.endDate) {
              handleChange({ startDate: date, endDate: null })
            } else {
              handleChange({
                startDate: currentValue.startDate,
                endDate: date,
              })
            }
          }}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          disabledDaysOfWeek={disabledDaysOfWeek}
          weekStartsOn={weekStartsOn}
          locale={locale}
          showWeekNumbers={showWeekNumbers}
        />
      </Box>
    )
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box className={className} sx={sx}>
        {/* Input */}
        {renderInput ? (
          renderInput({
            value: currentValue.startDate && currentValue.endDate
              ? `${currentValue.startDate.toLocaleDateString()} - ${currentValue.endDate.toLocaleDateString()}`
              : '',
            onClick: handleOpen,
            onClear: handleClear,
            disabled,
            readOnly,
            error,
            placeholder: placeholder || locale.strings.selectRange,
            label,
            helperText,
          })
        ) : (
          <DateRangePickerInput
            ref={inputRef}
            value={currentValue}
            onClick={handleOpen}
            onClear={handleClear}
            disabled={disabled}
            readOnly={readOnly}
            error={error}
            placeholder={placeholder}
            label={label}
            helperText={helperText}
            dateFormat={dateFormat}
            locale={locale}
            showClearButton={showClearButton}
          />
        )}

        {/* Popover/Modal/Drawer */}
        <DateRangePickerPopover
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          value={currentValue}
          onChange={handleChange}
          variant={variant}
          calendars={calendars}
          showPresets={showPresets}
          presets={presets}
          showActionButtons={showActionButtons}
          showTodayButton={showTodayButton}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          disabledDaysOfWeek={disabledDaysOfWeek}
          weekStartsOn={weekStartsOn}
          locale={locale}
          closeOnSelect={closeOnSelect}
          autoApply={autoApply}
        />
      </Box>
    </ClickAwayListener>
  )
})
