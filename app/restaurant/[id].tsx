import React, { useMemo } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartBar from '../../src/components/CartBar';
import { Chip, EmptyState } from '../../src/components/Common';
import { AddButton } from '../../src/components/QuantityStepper';
import QuantityStepper from '../../src/components/QuantityStepper';
import { getMenuItem } from '../../src/data/menu';
import { menuForRestaurant, restaurantById } from '../../src/services/api';
import { useCart } from '../../src/store/cart';
import { useFavorites } from '../../src/store/favorites';
import { useAnchor } from '../../src/store/location';
import { toast } from '../../src/store/ui';
import { colors, fonts } from '../../src/theme';
import { MenuItem } from '../../src/types';

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const anchor = useAnchor();
  const r = useMemo(() => restaurantById(String(id), anchor), [id, anchor.latitude, anchor.longitude]);
  const menu = useMemo(() => menuForRestaurant(String(id)), [id]);
  const lines = useCart((s) => s.lines);
  const cartRestaurant = useCart((s) => s.restaurantId);
  const add = useCart((s) => s.add);
  const replaceWith = useCart((s) => s.replaceWith);
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const fav = useFavorites((s) => (r ? s.ids.includes(r.id) : false));
  const toggleFav = useFavorites((s) => s.toggle);

  if (!r) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 20 }}>
        <Pressable style={{ padding: 20 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={colors.cyan} />
        </Pressable>
        <EmptyState icon="alert-circle" title="Restaurant not found" />
      </View>
    );
  }

  const onAdd = (item: MenuItem) => {
    if (!r.isOpen || !item.available) return toast('This item is not available right now');
    if (add(item)) return;
    const other = cartRestaurant ? menuOwnerName(cartRestaurant) : 'another restaurant';
    Alert.alert('Start a new cart?', `Your cart has items from ${other}. Adding this will clear it.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Replace', style: 'destructive', onPress: () => replaceWith(item) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Image source={r.hero} style={styles.hero} />
        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{r.name}</Text>
            <Chip label={r.isOpen ? 'open' : 'closed'} tone={r.isOpen ? 'open' : 'red'} />
          </View>
          <Text style={styles.cuisine}>{r.cuisine}</Text>
          <Text style={styles.rating}>
            <Text style={{ color: colors.gold }}>★ </Text>
            {r.rating.toFixed(1)}  <Text style={{ color: colors.muted }}>({r.reviews} reviews)</Text>
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.info}>📍 {r.distanceKm.toFixed(1)} km</Text>
            <View style={styles.vsep} />
            <Text style={styles.info}>
              <Feather name="clock" size={11} color={colors.textSoft} /> {r.deliveryMin} min
            </Text>
            <View style={styles.vsep} />
            <Text style={styles.info}>🛵 Free delivery above ₹{r.freeAbove}</Text>
          </View>

          <View style={styles.stats}>
            <Stat icon={<Feather name="shopping-bag" size={22} color={colors.green} />} top={`${r.offerPct}% OFF`} bottom={`Up to ₹${r.offerUpTo}`} bold />
            <View style={styles.statSep} />
            <Stat icon={<Feather name="star" size={22} color={colors.cyan} />} top={r.rating.toFixed(1)} bottom="Ratings" />
            <View style={styles.statSep} />
            <Stat icon={<MaterialCommunityIcons name="wallet" size={23} color="#2F7BFF" />} top="₹₹" bottom="Cost for two" />
            <View style={styles.statSep} />
            <Stat icon={<MaterialCommunityIcons name="alarm" size={23} color="#A855F7" />} top={r.etaRange} bottom="Delivery time" bold />
          </View>

          <View style={styles.menuHead}>
            <Text style={styles.menuTitle}>Popular Near You</Text>
            <Pressable hitSlop={8} onPress={() => toast('Full menu is shown below')}>
              <Text style={styles.fullMenu}>View Full Menu ›</Text>
            </Pressable>
          </View>

          {menu.length === 0 ? (
            <EmptyState icon="coffee" title="Menu coming soon" subtitle={`${r.name} hasn't published its menu yet.`} />
          ) : (
            menu.map((item) => {
              const qty = lines[item.id] ?? 0;
              return (
                <View key={item.id} style={styles.item}>
                  <Image source={item.image} style={styles.itemImg} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.itemBottom}>
                      <Text style={styles.price}>₹{item.price}</Text>
                      {qty > 0 ? (
                        <QuantityStepper qty={qty} width={96} onMinus={() => decrement(item.id)} onPlus={() => increment(item.id)} />
                      ) : (
                        <AddButton onPress={() => onAdd(item)} />
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* floating hero buttons */}
      <View style={[styles.heroBtns, { top: insets.top + 8 }]} pointerEvents="box-none">
        <Pressable style={styles.circle} onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable style={styles.circle} onPress={() => toggleFav(r.id)}>
            <Feather name="heart" size={21} color={fav ? '#FF4D6D' : '#fff'} />
          </Pressable>
          <Pressable style={styles.circle} onPress={() => toast('More options are coming soon')}>
            <Feather name="more-vertical" size={21} color="#fff" />
          </Pressable>
        </View>
      </View>

      <CartBar style={{ paddingBottom: Math.max(insets.bottom, 12) }} />
    </View>
  );
}

function menuOwnerName(restaurantId: string) {
  const first = Object.keys(useCart.getState().lines)[0];
  const item = first ? getMenuItem(first) : undefined;
  return item ? restaurantId.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') : 'another restaurant';
}

function Stat({ icon, top, bottom, bold }: { icon: React.ReactNode; top: string; bottom: string; bold?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {icon}
      <Text style={[styles.statTop, bold && { fontFamily: fonts.semi }]}>{top}</Text>
      <Text style={styles.statBottom}>{bottom}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 232 },
  heroBtns: { position: 'absolute', left: 18, right: 18, flexDirection: 'row', justifyContent: 'space-between' },
  circle: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.78)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  sheet: { marginTop: -30, backgroundColor: colors.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 23, paddingTop: 22 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { fontFamily: fonts.semi, fontSize: 27, color: '#fff' },
  cuisine: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.muted, marginTop: 2 },
  rating: { fontFamily: fonts.medium, fontSize: 15, color: '#fff', marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' },
  info: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textSoft },
  vsep: { width: 1, height: 14, backgroundColor: '#3A4558', marginHorizontal: 12 },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 20, borderRadius: 18, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, paddingVertical: 14, paddingHorizontal: 6 },
  statSep: { width: 3, height: 34, borderRadius: 2, backgroundColor: '#3A4558' },
  statTop: { fontFamily: fonts.medium, fontSize: 12, color: '#fff', marginTop: 3 },
  statBottom: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted },
  menuHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  menuTitle: { fontFamily: fonts.semi, fontSize: 19, color: '#fff' },
  fullMenu: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.cyan },
  item: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.cardBorder, padding: 12, marginBottom: 12 },
  itemImg: { width: 124, height: 100, borderRadius: 14 },
  itemName: { fontFamily: fonts.semi, fontSize: 17, color: '#fff' },
  itemDesc: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 17 },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 6 },
  price: { fontFamily: fonts.semi, fontSize: 17, color: colors.cyan },
});
