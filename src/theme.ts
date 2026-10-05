// Design tokens extracted from the NAVI MEAL Figma design.
export const colors = {
  bg: '#040812',
  bgHome: '#050B17',
  card: '#0F1A2B',
  cardBorder: '#1C2A40',
  cyan: '#6AD3FF',
  onCyan: '#06101F',
  text: '#FFFFFF',
  textSoft: '#C9D2E0',
  muted: '#8A96A8',
  faint: '#5C6677',
  green: '#22C55E',
  greenBg: '#0D3A28',
  red: '#EF4444',
  redBg: '#3A1014',
  blue: '#2F7BFF',
  blueBg: '#123A8C',
  gold: '#F5A623',
  inputBg: '#2A3342',
  inputBorder: '#3D4859',
  navLine: '#121B2B',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semi: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const radius = { card: 18, button: 18, input: 14, sheet: 28 };

// Used only when location permission is denied / unavailable (Anna Nagar, Chennai).
export const FALLBACK_LOCATION = { latitude: 13.085, longitude: 80.2101 };
export const FALLBACK_PLACE = 'Anna Nagar, Chennai';
