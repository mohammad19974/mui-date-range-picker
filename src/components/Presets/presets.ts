import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfQuarter,
  endOfQuarter,
  subQuarters,
  startOfYear,
  endOfYear,
  subYears,
} from 'date-fns'
import type { PresetRange, PresetGroup, DateRange } from '../../types'

/**
 * Creates a date range from today going back N days
 */
function lastNDays(n: number): DateRange {
  const today = new Date()
  return {
    startDate: startOfDay(subDays(today, n - 1)),
    endDate: endOfDay(today),
  }
}

/**
 * Built-in preset ranges
 */
export const defaultPresets: PresetRange[] = [
  {
    label: 'Today',
    getValue: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
    shortcut: 'T',
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = subDays(new Date(), 1)
      return {
        startDate: startOfDay(yesterday),
        endDate: endOfDay(yesterday),
      }
    },
    shortcut: 'Y',
  },
  {
    label: 'Last 7 days',
    getValue: () => lastNDays(7),
    shortcut: '7',
  },
  {
    label: 'Last 14 days',
    getValue: () => lastNDays(14),
  },
  {
    label: 'Last 30 days',
    getValue: () => lastNDays(30),
    shortcut: '3',
  },
  {
    label: 'Last 90 days',
    getValue: () => lastNDays(90),
    shortcut: '9',
  },
  {
    label: 'This week',
    getValue: () => ({
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
    }),
    shortcut: 'W',
  },
  {
    label: 'Last week',
    getValue: () => {
      const lastWeek = subDays(new Date(), 7)
      return {
        startDate: startOfWeek(lastWeek),
        endDate: endOfWeek(lastWeek),
      }
    },
  },
  {
    label: 'This month',
    getValue: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
    shortcut: 'M',
  },
  {
    label: 'Last month',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1)
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      }
    },
  },
  {
    label: 'This quarter',
    getValue: () => ({
      startDate: startOfQuarter(new Date()),
      endDate: endOfQuarter(new Date()),
    }),
    shortcut: 'Q',
  },
  {
    label: 'Last quarter',
    getValue: () => {
      const lastQuarter = subQuarters(new Date(), 1)
      return {
        startDate: startOfQuarter(lastQuarter),
        endDate: endOfQuarter(lastQuarter),
      }
    },
  },
  {
    label: 'This year',
    getValue: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
    }),
  },
  {
    label: 'Last year',
    getValue: () => {
      const lastYear = subYears(new Date(), 1)
      return {
        startDate: startOfYear(lastYear),
        endDate: endOfYear(lastYear),
      }
    },
  },
]

/**
 * Grouped presets for better organization
 */
export const groupedPresets: PresetGroup[] = [
  {
    label: 'Days',
    presets: defaultPresets.slice(0, 6), // Today through Last 90 days
  },
  {
    label: 'Weeks',
    presets: defaultPresets.slice(6, 8), // This week, Last week
  },
  {
    label: 'Months',
    presets: defaultPresets.slice(8, 10), // This month, Last month
  },
  {
    label: 'Quarters & Years',
    presets: defaultPresets.slice(10), // Quarters and years
  },
]

/**
 * Arabic preset labels
 */
export const arabicPresetLabels: Record<string, string> = {
  Today: 'اليوم',
  Yesterday: 'أمس',
  'Last 7 days': 'آخر 7 أيام',
  'Last 14 days': 'آخر 14 يوم',
  'Last 30 days': 'آخر 30 يوم',
  'Last 90 days': 'آخر 90 يوم',
  'This week': 'هذا الأسبوع',
  'Last week': 'الأسبوع الماضي',
  'This month': 'هذا الشهر',
  'Last month': 'الشهر الماضي',
  'This quarter': 'هذا الربع',
  'Last quarter': 'الربع الماضي',
  'This year': 'هذه السنة',
  'Last year': 'السنة الماضية',
}

/**
 * Get localized presets
 */
export function getLocalizedPresets(
  presets: PresetRange[],
  localeCode: string
): PresetRange[] {
  if (localeCode.startsWith('ar')) {
    return presets.map((preset) => ({
      ...preset,
      label: arabicPresetLabels[preset.label] || preset.label,
    }))
  }
  return presets
}
