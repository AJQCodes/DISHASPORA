export const colors = {
  background: '#FFFFFF',
  surface: '#F6F8F9',
  surfaceAlt: '#EFF3F5',
  brand: '#27EBF5',
  brandDark: '#0FB8C4',
  brandLight: '#D9FCFE',
  blue: '#33CFFF',
  blueDark: '#0E9FD8',
  blueLight: '#E3F7FF',
  accent: '#FF9F43',
  accentDark: '#F27F0C',
  accentLight: '#FFF1E0',
  ink: '#17252A',
  inkSoft: '#5C6B73',
  inkFaint: '#9AA7AE',
  danger: '#E5484D',
  success: '#2FBF71',
  star: '#FFC120',
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 28 };

export const shadow = {
  shadowColor: '#17252A',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
} as const;

export const shadowStrong = {
  shadowColor: '#17252A',
  shadowOpacity: 0.12,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
} as const;
