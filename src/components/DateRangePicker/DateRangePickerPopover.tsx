import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import {
  Box,
  Popover,
  Button,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  Drawer,
} from '@mui/material'
import { addMonths } from 'date-fns'
import { Calendar } from '../Calendar'
import { PresetList, defaultPresets } from '../Presets'
import type {
  DateRange,
  DateRangePickerLocale,
  PresetRange,
  PresetGroup,
  PickerVariant,
} from '../../types'
import { normalizeRange } from '../../utils/dateUtils'

export interface DateRangePickerPopoverProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  value: DateRange
  onChange: (value: DateRange) => void
  variant?: PickerVariant
  calendars?: 1 | 2 | 3
  showPresets?: boolean
  presets?: PresetRange[] | PresetGroup[]
  showActionButtons?: boolean
  showTodayButton?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  disabledDaysOfWeek?: number[]
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  locale: DateRangePickerLocale
  closeOnSelect?: boolean
  showQuickJumper?: boolean
  /** Auto apply selection without requiring Apply button click */
  autoApply?: boolean
}

export const DateRangePickerPopover = memo(function DateRangePickerPopover({
  anchorEl,
  open,
  onClose,
  value,
  onChange,
  variant = 'popover',
  calendars = 2,
  showPresets = true,
  presets = defaultPresets,
  showActionButtons = true,
  showTodayButton = true,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  weekStartsOn = 0,
  locale,
  closeOnSelect = false,
  showQuickJumper = true,
  autoApply = false,
}: DateRangePickerPopoverProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isRtl = locale.direction === 'rtl'

  // Temporary selection state
  const [tempValue, setTempValue] = useState<DateRange>(value)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Base months for multi-calendar display
  const [baseMonth, setBaseMonth] = useState<Date>(() => value.startDate || new Date())

  // Sync temp value when opening
  useEffect(() => {
    if (open) {
      setTempValue(value)
      setBaseMonth(value.startDate || new Date())
    }
  }, [open, value])

  // Auto apply when tempValue changes (if autoApply is enabled)
  useEffect(() => {
    if (autoApply && tempValue.startDate && tempValue.endDate) {
      onChange(tempValue)
    }
  }, [autoApply, tempValue, onChange])

  // Handle date selection
  const handleDateSelect = useCallback(
    (date: Date) => {
      if (!tempValue.startDate || tempValue.endDate) {
        // Start new selection
        const newRange = { startDate: date, endDate: null }
        setTempValue(newRange)

        // If autoApply, immediately report the start date
        if (autoApply) {
          onChange(newRange)
        }
      } else {
        // Complete selection
        const newRange = normalizeRange({
          startDate: tempValue.startDate,
          endDate: date,
        })
        setTempValue(newRange)

        // Auto apply or close on select
        if (autoApply) {
          onChange(newRange)
          if (closeOnSelect) {
            onClose()
          }
        } else if (closeOnSelect && !showActionButtons) {
          onChange(newRange)
          onClose()
        }
      }
    },
    [tempValue, closeOnSelect, showActionButtons, onChange, onClose, autoApply]
  )

  // Handle preset selection
  const handlePresetSelect = useCallback(
    (range: DateRange) => {
      setTempValue(range)
      setBaseMonth(range.startDate || new Date())

      // Always apply immediately for presets when autoApply is true
      if (autoApply || !showActionButtons) {
        onChange(range)
        if (closeOnSelect) {
          onClose()
        }
      }
    },
    [showActionButtons, onChange, onClose, autoApply, closeOnSelect]
  )

  // Handle apply
  const handleApply = useCallback(() => {
    onChange(tempValue)
    onClose()
  }, [tempValue, onChange, onClose])

  // Handle cancel
  const handleCancel = useCallback(() => {
    setTempValue(value)
    onClose()
  }, [value, onClose])

  // Handle today button
  const handleToday = useCallback(() => {
    const today = new Date()
    setBaseMonth(today)
  }, [])

  // Handle month navigation
  const handleMonthChange = useCallback((date: Date, calendarIndex: number) => {
    // Adjust base month so calendars stay in sync
    setBaseMonth(addMonths(date, -calendarIndex))
  }, [])

  // Calculate months for each calendar
  const calendarMonths = useMemo(() => {
    const months: Date[] = []
    const effectiveCalendars = isMobile ? 1 : calendars
    for (let i = 0; i < effectiveCalendars; i++) {
      months.push(addMonths(baseMonth, i))
    }
    return isRtl ? months.reverse() : months
  }, [baseMonth, calendars, isMobile, isRtl])

  // Calculate calendar height for preset alignment
  // Calendar: header (48) + weekdays (36) + 6 weeks (36*6=216) + padding (8) = ~308px
  // Plus action buttons if shown: ~52px
  const calendarHeight = showActionButtons ? 360 : 308

  // Render content
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        direction: locale.direction,
      }}
    >
      {/* Presets */}
      {showPresets && !isMobile && (
        <PresetList
          presets={presets}
          value={autoApply ? value : tempValue}
          onSelect={handlePresetSelect}
          locale={locale}
          maxHeight={calendarHeight}
        />
      )}

      {/* Calendars */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Stack
          direction={isRtl ? 'row-reverse' : 'row'}
          spacing={0}
          divider={
            !isMobile && calendars > 1 ? <Divider orientation="vertical" flexItem /> : undefined
          }
        >
          {calendarMonths.map((month, index) => (
            <Calendar
              key={index}
              month={month}
              value={autoApply ? value : tempValue}
              hoveredDate={hoveredDate}
              onDateSelect={handleDateSelect}
              onDateHover={setHoveredDate}
              onMonthChange={(date) =>
                handleMonthChange(date, isRtl ? calendarMonths.length - 1 - index : index)
              }
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              disabledDaysOfWeek={disabledDaysOfWeek}
              weekStartsOn={weekStartsOn}
              locale={locale}
              showQuickJumper={showQuickJumper}
            />
          ))}
        </Stack>

        {/* Mobile presets */}
        {showPresets && isMobile && (
          <>
            <Divider />
            <Box sx={{ p: 1, overflowX: 'auto' }}>
              <Stack direction="row" spacing={1}>
                {(Array.isArray(presets) && 'getValue' in presets[0]
                  ? (presets as PresetRange[])
                  : (presets as PresetGroup[]).flatMap((g) => g.presets)
                )
                  .slice(0, 6)
                  .map((preset, index) => (
                    <Button
                      key={index}
                      size="small"
                      variant="outlined"
                      onClick={() => handlePresetSelect(preset.getValue())}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {preset.label}
                    </Button>
                  ))}
              </Stack>
            </Box>
          </>
        )}

        {/* Action buttons */}
        {showActionButtons && (
          <>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                direction: locale.direction,
              }}
            >
              <Box>
                {showTodayButton && (
                  <Button size="small" onClick={handleToday}>
                    {locale.strings.today}
                  </Button>
                )}
              </Box>
              {!autoApply && (
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={handleCancel}>
                    {locale.strings.cancel}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleApply}
                    disabled={!tempValue.startDate}
                  >
                    {locale.strings.apply}
                  </Button>
                </Stack>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )

  // Render based on variant
  if (variant === 'modal' || (isMobile && variant === 'popover')) {
    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth={isMobile}
        fullScreen={isMobile}
      >
        <DialogContent sx={{ p: 0 }}>{content}</DialogContent>
        {(!showActionButtons || !autoApply) && (
          <DialogActions>
            <Button onClick={handleCancel}>{locale.strings.cancel}</Button>
            <Button variant="contained" onClick={handleApply}>
              {locale.strings.apply}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    )
  }

  if (variant === 'drawer') {
    return (
      <Drawer anchor="bottom" open={open} onClose={handleCancel}>
        {content}
      </Drawer>
    )
  }

  // Default: Popover
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleCancel}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: isRtl ? 'right' : 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: isRtl ? 'right' : 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            boxShadow: theme.shadows[8],
            borderRadius: 2,
            overflow: 'hidden',
          },
        },
      }}
    >
      {content}
    </Popover>
  )
})
