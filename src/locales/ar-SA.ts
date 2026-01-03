import { arSA } from 'date-fns/locale'
import type { DateRangePickerLocale } from '../types'

export const arSALocale: DateRangePickerLocale = {
  code: 'ar-SA',
  direction: 'rtl',
  dateFnsLocale: arSA,
  strings: {
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    selectDate: 'اختر التاريخ',
    selectRange: 'اختر نطاق التاريخ',
    today: 'اليوم',
    clear: 'مسح',
    apply: 'تطبيق',
    cancel: 'إلغاء',
    weekdays: {
      short: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
      long: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    },
    months: {
      short: [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر',
      ],
      long: [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر',
      ],
    },
  },
}
