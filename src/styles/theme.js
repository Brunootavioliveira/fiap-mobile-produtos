// Tema central do app — cores, fontes e estilos reutilizáveis
export const colors = {
  primary: '#4F46E5',       // indigo-600
  primaryDark: '#3730A3',   // indigo-800
  primaryLight: '#EEF2FF',  // indigo-50
  accent: '#7C3AED',        // violet-600
  success: '#059669',       // emerald-600
  danger: '#DC2626',        // red-600
  warning: '#D97706',       // amber-600
  text: '#111827',          // gray-900
  textSecondary: '#6B7280', // gray-500
  border: '#E5E7EB',        // gray-200
  inputBg: '#F9FAFB',       // gray-50
  white: '#FFFFFF',
  background: '#F3F4F6',    // gray-100
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 14, color: colors.text },
  caption: { fontSize: 12, color: colors.textSecondary },
  link: { fontSize: 14, color: colors.primary, fontWeight: '500' },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
