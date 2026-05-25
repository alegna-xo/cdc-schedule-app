/**
 * CDC Schedule App — Color Tokens
 * Single source of truth for all colors.
 * Import this wherever color values are needed.
 * When a color changes, it changes everywhere.
 */

const colors = {
  // Royal blue — primary brand, headers, buttons, active states
  blue:         '#2563EB',
  blueDark:     '#1D4ED8',
  blueLight:    '#EFF6FF',
  blueMid:      '#DBEAFE',
  blueBorder:   '#BFDBFE',

  // Fire red — alerts, closed states, accents
  red:          '#EF4444',
  redDark:      '#DC2626',
  redLight:     '#FEF2F2',
  redBorder:    '#FECACA',

  // Grape purple — Breaker Shift, military child badge, first-time callout
  purple:       '#9333EA',
  purpleDark:   '#7E22CE',
  purpleLight:  '#F5F3FF',
  purpleBorder: '#DDD6FE',

  // Whites & backgrounds
  white:        '#FFFFFF',
  offWhite:     '#F8FAFF',
  border:       '#E5EAFF',
  borderDark:   '#C7D2FE',

  // Typography
  textPrimary:  '#1E293B',
  textMuted:    '#64748B',
  textLight:    '#94A3B8',

  // Status — success
  success:      '#16A34A',
  successBg:    '#F0FDF4',
  successBd:    '#BBF7D0',

  // Status — warning
  warn:         '#92400E',
  warnBg:       '#FFFBEB',
  warnBd:       '#FDE68A',
};

export default colors;