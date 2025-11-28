export const Colors = {
  // Brand colors
  brand: {
    primary: '#00a294',
    accent: '#10b981',
    dark: '#1a1a1a',
    darker: '#0a0a0a',
  },

  zinc: {
    950: '#09090b',
    900: '#18181b',
    800: '#27272a',
    700: '#3f3f46',
    600: '#52525b',
    500: '#71717a',
    400: '#a1a1aa',
    300: '#d4d4d8',
    200: '#e4e4e7',
    100: '#f4f4f5',
  },

  background: {
    primary: '#0a0a0a', // zinc-950
    secondary: '#1a1a1a',
    tertiary: '#292929',
    card: 'rgba(41, 41, 41, 0.5)', // Glassmorphic
    cardBorder: 'rgba(147, 147, 147, 0.3)',
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa', // zinc-400
    tertiary: '#71717a', // zinc-500
    muted: '#52525b', // zinc-600
    assistant: '#d4d4d8', // zinc-300
  },

  // UI element colors
  ui: {
    border: 'rgba(147, 147, 147, 0.3)',
    borderLight: 'rgba(255, 255, 255, 0.18)',
    divider: '#27272a', // zinc-800
    overlay: 'rgba(0, 0, 0, 0.6)',
  },

  // Message bubble colors
  message: {
    user: {
      background: '#18181b', // zinc-900
      border: '#27272a', // zinc-800
      text: '#f4f4f5', // zinc-100
    },
    assistant: {
      background: 'transparent',
      text: '#d4d4d8', // zinc-300
    },
  },

  // Status colors
  status: {
    success: '#10b981', // emerald-500
    error: '#f87171', // red-400
    errorDark: '#dc2626', // red-600
    warning: '#f59e0b', // amber-500
    info: '#3b82f6', // blue-500
  },

  // Gradient colors
  gradient: {
    emeraldStart: '#10b981', // emerald-500
    emeraldEnd: '#14b8a6', // teal-500
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    normal: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};
