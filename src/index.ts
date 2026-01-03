// Main component
export { DateRangePicker } from './components/DateRangePicker'
export { DateRangePickerInput } from './components/DateRangePicker/DateRangePickerInput'
export { DateRangePickerPopover } from './components/DateRangePicker/DateRangePickerPopover'
export {
  DateRangePickerProvider,
  useDateRangePickerContext,
} from './components/DateRangePicker/DateRangePickerContext'

// Calendar components
export { Calendar, CalendarDay, CalendarHeader } from './components/Calendar'

// Presets
export { PresetList, defaultPresets, groupedPresets, getLocalizedPresets } from './components/Presets'

// Locales
export { enUSLocale, arSALocale } from './locales'

// Utils
export {
  getCalendarDays,
  isDateInRange,
  isRangeStart,
  isRangeEnd,
  isDateSelected,
  isDateDisabled,
  getDayState,
  formatDateRange,
  getPrevMonth,
  getNextMonth,
  getToday,
  areRangesEqual,
  normalizeRange,
} from './utils/dateUtils'

// Types
export type {
  DateRange,
  SelectionMode,
  PickerVariant,
  InputMode,
  PresetRange,
  PresetGroup,
  DateRangePickerLocale,
  ValidationResult,
  DateValidator,
  RangeValidator,
  NavigationDirection,
  CalendarView,
  DayState,
  CalendarProps,
  DateRangePickerProps,
  InputRenderProps,
  DayRenderProps,
  HeaderRenderProps,
  DateRangePickerContextValue,
} from './types'
