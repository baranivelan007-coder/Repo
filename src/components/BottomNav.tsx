import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

export type TabKey = 'index' | 'explore' | 'orders' | 'profile';

const TABS: { key: TabKey; label: string; icon: any; active: any }[] = [
  { key: 'index', label: 'Home', icon: 'home-outline', active: 'home' },
  { key: 'explore', label: 'Explore', icon: 'navigate-outline', active: 'navigate' },
  { key: 'orders', label: 'Orders', icon: 'bag-handle-outline', active: 'bag-handle' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', active: 'person' },
];

export default function BottomNav({ active, onPress }: { active: TabKey; onPress: (k: TabKey) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <Pressable key={t.key} style={styles.item} onPress={() => onPress(t.key)} hitSlop={6}>
            <Ionicons name={on ? t.active : t.icon} size={30} color={on ? colors.cyan : '#7C889B'} />
            <Text style={[styles.label, { color: on ? colors.cyan : colors.textSoft }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#030813',
    borderTopWidth: 1,
    borderTopColor: colors.navLine,
    paddingTop: 10,
    marginHorizontal: 0,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontFamily: fonts.medium, fontSize: 12 },
});
