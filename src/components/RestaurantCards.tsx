import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { Restaurant } from '../types';
import { useFavorites } from '../store/favorites';

function Heart({ id, size = 20 }: { id: string; size?: number }) {
  const fav = useFavorites((s) => s.ids.includes(id));
  const toggle = useFavorites((s) => s.toggle);
  return (
    <Pressable hitSlop={10} onPress={() => toggle(id)} style={styles.heart}>
      <Feather name="heart" size={size} color={fav ? '#FF4D6D' : '#fff'} />
    </Pressable>
  );
}

/** Small card used in the Home "Nearby Restaurants" carousel. */
export function HomeCard({ r, selected, onPress }: { r: Restaurant; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.homeCard, selected && { borderColor: colors.cyan }]}>
      <View>
        <Image source={r.hero} style={styles.homeImg} />
        <Heart id={r.id} size={19} />
      </View>
      <View style={{ paddingHorizontal: 9, paddingTop: 7 }}>
        <Text style={styles.homeName} numberOfLines={1}>{r.name}</Text>
        <Text style={styles.homeCuisine} numberOfLines={1}>{r.cuisine.replace(' • ', ' • ')}</Text>
        <Text style={styles.homeRate}>
          <Text style={{ color: colors.gold }}>★ </Text>{r.rating.toFixed(1)} <Text style={{ color: colors.muted }}>({r.reviews})</Text>
        </Text>
        <Text style={styles.homeMeta}>{r.deliveryMin} min  •  {r.distanceKm.toFixed(1)} km</Text>
      </View>
    </Pressable>
  );
}

/** Large card for "Popular Restaurants" in Explore. */
export function PopularCard({ r, onPress }: { r: Restaurant; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.popCard}>
      <Image source={r.wide} style={styles.popImg} />
      <View style={{ padding: 14 }}>
        <Text style={styles.popName}>{r.name}</Text>
        <Text style={styles.popRate}>
          <Text style={{ color: colors.gold }}>★ </Text>{r.rating.toFixed(1)} <Text style={{ color: colors.muted, fontSize: 11.5 }}> • {r.cuisine.split(' • ')[0]}</Text>
        </Text>
        <Text style={styles.popMeta}>₹{r.priceForTwo} for two • {r.deliveryMin} mins</Text>
      </View>
    </Pressable>
  );
}

/** Horizontal list row for "Nearby Restaurants" in Explore. */
export function ListRow({ r, onPress }: { r: Restaurant; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Image source={r.wide} style={styles.rowImg} />
      <View style={{ marginLeft: 14, flex: 1 }}>
        <Text style={styles.rowName}>{r.name}</Text>
        <Text style={styles.rowCuisine}>{r.cuisine}</Text>
        <Text style={styles.rowMeta}>
          <Text style={{ color: colors.gold }}>★ </Text>{r.rating.toFixed(1)}  •  {r.distanceKm.toFixed(1)} km  •  {r.deliveryMin} mins
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heart: { position: 'absolute', right: 8, bottom: 8 },
  homeCard: { width: 132, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden', paddingBottom: 9 },
  homeImg: { width: '100%', height: 84 },
  homeName: { fontFamily: fonts.semi, fontSize: 13.5, color: colors.text },
  homeCuisine: { fontFamily: fonts.regular, fontSize: 9.5, color: colors.muted },
  homeRate: { fontFamily: fonts.semi, fontSize: 10.5, color: colors.text, marginTop: 3 },
  homeMeta: { fontFamily: fonts.semi, fontSize: 10.5, color: colors.text, marginTop: 1 },
  popCard: { width: 240, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden', marginRight: 14 },
  popImg: { width: '100%', height: 120 },
  popName: { fontFamily: fonts.semi, fontSize: 17, color: colors.text },
  popRate: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, marginTop: 4 },
  popMeta: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textSoft, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.cardBorder, padding: 11, marginBottom: 12 },
  rowImg: { width: 70, height: 70, borderRadius: 14 },
  rowName: { fontFamily: fonts.semi, fontSize: 17, color: colors.text },
  rowCuisine: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted },
  rowMeta: { fontFamily: fonts.medium, fontSize: 12, color: colors.textSoft, marginTop: 2 },
});
