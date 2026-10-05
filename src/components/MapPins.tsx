import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import { LatLng } from '../types';
import { fonts } from '../theme';

/** react-native-maps custom markers need view tracking only for the first render. */
export function PinMarker({
  coordinate, children, onPress, anchor = { x: 0.5, y: 0.5 }, zIndex,
}: {
  coordinate: LatLng; children: React.ReactNode; onPress?: () => void;
  anchor?: { x: number; y: number }; zIndex?: number;
}) {
  const [track, setTrack] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTrack(false), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <Marker coordinate={coordinate} onPress={onPress} anchor={anchor} tracksViewChanges={track} zIndex={zIndex}>
      {children}
    </Marker>
  );
}

/** Restaurant pin: coloured rounded badge + "20 min / 4.7 ★" label (as in the Figma map). */
export function RestaurantPin({
  color, icon, minutes, rating, selected,
}: { color: string; icon: string; minutes: number; rating: number; selected?: boolean }) {
  return (
    <View style={styles.pinWrap}>
      <View style={[styles.badge, { backgroundColor: color }, selected && styles.badgeSel]}>
        <MaterialCommunityIcons name={icon as any} size={selected ? 22 : 19} color="#fff" />
      </View>
      <View style={[styles.tail, { borderTopColor: color }]} />
      <View style={[styles.label, selected && { borderColor: color, borderWidth: 1.5 }]}>
        <Text style={[styles.min, { color }]}>{minutes} min</Text>
        <Text style={styles.rate}>{rating} ★</Text>
      </View>
    </View>
  );
}

export function UserDot() {
  return <View style={styles.userDot} />;
}

export function RestaurantBag() {
  return (
    <View style={styles.bag}>
      <Feather name="shopping-bag" size={26} color="#fff" />
    </View>
  );
}

export function RiderBadge() {
  return (
    <View style={styles.rider}>
      <MaterialCommunityIcons name="moped" size={38} color="#0B1220" />
    </View>
  );
}

const styles = StyleSheet.create({
  pinWrap: { width: 64, height: 78, alignItems: 'center' },
  badge: {
    width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  badgeSel: { width: 40, height: 40, borderRadius: 13 },
  tail: {
    width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1,
  },
  label: {
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, alignItems: 'center', marginTop: 2,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 2, elevation: 2, borderWidth: 0,
  },
  min: { fontFamily: fonts.semi, fontSize: 9.5, lineHeight: 12 },
  rate: { fontFamily: fonts.semi, fontSize: 9.5, lineHeight: 12, color: '#374151' },
  userDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#1D7BFF', borderWidth: 3.5, borderColor: '#fff', elevation: 4 },
  bag: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#F4623A', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  rider: {
    width: 62, height: 62, borderRadius: 31, backgroundColor: '#5BC6FF', borderWidth: 4, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
});
