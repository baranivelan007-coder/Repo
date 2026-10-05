import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBg from './GradientBg';

/** Dark gradient screen with the small NAVI MEAL logo above a rounded glass card. */
export default function AuthShell({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const logo = <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />;
  return (
    <View style={{ flex: 1, backgroundColor: '#02060F' }}>
      <GradientBg variant="card" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: Math.max(insets.top + 8, height * 0.12), paddingBottom: Math.max(insets.bottom + 16, height * 0.1), paddingHorizontal: 22 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={scroll}
        >
          <View style={{ alignItems: 'center', marginBottom: 14 }}>{logo}</View>
          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { width: 72, height: 72 },
  card: {
    flex: 1,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#15294A',
    backgroundColor: 'rgba(7,15,32,0.72)',
    paddingHorizontal: 22,
    paddingVertical: 24,
    minHeight: 500,
  },
});
