import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import GradientBg from '../src/components/GradientBg';
import PrimaryButton from '../src/components/PrimaryButton';
import { useHydrated } from '../src/hooks/useHydrated';
import { useAuth } from '../src/store/auth';
import { useLocationStore } from '../src/store/location';

export default function Splash() {
  const router = useRouter();
  const ready = useHydrated();
  const user = useAuth((s) => s.user);
  const onboarded = useAuth((s) => s.onboarded);
  const asked = useLocationStore((s) => s.asked);

  // Returning, signed-in users skip straight into the app.
  useEffect(() => {
    if (!ready || !user) return;
    const t = setTimeout(() => router.replace(asked ? '/(tabs)' : '/location'), 1400);
    return () => clearTimeout(t);
  }, [ready, user, asked, router]);

  return (
    <View style={styles.root}>
      <GradientBg variant="splash" />
      <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      {ready && !user ? (
        <PrimaryButton
          title="Get Started"
          style={styles.btn}
          height={50}
          radius={14}
          fontSize={19}
          onPress={() => router.replace(onboarded ? '/login' : '/onboarding')}
        />
      ) : (
        <View style={{ height: 50, marginTop: 56 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#02060F', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 300, height: 300 },
  btn: { width: 265, marginTop: 56 },
});
