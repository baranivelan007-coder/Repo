import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

export default function ScreenHeader({ title, onBack }: { title?: string; onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(tabs)')));
  return (
    <View style={[styles.row, { paddingTop: insets.top + 12 }]}>
      <Pressable hitSlop={14} onPress={back}>
        <Feather name="arrow-left" size={28} color={colors.cyan} />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 29, paddingBottom: 14 },
  title: { fontFamily: fonts.semi, fontSize: 22, color: colors.text, marginLeft: 22 },
});
