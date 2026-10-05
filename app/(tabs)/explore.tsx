import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBg from '../../src/components/GradientBg';
import { EmptyState } from '../../src/components/Common';
import { ListRow, PopularCard } from '../../src/components/RestaurantCards';
import { CATEGORY_CHIPS } from '../../src/data/restaurants';
import { nearbyRestaurants } from '../../src/services/api';
import { useAnchor } from '../../src/store/location';
import { colors, fonts } from '../../src/theme';
import { toast } from '../../src/store/ui';

const POPULAR = ['pizza-corner', 'burger-house', 'morning-brew'];

export default function Explore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const anchor = useAnchor();
  const inputRef = useRef<TextInput>(null);
  const [q, setQ] = useState('');
  const [chip, setChip] = useState<string | null>(null);

  useEffect(() => {
    if (focus) setTimeout(() => inputRef.current?.focus(), 250);
  }, [focus]);

  const all = useMemo(() => nearbyRestaurants(anchor), [anchor.latitude, anchor.longitude]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all.filter((r) => {
      const hay = `${r.name} ${r.cuisine} ${r.tags.join(' ')}`.toLowerCase();
      const okQ = !term || hay.includes(term);
      const okC = !chip || r.tags.some((t) => t.toLowerCase() === chip.toLowerCase());
      return okQ && okC;
    });
  }, [all, q, chip]);

  const popular = filtered.filter((r) => POPULAR.includes(r.id));
  const nearby = filtered.filter((r) => !POPULAR.includes(r.id)).sort((a, b) => a.distanceKm - b.distanceKm);
  const open = (id: string) => router.push({ pathname: '/restaurant/[id]', params: { id } });

  return (
    <View style={{ flex: 1, backgroundColor: '#030814' }}>
      <GradientBg variant="tab" />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <View style={styles.search}>
            <Feather name="search" size={22} color={colors.muted} />
            <TextInput
              ref={inputRef}
              value={q}
              onChangeText={setQ}
              placeholder="Find foods or restaurants..."
              placeholderTextColor={colors.muted}
              style={styles.input}
              returnKeyType="search"
            />
            {q ? (
              <Pressable hitSlop={10} onPress={() => setQ('')}>
                <Feather name="x" size={18} color={colors.muted} />
              </Pressable>
            ) : null}
          </View>
          <Pressable style={styles.filter} onPress={() => toast('More filters are coming soon')}>
            <Feather name="filter" size={22} color={colors.cyan} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10, paddingVertical: 14 }}>
          {CATEGORY_CHIPS.map((c) => {
            const on = chip === c;
            return (
              <Pressable key={c} onPress={() => setChip(on ? null : c)} style={[styles.chip, on && styles.chipOn]}>
                <Text style={[styles.chipText, on && { color: colors.onCyan, fontFamily: fonts.semi }]}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {filtered.length === 0 ? (
          <EmptyState title="No restaurants found" subtitle="Try a different search or category." />
        ) : (
          <>
            {popular.length > 0 && (
              <>
                <Text style={styles.section}>Popular Restaurants</Text>
                <FlatList
                  horizontal
                  data={popular}
                  keyExtractor={(r) => r.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 6 }}
                  renderItem={({ item }) => <PopularCard r={item} onPress={() => open(item.id)} />}
                />
              </>
            )}
            {nearby.length > 0 && (
              <>
                <Text style={[styles.section, { marginTop: 22 }]}>Nearby Restaurants</Text>
                <View style={{ paddingHorizontal: 24 }}>
                  {nearby.map((r) => (
                    <ListRow key={r.id} r={r} onPress={() => open(r.id)} />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12 },
  search: { flex: 1, height: 52, borderRadius: 16, backgroundColor: '#12203A', borderWidth: 1, borderColor: colors.cardBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text, paddingVertical: 0 },
  filter: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#12203A', borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center' },
  chip: { height: 40, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: '#243248', backgroundColor: '#0A1424', alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  chipText: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  section: { fontFamily: fonts.semi, fontSize: 19, color: colors.text, paddingHorizontal: 24, marginBottom: 12 },
});
