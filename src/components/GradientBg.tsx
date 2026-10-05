import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Variant = 'splash' | 'card' | 'tab';
const CONFIG: Record<Variant, { colors: [string, string, ...string[]]; locations: [number, number, ...number[]] }> = {
  // blue glow top & bottom, black in the middle (splash / auth / onboarding)
  splash: { colors: ['#12307A', '#03081A', '#02060F', '#02060F', '#0E2A6E'], locations: [0, 0.27, 0.45, 0.68, 1] },
  card: { colors: ['#12307A', '#03081A', '#02060F', '#02060F', '#0E2A6E'], locations: [0, 0.27, 0.45, 0.68, 1] },
  // Orders / Explore / Profile: blue wash at the top fading to navy
  tab: { colors: ['#10307E', '#071636', '#040A18', '#030814'], locations: [0, 0.2, 0.45, 1] },
};

export default function GradientBg({ variant = 'splash' }: { variant?: Variant }) {
  const c = CONFIG[variant];
  return <LinearGradient colors={c.colors} locations={c.locations} style={StyleSheet.absoluteFill} />;
}
