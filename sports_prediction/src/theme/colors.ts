/**
 * NBA Arena Dark Theme
 * Neon orange + electric blue accents on deep dark backgrounds.
 */
export const Colors = {
  // Backgrounds
  bgPrimary: '#0B0E1A',
  bgSecondary: '#111427',
  bgCard: 'rgba(25, 30, 56, 0.75)',
  bgGlass: 'rgba(255, 255, 255, 0.06)',

  // Accents
  neonOrange: '#FF6B2B',
  electricBlue: '#3B82F6',
  neonBlueGlow: '#60A5FA',
  accentPurple: '#8B5CF6',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#64748B',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.04)',

  // Gradient combos
  gradientOrange: ['#FF6B2B', '#FF8F5E'] as const,
  gradientBlue: ['#3B82F6', '#60A5FA'] as const,
  gradientDark: ['#0B0E1A', '#111427'] as const,
  gradientCard: ['rgba(25,30,56,0.9)', 'rgba(15,18,36,0.95)'] as const,
  gradientArena: ['#0B0E1A', '#1A1040', '#0B0E1A'] as const,
} as const;
