import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AuthShell from '../src/components/AuthShell';
import PrimaryButton from '../src/components/PrimaryButton';
import { colors, fonts } from '../src/theme';
import { useLocationStore } from '../src/store/location';
import { toast } from '../src/store/ui';

export default function LocationPermission() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const allow = async () => {
    setBusy(true);
    const ok = await useLocationStore.getState().requestPermission();
    setBusy(false);
    if (!ok) toast('Location is off - showing restaurants around Anna Nagar');
    router.replace('/(tabs)');
  };
  const notNow = () => {
    useLocationStore.getState().markAsked();
    router.replace('/(tabs)');
  };

  return (
    <AuthShell scroll={false}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../assets/images/location.jpg')} style={styles.img} />
        <Text style={styles.title}>Find Food Near You</Text>
        <Text style={styles.body}>
          Allow location access to discover restaurants, get accurate delivery times, and track your order in real time.
        </Text>
      </View>
      <PrimaryButton title="Allow Location" height={50} radius={14} fontSize={20} loading={busy} onPress={allow} />
      <Pressable onPress={notNow} style={{ alignItems: 'center', marginTop: 16 }} hitSlop={10}>
        <Text style={styles.notNow}>Not Now</Text>
      </Pressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  img: { width: 150, height: 150, borderRadius: 24, marginBottom: 28 },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, textAlign: 'center' },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.text, textAlign: 'center', marginTop: 14, paddingHorizontal: 14 },
  notNow: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSoft },
});
