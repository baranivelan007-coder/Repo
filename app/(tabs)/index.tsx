import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import MapView, { Circle } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeCard } from '../../src/components/RestaurantCards';
import { PinMarker, RestaurantPin, UserDot } from '../../src/components/MapPins';
import { colors, fonts } from '../../src/theme';
import { nearbyRestaurants } from '../../src/services/api';
import { useAnchor, useLocationStore } from '../../src/store/location';
import { toast } from '../../src/store/ui';

const CARD_W = 132 + 12;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const anchor = useAnchor();
  const placeName = useLocationStore((s) => s.placeName);
  const refresh = useLocationStore((s) => s.refresh);
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const restaurants = useMemo(() => nearbyRestaurants(anchor), [anchor.latitude, anchor.longitude]);

  const region = useMemo(
    () => ({ latitude: anchor.latitude - 0.0038, longitude: anchor.longitude, latitudeDelta: 0.052, longitudeDelta: 0.036 }),
    [anchor.latitude, anchor.longitude]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    mapRef.current?.animateToRegion(region, 600);
  }, [region]);

  const open = (id: string) => router.push({ pathname: '/restaurant/[id]', params: { id } });

  const onPin = (id: string, index: number) => {
    if (selected === id) return open(id); // second tap opens the restaurant
    setSelected(id);
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgHome }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        toolbarEnabled={false}
        showsCompass={false}
        showsPointsOfInterest
        rotateEnabled={false}
        onPress={() => setSelected(null)}
      >
        <Circle center={anchor} radius={520} fillColor="rgba(47,123,255,0.20)" strokeColor="rgba(47,123,255,0.28)" strokeWidth={1} />
        <PinMarker coordinate={anchor} zIndex={5}>
          <UserDot />
        </PinMarker>
        {restaurants.map((r, i) => (
          <PinMarker key={r.id} coordinate={r.coords} anchor={{ x: 0.5, y: 0.3 }} zIndex={selected === r.id ? 10 : 1} onPress={() => onPin(r.id, i)}>
            <RestaurantPin color={r.pinColor} icon={r.pinIcon} minutes={r.deliveryMin} rating={r.rating} selected={selected === r.id} />
          </PinMarker>
        ))}
      </MapView>

      {/* top panel */}
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <Ionicons name="location" size={30} color={colors.cyan} />
          <Pressable style={{ flex: 1, marginLeft: 8 }} onPress={() => toast('Delivery address picker is coming soon')}>
            <Text style={styles.deliver}>Deliver to</Text>
            <Text style={styles.place} numberOfLines={1}>
              {placeName} <Feather name="chevron-down" size={13} color="#fff" />
            </Text>
          </Pressable>
          <Pressable hitSlop={10} onPress={() => toast('No new notifications')} style={{ marginRight: 18 }}>
            <Feather name="bell" size={25} color="#fff" />
            <View style={styles.dot} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => router.navigate('/profile')}>
            <Feather name="user" size={25} color="#fff" />
          </Pressable>
        </View>
        <Pressable style={styles.search} onPress={() => router.navigate({ pathname: '/explore', params: { focus: String(Date.now()) } })}>
          <Feather name="search" size={22} color="#C9D2E0" />
          <Text style={styles.searchText}>Search restaurants or food</Text>
          <View style={styles.sep} />
          <Feather name="filter" size={22} color="#C9D2E0" />
        </Pressable>
      </View>

      {/* locate-me button */}
      <Pressable style={styles.locate} onPress={() => mapRef.current?.animateToRegion(region, 500)}>
        <Ionicons name="location-outline" size={24} color="#2F7BFF" />
      </Pressable>

      {/* bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHead}>
          <Text style={styles.sheetTitle}>Nearby Restaurants</Text>
          <Pressable hitSlop={10} onPress={() => router.navigate('/explore')}>
            <Text style={styles.seeAll}>See All  ›</Text>
          </Pressable>
        </View>
        <FlatList
          ref={listRef}
          data={restaurants}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 14 }}
          getItemLayout={(_, i) => ({ length: CARD_W, offset: 16 + CARD_W * i, index: i })}
          renderItem={({ item }) => <HomeCard r={item} selected={selected === item.id} onPress={() => open(item.id)} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.bgHome, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, paddingHorizontal: 20, paddingBottom: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  deliver: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSoft },
  place: { fontFamily: fonts.semi, fontSize: 13.5, color: '#fff' },
  dot: { position: 'absolute', right: 1, top: -1, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.cyan },
  search: { height: 52, borderRadius: 16, backgroundColor: '#101B2E', borderWidth: 1, borderColor: colors.cardBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 },
  searchText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginLeft: 16 },
  sep: { width: 1, height: 28, backgroundColor: '#2A374D', marginRight: 16 },
  locate: { position: 'absolute', right: 14, bottom: 232, width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6 },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.bgHome, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 14 },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  sheetTitle: { fontFamily: fonts.semi, fontSize: 18, color: '#fff' },
  seeAll: { fontFamily: fonts.medium, fontSize: 14, color: colors.cyan },
});
