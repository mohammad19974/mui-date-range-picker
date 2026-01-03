import { memo, useCallback } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  alpha,
} from '@mui/material'
import type { PresetRange, PresetGroup, DateRange, DateRangePickerLocale } from '../../types'
import { areRangesEqual } from '../../utils/dateUtils'

export interface PresetListProps {
  presets: PresetRange[] | PresetGroup[]
  value: DateRange
  onSelect: (range: DateRange) => void
  locale: DateRangePickerLocale
  showShortcuts?: boolean
  /** Max height to align with calendar */
  maxHeight?: number
}

/**
 * Check if presets are grouped
 */
function isGroupedPresets(presets: PresetRange[] | PresetGroup[]): presets is PresetGroup[] {
  return presets.length > 0 && 'presets' in presets[0]
}

export const PresetList = memo(function PresetList({
  presets,
  value,
  onSelect,
  locale,
  showShortcuts = true,
  maxHeight,
}: PresetListProps) {
  const theme = useTheme()
  const isRtl = locale.direction === 'rtl'

  const handlePresetClick = useCallback(
    (preset: PresetRange) => {
      const range = preset.getValue()
      onSelect(range)
    },
    [onSelect]
  )

  const renderPresetItem = (preset: PresetRange, index: number) => {
    const presetRange = preset.getValue()
    const isSelected = areRangesEqual(presetRange, value)

    return (
      <ListItem key={`${preset.label}-${index}`} disablePadding>
        <ListItemButton
          onClick={() => handlePresetClick(preset)}
          selected={isSelected}
          sx={{
            py: 0.75,
            px: 2,
            borderRadius: 1,
            mx: 1,
            my: 0.25,
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.18),
              },
            },
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemText
            primary={preset.label}
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'primary.main' : 'text.primary',
            }}
          />
          {showShortcuts && preset.shortcut && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                ml: isRtl ? 0 : 1,
                mr: isRtl ? 1 : 0,
                fontFamily: 'monospace',
                backgroundColor: theme.palette.action.hover,
                px: 0.75,
                py: 0.25,
                borderRadius: 0.5,
              }}
            >
              {preset.shortcut}
            </Typography>
          )}
        </ListItemButton>
      </ListItem>
    )
  }

  const containerStyles = {
    width: 180,
    borderRight: isRtl ? 'none' : `1px solid ${theme.palette.divider}`,
    borderLeft: isRtl ? `1px solid ${theme.palette.divider}` : 'none',
    direction: locale.direction,
    overflowY: 'auto' as const,
    height: maxHeight || 'auto',
    maxHeight: maxHeight || 400,
    py: 1,
  }

  if (isGroupedPresets(presets)) {
    return (
      <Box
        sx={{
          ...containerStyles,
          width: 200,
        }}
        role="listbox"
        aria-label="Date range presets"
      >
        {presets.map((group, groupIndex) => (
          <Box key={group.label}>
            {groupIndex > 0 && <Divider sx={{ my: 0.5 }} />}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                px: 2,
                py: 1,
                color: theme.palette.text.secondary,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {group.label}
            </Typography>
            <List disablePadding dense>
              {group.presets.map((preset, index) => renderPresetItem(preset, index))}
            </List>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={containerStyles} role="listbox" aria-label="Date range presets">
      <List disablePadding dense>
        {presets.map((preset, index) => renderPresetItem(preset, index))}
      </List>
    </Box>
  )
})
