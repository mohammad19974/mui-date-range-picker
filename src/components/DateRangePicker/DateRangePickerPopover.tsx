import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react'
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
  Typography,
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
  MobileOptions,
} from '../../types'
import { normalizeRange } from '../../utils/dateUtils'

const defaultMobileOptions: Required<MobileOptions> = {
  breakpoint: 'sm',
  fullScreen: true,
  maxPresets: 6,
  touchFriendly: true,
  showSwipeHint: false,
  swipeNavigation: true,
}

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
  showClearButton?: boolean
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
  /** Mobile-specific configuration */
  mobileOptions?: MobileOptions
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
  showClearButton = false,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  weekStartsOn = 0,
  locale,
  closeOnSelect = false,
  showQuickJumper = true,
  autoApply = false,
  mobileOptions: mobileOptionsProp,
}: DateRangePickerPopoverProps) {
  const theme = useTheme()

  // Merge mobile options with defaults
  const mobileOptions = useMemo(
    () => ({ ...defaultMobileOptions, ...mobileOptionsProp }),
    [mobileOptionsProp]
  )

  const isMobile = useMediaQuery(theme.breakpoints.down(mobileOptions.breakpoint))
  const isRtl = locale.direction === 'rtl'

  // Touch/swipe handling refs
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Handle clear
  const handleClear = useCallback(() => {
    const emptyRange = { startDate: null, endDate: null }
    setTempValue(emptyRange)
    if (autoApply) {
      onChange(emptyRange)
    }
  }, [autoApply, onChange])

  // Handle swipe gestures for mobile month navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!mobileOptions.swipeNavigation || !isMobile) return
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [mobileOptions.swipeNavigation, isMobile])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!mobileOptions.swipeNavigation || !isMobile) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX.current
    const deltaY = Math.abs(touchEndY - touchStartY.current)

    // Only handle horizontal swipes (deltaX > 50px and more horizontal than vertical)
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        // Swipe right - go to previous month (or next for RTL)
        setBaseMonth((prev) => addMonths(prev, isRtl ? 1 : -1))
      } else {
        // Swipe left - go to next month (or previous for RTL)
        setBaseMonth((prev) => addMonths(prev, isRtl ? -1 : 1))
      }
    }
  }, [mobileOptions.swipeNavigation, isMobile, isRtl])

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

  // Get mobile presets list
  const mobilePresetsList = useMemo(() => {
    const allPresets = Array.isArray(presets) && presets.length > 0 && 'getValue' in presets[0]
      ? (presets as PresetRange[])
      : (presets as PresetGroup[]).flatMap((g) => g.presets)

    // If maxPresets is 0, show all presets
    return mobileOptions.maxPresets === 0
      ? allPresets
      : allPresets.slice(0, mobileOptions.maxPresets)
  }, [presets, mobileOptions.maxPresets])

  // Render content
  const content = (
    <Box
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        direction: locale.direction,
        width: isMobile ? '100%' : 'auto',
        maxWidth: '100%',
        overflow: 'hidden',
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
          flex: isMobile ? 1 : 'none',
          minWidth: 0,
        }}
      >
        {/* Swipe hint for mobile */}
        {isMobile && mobileOptions.showSwipeHint && mobileOptions.swipeNavigation && (
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              py: 0.5,
              backgroundColor: 'action.hover',
            }}
          >
            {locale.strings.swipeHint}
          </Typography>
        )}

        <Stack
          direction={isRtl ? 'row-reverse' : 'row'}
          spacing={0}
          divider={
            !isMobile && calendars > 1 ? <Divider orientation="vertical" flexItem /> : undefined
          }
          sx={{
            justifyContent: isMobile ? 'center' : 'flex-start',
          }}
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
              isMobile={isMobile}
              touchFriendly={mobileOptions.touchFriendly}
            />
          ))}
        </Stack>

        {/* Mobile presets */}
        {showPresets && isMobile && mobilePresetsList.length > 0 && (
          <>
            <Divider />
            <Box
              sx={{
                p: 1,
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                '&::-webkit-scrollbar': {
                  height: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'divider',
                  borderRadius: 2,
                },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ width: 'max-content' }}>
                {mobilePresetsList.map((preset, index) => (
                  <Button
                    key={index}
                    size={mobileOptions.touchFriendly ? 'medium' : 'small'}
                    variant="outlined"
                    onClick={() => handlePresetSelect(preset.getValue())}
                    sx={{
                      whiteSpace: 'nowrap',
                      minHeight: mobileOptions.touchFriendly ? 44 : 32,
                      px: mobileOptions.touchFriendly ? 2 : 1.5,
                    }}
                  >
                    {locale.strings.presetLabels?.[preset.label] || preset.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </>
        )}

        {/* Action buttons - hide for drawer (has its own footer) and mobile fullscreen modal/popover */}
        {showActionButtons && variant !== 'drawer' && !(isMobile && mobileOptions.fullScreen && (variant === 'modal' || variant === 'popover')) && (
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
              <Stack direction="row" spacing={1}>
                {showTodayButton && (
                  <Button size="small" onClick={handleToday}>
                    {locale.strings.today}
                  </Button>
                )}
                {showClearButton && (
                  <Button size="small" onClick={handleClear}>
                    {locale.strings.clear}
                  </Button>
                )}
              </Stack>
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
    const useFullScreen = isMobile && mobileOptions.fullScreen

    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth={isMobile}
        fullScreen={useFullScreen}
        PaperProps={{
          sx: {
            ...(useFullScreen && {
              display: 'flex',
              flexDirection: 'column',
            }),
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            flex: useFullScreen ? 1 : 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {content}
        </DialogContent>
        {/* Show dialog actions for mobile fullscreen or when no inline action buttons */}
        {((useFullScreen && !autoApply) || (!showActionButtons && !autoApply)) && (
          <DialogActions
            sx={{
              px: 2,
              py: 1.5,
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" spacing={1}>
              {showTodayButton && (
                <Button size="small" onClick={handleToday}>
                  {locale.strings.today}
                </Button>
              )}
              {showClearButton && (
                <Button size="small" onClick={handleClear}>
                  {locale.strings.clear}
                </Button>
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button onClick={handleCancel}>{locale.strings.cancel}</Button>
              <Button
                variant="contained"
                onClick={handleApply}
                disabled={!tempValue.startDate}
              >
                {locale.strings.apply}
              </Button>
            </Stack>
          </DialogActions>
        )}
      </Dialog>
    )
  }

  if (variant === 'drawer') {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        {/* Drawer handle */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 1,
            pb: 0.5,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'divider',
            }}
          />
        </Box>
        {content}
        {/* Drawer action buttons */}
        {!autoApply && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1}>
              {showTodayButton && (
                <Button size="medium" onClick={handleToday}>
                  {locale.strings.today}
                </Button>
              )}
              {showClearButton && (
                <Button size="medium" onClick={handleClear}>
                  {locale.strings.clear}
                </Button>
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button size="medium" onClick={handleCancel}>
                {locale.strings.cancel}
              </Button>
              <Button
                size="medium"
                variant="contained"
                onClick={handleApply}
                disabled={!tempValue.startDate}
              >
                {locale.strings.apply}
              </Button>
            </Stack>
          </Box>
        )}
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
