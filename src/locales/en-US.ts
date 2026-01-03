import { enUS } from 'date-fns/locale'
import type { DateRangePickerLocale } from '../types'

export const enUSLocale: DateRangePickerLocale = {
  code: 'en-US',
  direction: 'ltr',
  dateFnsLocale: enUS,
  strings: {
    startDate: 'Start Date',
    endDate: 'End Date',
    selectDate: 'Select date',
    selectRange: 'Select date range',
    today: 'Today',
    clear: 'Clear',
    apply: 'Apply',
    cancel: 'Cancel',
    weekdays: {
      short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    months: {
      short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      long: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
  },
}
