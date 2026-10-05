import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBg from '../../src/components/GradientBg';
import { useAuth } from '../../src/store/auth';
import { colors, fonts } from '../../src/theme';
import { toast } from '../../src/store/ui';

const ROWS: { icon: keyof typeof Feather.glyphMap; label: string }[] = [
  { icon: 'user', label: 'Personal Information' },
  { icon: 'map-pin', label: 'Saved Addresses' },
  { icon: 'credit-card', label: 'Payment Methods' },
  { icon: 'heart', label: 'Favorites' },
  { icon: 'bell', label: 'Notifications' },
  { icon: 'help-circle', label: 'Help & Support' },
  { icon: 'settings', label: 'Settings' },
];

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const initial = (user?.name ?? 'N').trim().charAt(0).toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: '#030814' }}>
      <GradientBg variant="tab" />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 30, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.avatar}>
            <Text style={styles.initial}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={{ marginTop: 34 }}>
          {ROWS.map((r) => (
            <Pressable key={r.label} style={styles.row} onPress={() => toast(`${r.label} is coming soon`)}>
              <Feather name={r.icon} size={21} color={colors.cyan} />
              <Text style={styles.rowText}>{r.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.muted} />
            </Pressable>
          ))}
          <Pressable
            style={[styles.row, styles.logout]}
            onPress={() => {
              logout();
              router.replace('/login');
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Feather name="log-out" size={19} color={colors.red} />
              <Text style={[styles.rowText, { color: colors.red, flex: 0, marginLeft: 0, fontFamily: fonts.bold }]}>Log Out</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: colors.cyan, backgroundColor: '#12305A', alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.bold, fontSize: 40, color: '#fff' },
  name: { fontFamily: fonts.bold, fontSize: 22, color: '#fff', marginTop: 14 },
  email: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 4 },
  row: { height: 49, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: '#243248', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  rowText: { flex: 1, fontFamily: fonts.semi, fontSize: 14.5, color: '#fff', marginLeft: 14 },
  logout: { backgroundColor: '#2A1115', borderColor: '#5A1E22', marginTop: 8 },
});
