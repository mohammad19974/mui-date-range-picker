import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box, Stack, Typography } from '@mui/material'
import { Calendar } from '../src/components/Calendar'
import { enUSLocale, arSALocale } from '../src/locales'
import type { DateRange } from '../src/types'

const lightTheme = createTheme({
  palette: { mode: 'light' },
})

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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

export default meta
type Story = StoryObj<typeof Calendar>

// Interactive calendar
const InteractiveCalendar = () => {
  const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const handleDateSelect = (date: Date) => {
    if (!value.startDate || value.endDate) {
      setValue({ startDate: date, endDate: null })
    } else {
      setValue({ ...value, endDate: date })
    }
  }

  return (
    <Stack spacing={2} alignItems="center">
      <Calendar
        value={value}
        hoveredDate={hoveredDate}
        onDateSelect={handleDateSelect}
        onDateHover={setHoveredDate}
        locale={enUSLocale}
      />
      <Typography variant="body2">
        Selected: {value.startDate?.toLocaleDateString()} - {value.endDate?.toLocaleDateString()}
      </Typography>
    </Stack>
  )
}

export const Default: Story = {
  render: () => <InteractiveCalendar />,
}

// With week numbers
export const WithWeekNumbers: Story = {
  args: {
    value: { startDate: null, endDate: null },
    onDateSelect: () => {},
    locale: enUSLocale,
    showWeekNumbers: true,
  },
}

// Week starts Monday
export const WeekStartsMonday: Story = {
  args: {
    value: { startDate: null, endDate: null },
    onDateSelect: () => {},
    locale: enUSLocale,
    weekStartsOn: 1,
  },
}

// With min/max dates
export const WithMinMaxDates: Story = {
  args: {
    value: { startDate: null, endDate: null },
    onDateSelect: () => {},
    locale: enUSLocale,
    minDate: new Date(2024, 0, 10),
    maxDate: new Date(2024, 0, 25),
  },
}

// Disabled weekends
export const DisabledWeekends: Story = {
  args: {
    value: { startDate: null, endDate: null },
    onDateSelect: () => {},
    locale: enUSLocale,
    disabledDaysOfWeek: [0, 6],
  },
}

// Arabic RTL
export const ArabicRTL: Story = {
  args: {
    value: { startDate: null, endDate: null },
    onDateSelect: () => {},
    locale: arSALocale,
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <CssBaseline />
        <Box sx={{ p: 4, direction: 'rtl' }}>
          <Story />
        </Box>
      </ThemeProvider>
    ),
  ],
}

// Without quick jumper
export const WithoutQuickJumper: Story = {
  args: {
    value: { startDate: null, endDate: null },
    onDateSelect: () => {},
    locale: enUSLocale,
    showQuickJumper: false,
  },
}

// Pre-selected range
export const WithSelectedRange: Story = {
  args: {
    value: {
      startDate: new Date(2024, 0, 10),
      endDate: new Date(2024, 0, 20),
    },
    onDateSelect: () => {},
    locale: enUSLocale,
  },
}
