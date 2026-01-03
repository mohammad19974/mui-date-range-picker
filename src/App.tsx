import { useState } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'
import { DateRangePicker } from './components/DateRangePicker'
import { enUSLocale, arSALocale } from './locales'
import type { DateRange, DateRangePickerLocale, PickerVariant } from './types'

// RTL cache
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

// LTR cache
const ltrCache = createCache({
  key: 'mui',
})

function App() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  })
  const [darkMode, setDarkMode] = useState(false)
  const [localeCode, setLocaleCode] = useState<'en-US' | 'ar-SA'>('en-US')
  const [variant, setVariant] = useState<PickerVariant>('popover')
  const [calendars, setCalendars] = useState<1 | 2 | 3>(2)
  const [showPresets, setShowPresets] = useState(true)
  const [autoApply, setAutoApply] = useState(false)

  const locale: DateRangePickerLocale = localeCode === 'ar-SA' ? arSALocale : enUSLocale
  const isRtl = locale.direction === 'rtl'

  const theme = createTheme({
    direction: isRtl ? 'rtl' : 'ltr',
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
    },
    typography: {
      fontFamily: isRtl
        ? '"Noto Sans Arabic", "Roboto", "Helvetica", "Arial", sans-serif'
        : '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  })

  return (
    <CacheProvider value={isRtl ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            py: 4,
            direction: isRtl ? 'rtl' : 'ltr',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
              MUI Date Range Picker
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              A modern, feature-rich date range picker for Material-UI v7
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Controls */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                flexWrap="wrap"
                useFlexGap
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                  }
                  label="Dark Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showPresets}
                      onChange={(e) => setShowPresets(e.target.checked)}
                    />
                  }
                  label="Show Presets"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoApply}
                      onChange={(e) => setAutoApply(e.target.checked)}
                    />
                  }
                  label="Auto Apply"
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Locale</InputLabel>
                  <Select
                    value={localeCode}
                    label="Locale"
                    onChange={(e) => setLocaleCode(e.target.value as 'en-US' | 'ar-SA')}
                  >
                    <MenuItem value="en-US">English</MenuItem>
                    <MenuItem value="ar-SA">العربية</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Variant</InputLabel>
                  <Select
                    value={variant}
                    label="Variant"
                    onChange={(e) => setVariant(e.target.value as PickerVariant)}
                  >
                    <MenuItem value="popover">Popover</MenuItem>
                    <MenuItem value="modal">Modal</MenuItem>
                    <MenuItem value="drawer">Drawer</MenuItem>
                    <MenuItem value="inline">Inline</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Calendars</InputLabel>
                  <Select
                    value={calendars}
                    label="Calendars"
                    onChange={(e) => setCalendars(e.target.value as 1 | 2 | 3)}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Paper>

            {/* Date Range Picker */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Date Range Picker
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  locale={locale}
                  variant={variant}
                  calendars={calendars}
                  showPresets={showPresets}
                  autoApply={autoApply}
                  label={locale.strings.selectRange}
                />
              </Box>

              {/* Selected value display */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected Range:
                </Typography>
                <Typography variant="body1">
                  {dateRange.startDate && dateRange.endDate
                    ? `${dateRange.startDate.toLocaleDateString(localeCode)} - ${dateRange.endDate.toLocaleDateString(localeCode)}`
                    : 'No range selected'}
                </Typography>
              </Box>
            </Paper>

            {/* Features */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Features
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">✅ MUI v7 compatible</Typography>
                <Typography variant="body2">✅ RTL support (Arabic)</Typography>
                <Typography variant="body2">✅ Multiple calendar views (1-3)</Typography>
                <Typography variant="body2">✅ Preset ranges</Typography>
                <Typography variant="body2">✅ Auto-apply mode (no Apply button needed)</Typography>
                <Typography variant="body2">✅ Dark mode support</Typography>
                <Typography variant="body2">✅ Keyboard navigation</Typography>
                <Typography variant="body2">✅ Fully accessible (WCAG 2.1 AA)</Typography>
                <Typography variant="body2">✅ TypeScript support</Typography>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
