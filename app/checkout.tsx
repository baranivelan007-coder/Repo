import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from '../src/components/BottomNav';
import { BillRow, Card, RestaurantHeader } from '../src/components/Common';
import PrimaryButton from '../src/components/PrimaryButton';
import ScreenHeader from '../src/components/ScreenHeader';
import { DEFAULT_ADDRESS } from '../src/data/address';
import { restaurantById } from '../src/services/api';
import { useCartSummary } from '../src/store/cart';
import { useAnchor } from '../src/store/location';
import { toast } from '../src/store/ui';
import { colors, fonts } from '../src/theme';
import { rupee } from '../src/utils/format';
import { useTabNavigate } from './cart';

export default function Checkout() {
  const router = useRouter();
  const goTab = useTabNavigate();
  const anchor = useAnchor();
  const { items, count, bill, restaurantId } = useCartSummary();
  const r = useMemo(() => (restaurantId ? restaurantById(restaurantId, anchor) : undefined), [restaurantId, anchor.latitude, anchor.longitude]);

  if (count === 0 || !r) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Checkout" />
        <View style={{ flex: 1, justifyContent: 'center', padding: 29 }}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 16 }}>Your cart is empty</Text>
          <PrimaryButton title="Back to Home" height={50} radius={16} fontSize={18} onPress={() => router.replace('/(tabs)')} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Checkout" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 29, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.h}>Delivery Address</Text>
            <Pressable hitSlop={8} onPress={() => toast('Address book is coming soon')}>
              <Text style={styles.change}>Change ›</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
            <Feather name="map-pin" size={22} color={colors.cyan} />
            <View style={{ marginLeft: 14 }}>
              <Text style={styles.addrTitle}>{DEFAULT_ADDRESS.title}</Text>
              <Text style={styles.addrLine}>{DEFAULT_ADDRESS.line}</Text>
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <RestaurantHeader logo={r.logo} name={r.name} cuisine={r.cuisine} open={r.isOpen} size={66} />
          <Text style={[styles.h, { marginTop: 16 }]}>Order Items</Text>
          {items.map(({ item, qty }) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{qty} × {item.name}</Text>
              <Text style={styles.itemPrice}>{rupee(item.price * qty)}</Text>
            </View>
          ))}
          <Text style={styles.note}>No cutlery needed • Deliver with care</Text>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <Text style={styles.h}>Payment Summary</Text>
          <BillRow label="Item Total" value={rupee(bill.subtotal)} />
          <BillRow label="Delivery Fee" value={rupee(bill.deliveryFee)} />
          <BillRow label="Taxes & charges" value={rupee(bill.taxes)} />
          <BillRow label="Discount" value={`−${rupee(bill.discount)}`} valueColor={colors.green} />
          <BillRow label="Total" value={rupee(bill.total)} bold valueColor={colors.cyan} />
        </Card>

        <Card style={[styles.rowBetween, { marginTop: 12, paddingVertical: 16 }]}>
          <Text style={styles.est}>Estimated delivery</Text>
          <Text style={styles.estVal}>10–15 min</Text>
        </Card>

        <PrimaryButton title="Continue to Payment" style={{ marginTop: 16 }} onPress={() => router.push('/payment')} />
      </ScrollView>
      <BottomNav active="index" onPress={goTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h: { fontFamily: fonts.semi, fontSize: 18, color: '#fff' },
  change: { fontFamily: fonts.regular, fontSize: 14, color: colors.cyan },
  addrTitle: { fontFamily: fonts.medium, fontSize: 16, color: '#fff' },
  addrLine: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  itemName: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.muted, flex: 1 },
  itemPrice: { fontFamily: fonts.medium, fontSize: 15.5, color: '#fff' },
  note: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 16 },
  est: { fontFamily: fonts.regular, fontSize: 15.5, color: colors.muted },
  estVal: { fontFamily: fonts.semi, fontSize: 16, color: '#fff' },
});
