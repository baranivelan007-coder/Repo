import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fonts } from '../theme';
import { useCartSummary } from '../store/cart';
import { plural, rupee } from '../utils/format';

/** "2 items ₹448 | View Cart >" bar from the restaurant screen. Hidden while the cart is empty. */
export default function CartBar({ style }: { style?: object }) {
  const router = useRouter();
  const { count, subtotal } = useCartSummary();
  if (count === 0) return null;
  return (
    <View style={[styles.wrap, style]}>
      <Pressable style={styles.mini} onPress={() => router.push('/cart')}>
        <Feather name="shopping-cart" size={26} color={colors.cyan} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.items}>{plural(count, 'item')}</Text>
          <Text style={styles.price}>{rupee(subtotal)}</Text>
        </View>
        <Text style={styles.viewSmall}>View Cart ›</Text>
      </Pressable>
      <Pressable style={styles.big} onPress={() => router.push('/cart')}>
        <Text style={styles.bigText}>View Cart ›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 12, gap: 12, backgroundColor: colors.bgHome, borderTopWidth: 1, borderTopColor: colors.navLine },
  mini: { flex: 1.15, height: 52, borderRadius: 16, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 },
  items: { fontFamily: fonts.medium, fontSize: 12, color: colors.text },
  price: { fontFamily: fonts.semi, fontSize: 13, color: colors.text },
  viewSmall: { fontFamily: fonts.medium, fontSize: 11, color: colors.cyan, marginLeft: 'auto' },
  big: { flex: 1, height: 52, borderRadius: 16, backgroundColor: colors.cyan, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2B6E90' },
  bigText: { fontFamily: fonts.bold, fontSize: 18, color: colors.onCyan },
});
