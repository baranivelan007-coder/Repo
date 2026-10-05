import React from 'react';
import { Image, ImageSourcePropType, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { rupee } from '../utils/format';
import { Bill } from '../utils/bill';

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, tone }: { label: string; tone: 'open' | 'green' | 'red' | 'blue' | 'live' }) {
  const map = {
    open: { bg: colors.greenBg, fg: colors.green },
    green: { bg: colors.greenBg, fg: colors.green },
    red: { bg: colors.redBg, fg: colors.red },
    blue: { bg: colors.blueBg, fg: colors.cyan },
    live: { bg: colors.greenBg, fg: colors.green },
  }[tone];
  return (
    <View style={[styles.chip, { backgroundColor: map.bg }]}>
      <Text style={[styles.chipText, { color: map.fg }]}>{label}</Text>
    </View>
  );
}

/** Logo tile + name + open chip + cuisine (cart / checkout / confirmed). */
export function RestaurantHeader({ logo, name, cuisine, open = true, size = 80 }: { logo: ImageSourcePropType | number | null; name: string; cuisine: string; open?: boolean; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.logoBox, { width: size, height: size, borderRadius: size * 0.22 }]}>
        {logo ? (
          <Image source={logo as any} style={{ width: size * 0.82, height: size * 0.82 }} resizeMode="contain" />
        ) : (
          <Feather name="coffee" size={size * 0.4} color="#555" />
        )}
      </View>
      <View style={{ marginLeft: 14, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <Text style={[styles.rName, { fontSize: size > 70 ? 25 : 22 }]}>{name}</Text>
          {open ? <Chip label="open" tone="open" /> : <Chip label="closed" tone="red" />}
        </View>
        <Text style={styles.rCuisine}>{cuisine}</Text>
      </View>
    </View>
  );
}

export function BillRow({ label, value, bold, valueColor, labelColor }: { label: string; value: string; bold?: boolean; valueColor?: string; labelColor?: string }) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, bold && { color: colors.text, fontFamily: fonts.semi }, labelColor ? { color: labelColor } : null]}>{label}</Text>
      <Text style={[styles.billValue, bold && { fontFamily: fonts.semi, fontSize: 17 }, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

export function EmptyState({ icon = 'search', title, subtitle }: { icon?: keyof typeof Feather.glyphMap; title: string; subtitle?: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 36, paddingHorizontal: 30 }}>
      <Feather name={icon} size={34} color={colors.faint} />
      <Text style={{ fontFamily: fonts.semi, fontSize: 16, color: colors.text, marginTop: 12, textAlign: 'center' }}>{title}</Text>
      {subtitle ? <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 4, textAlign: 'center' }}>{subtitle}</Text> : null}
    </View>
  );
}

export const billRows = (b: Bill, order: 'cart' | 'checkout') =>
  order === 'cart'
    ? [['Item Total', rupee(b.subtotal)], ['Delivery Fee', rupee(b.deliveryFee)], ['Discount', `−${rupee(b.discount)}`], ['Taxes & charges', rupee(b.taxes)]]
    : [['Item Total', rupee(b.subtotal)], ['Delivery Fee', rupee(b.deliveryFee)], ['Taxes & charges', rupee(b.taxes)], ['Discount', `−${rupee(b.discount)}`]];

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.cardBorder, padding: 18 },
  chip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontFamily: fonts.medium, fontSize: 12 },
  logoBox: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  rName: { fontFamily: fonts.semi, color: colors.text },
  rCuisine: { fontFamily: fonts.regular, fontSize: 15, color: colors.muted, marginTop: 1 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 11 },
  billLabel: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.muted },
  billValue: { fontFamily: fonts.medium, fontSize: 15.5, color: colors.text },
});
