import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { colors } from '../src/theme';
import SimulationRunner from '../src/components/SimulationRunner';
import ToastHost from '../src/components/ToastHost';

export default function RootLayout() {
  const [loaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  if (!loaded) return <View style={{ flex: 1, backgroundColor: '#02060F' }} />;
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="processing" options={{ gestureEnabled: false }} />
        <Stack.Screen name="confirmed" options={{ gestureEnabled: false }} />
        <Stack.Screen name="delivered" options={{ gestureEnabled: false }} />
      </Stack>
      <SimulationRunner />
      <ToastHost />
    </SafeAreaProvider>
  );
}
