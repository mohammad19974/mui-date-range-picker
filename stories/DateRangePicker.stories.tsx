import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box, Stack, Typography } from '@mui/material'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'
import { DateRangePicker } from '../src/components/DateRangePicker'
import { enUSLocale, arSALocale } from '../src/locales'
import { groupedPresets } from '../src/components/Presets'
import type { DateRange } from '../src/types'

// RTL cache
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

// LTR cache
const ltrCache = createCache({
  key: 'mui',
})

const lightTheme = createTheme({
  palette: { mode: 'light' },
})

const darkTheme = createTheme({
  palette: { mode: 'dark' },
})

const rtlTheme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Noto Sans Arabic", "Roboto", "Helvetica", "Arial", sans-serif',
  },
})

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Box sx={{ p: 4, minWidth: 400 }}>
          <Story />
        </Box>
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

// Basic usage
export const Default: Story = {
  args: {
    label: 'Select Date Range',
    locale: enUSLocale,
  },
}

// Controlled component
const ControlledExample = () => {
  const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })

  return (
    <Stack spacing={2}>
      <DateRangePicker
        value={value}
        onChange={setValue}
        label="Controlled Picker"
        locale={enUSLocale}
      />
      <Typography variant="body2">
        Selected: {value.startDate?.toLocaleDateString()} - {value.endDate?.toLocaleDateString()}
      </Typography>
    </Stack>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

// With presets
export const WithPresets: Story = {
  args: {
    label: 'With Preset Ranges',
    showPresets: true,
    locale: enUSLocale,
  },
}

// Grouped presets
export const WithGroupedPresets: Story = {
  args: {
    label: 'With Grouped Presets',
    showPresets: true,
    presets: groupedPresets,
    locale: enUSLocale,
  },
}

// Single calendar
export const SingleCalendar: Story = {
  args: {
    label: 'Single Calendar',
    calendars: 1,
    locale: enUSLocale,
  },
}

// Triple calendar
export const TripleCalendar: Story = {
  args: {
    label: 'Triple Calendar',
    calendars: 3,
    locale: enUSLocale,
  },
}

// Without presets
export const WithoutPresets: Story = {
  args: {
    label: 'Without Presets',
    showPresets: false,
    locale: enUSLocale,
  },
}

// Modal variant
export const ModalVariant: Story = {
  args: {
    label: 'Modal Variant',
    variant: 'modal',
    locale: enUSLocale,
  },
}

// Drawer variant
export const DrawerVariant: Story = {
  args: {
    label: 'Drawer Variant',
    variant: 'drawer',
    locale: enUSLocale,
  },
}

// Inline variant
export const InlineVariant: Story = {
  args: {
    label: 'Inline Variant',
    variant: 'inline',
    locale: enUSLocale,
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Box sx={{ p: 4 }}>
          <Story />
        </Box>
      </ThemeProvider>
    ),
  ],
}

// With min/max dates
export const WithMinMaxDates: Story = {
  args: {
    label: 'With Date Restrictions',
    minDate: new Date(2024, 0, 1),
    maxDate: new Date(2024, 11, 31),
    locale: enUSLocale,
  },
}

// Disabled dates
export const WithDisabledDates: Story = {
  args: {
    label: 'With Disabled Dates',
    disabledDates: [new Date(2024, 0, 15), new Date(2024, 0, 16), new Date(2024, 0, 17)],
    locale: enUSLocale,
  },
}

// Disabled weekends
export const DisabledWeekends: Story = {
  args: {
    label: 'Disabled Weekends',
    disabledDaysOfWeek: [0, 6], // Sunday and Saturday
    locale: enUSLocale,
  },
}

// Week starts on Monday
export const WeekStartsMonday: Story = {
  args: {
    label: 'Week Starts on Monday',
    weekStartsOn: 1,
    locale: enUSLocale,
  },
}

// Arabic RTL
const ArabicRTLExample = () => {
  const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })

  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={rtlTheme}>
        <CssBaseline />
        <Box sx={{ p: 4, minWidth: 400, direction: 'rtl' }}>
          <DateRangePicker
            value={value}
            onChange={setValue}
            locale={arSALocale}
            label={arSALocale.strings.selectRange}
          />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  )
}

export const ArabicRTL: Story = {
  render: () => <ArabicRTLExample />,
  decorators: [], // Remove default decorator
}

// Dark mode
const DarkModeExample = () => {
  const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 4, minWidth: 400, bgcolor: 'background.default' }}>
        <DateRangePicker value={value} onChange={setValue} locale={enUSLocale} label="Dark Mode" />
      </Box>
    </ThemeProvider>
  )
}

export const DarkMode: Story = {
  render: () => <DarkModeExample />,
  decorators: [], // Remove default decorator
}

// Disabled state
export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
    locale: enUSLocale,
  },
}

// Error state
export const WithError: Story = {
  args: {
    label: 'With Error',
    error: true,
    helperText: 'Please select a valid date range',
    locale: enUSLocale,
  },
}

// Custom date format
export const CustomDateFormat: Story = {
  args: {
    label: 'Custom Date Format',
    dateFormat: 'dd/MM/yyyy',
    locale: enUSLocale,
  },
}

// Close on select (no action buttons)
export const CloseOnSelect: Story = {
  args: {
    label: 'Close on Select',
    showActionButtons: false,
    closeOnSelect: true,
    locale: enUSLocale,
  },
}

// Auto apply mode
const AutoApplyExample = () => {
  const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })

  return (
    <Stack spacing={2}>
      <DateRangePicker
        value={value}
        onChange={setValue}
        label="Auto Apply Mode"
        autoApply={true}
        locale={enUSLocale}
      />
      <Typography variant="body2">
        Selected: {value.startDate?.toLocaleDateString()} - {value.endDate?.toLocaleDateString()}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Selections are automatically applied without clicking Apply button
      </Typography>
    </Stack>
  )
}

export const AutoApply: Story = {
  render: () => <AutoApplyExample />,
}

// Auto apply with close on select
export const AutoApplyWithCloseOnSelect: Story = {
  args: {
    label: 'Auto Apply + Close on Select',
    autoApply: true,
    closeOnSelect: true,
    locale: enUSLocale,
  },
}

// Without clear button
export const WithoutClearButton: Story = {
  args: {
    label: 'Without Clear Button',
    showClearButton: false,
    locale: enUSLocale,
  },
}

// Small size
export const SmallSize: Story = {
  render: () => <DateRangePicker label="Small Size" locale={enUSLocale} />,
}
