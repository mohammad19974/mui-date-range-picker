import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type {
  DateRange,
  DateRangePickerContextValue,
  SelectionMode,
  DateRangePickerLocale,
  DateValidator,
  RangeValidator,
} from '../../types'
import { enUSLocale } from '../../locales'

const DateRangePickerContext = createContext<DateRangePickerContextValue | null>(null)

export interface DateRangePickerProviderProps {
  children: React.ReactNode
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (value: DateRange) => void
  selectionMode?: SelectionMode
  locale?: DateRangePickerLocale
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[]
  dateValidator?: DateValidator
  rangeValidator?: RangeValidator
}

const defaultRange: DateRange = { startDate: null, endDate: null }

export function DateRangePickerProvider({
  children,
  value: controlledValue,
  defaultValue = defaultRange,
  onChange,
  selectionMode = 'range',
  locale = enUSLocale,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],
  dateValidator,
  rangeValidator,
}: DateRangePickerProviderProps) {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<DateRange>(defaultValue)

  // Temporary value while selecting (before apply)
  const [tempValue, setTempValue] = useState<DateRange>(defaultRange)

  // Popover state
  const [isOpen, setIsOpen] = useState(false)

  // Hover state for range preview
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Focus state for keyboard navigation
  const [focusedDate, setFocusedDate] = useState<Date | null>(null)

  // Use controlled or uncontrolled value
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const setValue = useCallback(
    (newValue: DateRange) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    },
    [isControlled, onChange]
  )

  const contextValue = useMemo<DateRangePickerContextValue>(
    () => ({
      value: currentValue,
      setValue,
      tempValue,
      setTempValue,
      isOpen,
      setIsOpen,
      hoveredDate,
      setHoveredDate,
      focusedDate,
      setFocusedDate,
      selectionMode,
      locale,
      minDate,
      maxDate,
      disabledDates,
      disabledDaysOfWeek,
      dateValidator,
      rangeValidator,
    }),
    [
      currentValue,
      setValue,
      tempValue,
      isOpen,
      hoveredDate,
      focusedDate,
      selectionMode,
      locale,
      minDate,
      maxDate,
      disabledDates,
      disabledDaysOfWeek,
      dateValidator,
      rangeValidator,
    ]
  )

  return (
    <DateRangePickerContext.Provider value={contextValue}>
      {children}
    </DateRangePickerContext.Provider>
  )
}

export function useDateRangePickerContext(): DateRangePickerContextValue {
  const context = useContext(DateRangePickerContext)
  if (!context) {
    throw new Error('useDateRangePickerContext must be used within a DateRangePickerProvider')
  }
  return context
}

export { DateRangePickerContext }
