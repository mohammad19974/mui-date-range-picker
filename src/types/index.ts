/**
 * Core Types for MUI Date Range Picker
 */
import type { Locale } from 'date-fns'

/**
 * Represents a date range with start and end dates
 */
export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

/**
 * Selection mode for the date picker
 */
export type SelectionMode = 'single' | 'range' | 'multiple' | 'week' | 'month'

/**
 * Display variant for the picker
 */
export type PickerVariant = 'popover' | 'modal' | 'inline' | 'drawer'

/**
 * Input mode for the picker
 */
export type InputMode = 'single' | 'multi'

/**
 * Preset range configuration
 */
export interface PresetRange {
  label: string
  getValue: () => DateRange
  shortcut?: string
}

/**
 * Preset group for organizing presets
 */
export interface PresetGroup {
  label: string
  presets: PresetRange[]
}

/**
 * Locale configuration for the picker
 */
export interface DateRangePickerLocale {
  /** Locale code (e.g., 'en-US', 'ar-SA') */
  code: string
  /** Direction: 'ltr' or 'rtl' */
  direction: 'ltr' | 'rtl'
  /** Date-fns locale object */
  dateFnsLocale: Locale
  /** Translated strings */
  strings: {
    startDate: string
    endDate: string
    selectDate: string
    selectRange: string
    today: string
    clear: string
    apply: string
    cancel: string
    weekdays: {
      short: string[]
      long: string[]
    }
    months: {
      short: string[]
      long: string[]
    }
  }
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Custom validation function type
 */
export type DateValidator = (date: Date | null) => ValidationResult

/**
 * Range validation function type
 */
export type RangeValidator = (range: DateRange) => ValidationResult

/**
 * Calendar navigation direction
 */
export type NavigationDirection = 'prev' | 'next'

/**
 * Calendar view mode
 */
export type CalendarView = 'days' | 'months' | 'years'

/**
 * Day state for styling and behavior
 */
export interface DayState {
  date: Date
  isToday: boolean
  isSelected: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isInRange: boolean
  isDisabled: boolean
  isOutsideMonth: boolean
  isWeekend: boolean
}

/**
 * Calendar props
 */
export interface CalendarProps {
  /** Current displayed month */
  month: Date
  /** Selected date range */
  value: DateRange
  /** Callback when date is selected */
  onDateSelect: (date: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Array of disabled dates */
  disabledDates?: Date[]
  /** Disabled days of week (0 = Sunday, 6 = Saturday) */
  disabledDaysOfWeek?: number[]
  /** Custom validation function */
  dateValidator?: DateValidator
  /** Show week numbers */
  showWeekNumbers?: boolean
  /** Week starts on (0 = Sunday, 1 = Monday, etc.) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Locale */
  locale?: DateRangePickerLocale
  /** Callback for month navigation */
  onMonthChange?: (month: Date) => void
}

/**
 * Main DateRangePicker props
 */
export interface DateRangePickerProps {
  /** Current value (controlled) */
  value?: DateRange
  /** Default value (uncontrolled) */
  defaultValue?: DateRange
  /** Callback when value changes */
  onChange?: (value: DateRange) => void
  /** Selection mode */
  selectionMode?: SelectionMode
  /** Display variant */
  variant?: PickerVariant
  /** Input mode */
  inputMode?: InputMode
  /** Number of calendars to display (1-3) */
  calendars?: 1 | 2 | 3
  /** Show preset ranges */
  showPresets?: boolean
  /** Custom presets */
  presets?: PresetRange[] | PresetGroup[]
  /** Show time picker */
  showTimePicker?: boolean
  /** Time format (12h or 24h) */
  timeFormat?: '12h' | '24h'
  /** Time step in minutes */
  timeStep?: number
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Minimum range length in days */
  minRangeDays?: number
  /** Maximum range length in days */
  maxRangeDays?: number
  /** Array of disabled dates */
  disabledDates?: Date[]
  /** Disabled days of week */
  disabledDaysOfWeek?: number[]
  /** Custom date validator */
  dateValidator?: DateValidator
  /** Custom range validator */
  rangeValidator?: RangeValidator
  /** Show week numbers */
  showWeekNumbers?: boolean
  /** Week starts on */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Locale */
  locale?: DateRangePickerLocale
  /** Date format string */
  dateFormat?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Read-only state */
  readOnly?: boolean
  /** Error state */
  error?: boolean
  /** Helper text */
  helperText?: string
  /** Input label */
  label?: string
  /** Close on date select */
  closeOnSelect?: boolean
  /** Close on click outside */
  closeOnClickOutside?: boolean
  /** Show today button */
  showTodayButton?: boolean
  /** Show clear button */
  showClearButton?: boolean
  /** Show action buttons (Apply/Cancel) */
  showActionButtons?: boolean
  /** Auto apply selection without requiring Apply button click */
  autoApply?: boolean
  /** Callback when picker opens */
  onOpen?: () => void
  /** Callback when picker closes */
  onClose?: () => void
  /** Custom input render */
  renderInput?: (props: InputRenderProps) => React.ReactNode
  /** Custom day render */
  renderDay?: (props: DayRenderProps) => React.ReactNode
  /** Custom header render */
  renderHeader?: (props: HeaderRenderProps) => React.ReactNode
  /** className */
  className?: string
  /** MUI sx prop */
  sx?: object
}

/**
 * Props passed to custom input renderer
 */
export interface InputRenderProps {
  value: string
  onClick: () => void
  onClear: () => void
  disabled: boolean
  readOnly: boolean
  error: boolean
  placeholder: string
  label?: string
  helperText?: string
}

/**
 * Props passed to custom day renderer
 */
export interface DayRenderProps extends DayState {
  onClick: () => void
  onKeyDown: (event: React.KeyboardEvent) => void
  onMouseEnter: () => void
}

/**
 * Props passed to custom header renderer
 */
export interface HeaderRenderProps {
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onMonthClick: () => void
  onYearClick: () => void
  locale: DateRangePickerLocale
}

/**
 * Context value for DateRangePicker
 */
export interface DateRangePickerContextValue {
  value: DateRange
  setValue: (value: DateRange) => void
  tempValue: DateRange
  setTempValue: (value: DateRange) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  hoveredDate: Date | null
  setHoveredDate: (date: Date | null) => void
  focusedDate: Date | null
  setFocusedDate: (date: Date | null) => void
  selectionMode: SelectionMode
  locale: DateRangePickerLocale
  minDate?: Date
  maxDate?: Date
  disabledDates: Date[]
  disabledDaysOfWeek: number[]
  dateValidator?: DateValidator
  rangeValidator?: RangeValidator
}
