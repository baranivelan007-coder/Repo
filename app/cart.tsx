import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav, { TabKey } from '../src/components/BottomNav';
import { BillRow, Card, EmptyState, RestaurantHeader } from '../src/components/Common';
import PrimaryButton from '../src/components/PrimaryButton';
import QuantityStepper from '../src/components/QuantityStepper';
import ScreenHeader from '../src/components/ScreenHeader';
import { DEFAULT_ADDRESS } from '../src/data/address';
import { restaurantById } from '../src/services/api';
import { useCart, useCartSummary } from '../src/store/cart';
import { useAnchor } from '../src/store/location';
import { toast } from '../src/store/ui';
import { colors, fonts } from '../src/theme';
import { rupee } from '../src/utils/format';

export function useTabNavigate() {
  const router = useRouter();
  return (k: TabKey) => router.navigate(k === 'index' ? '/(tabs)' : (`/${k}` as any));
}

export default function Cart() {
  const router = useRouter();
  const goTab = useTabNavigate();
  const anchor = useAnchor();
  const { items, count, bill, restaurantId } = useCartSummary();
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const r = useMemo(() => (restaurantId ? restaurantById(restaurantId, anchor) : undefined), [restaurantId, anchor.latitude, anchor.longitude]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Your Cart" />
      {count === 0 || !r ? (
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 29 }}>
          <EmptyState icon="shopping-cart" title="Your cart is empty" subtitle="Add something tasty from a nearby restaurant." />
          <PrimaryButton title="Browse restaurants" height={50} radius={16} fontSize={18} onPress={() => router.replace('/(tabs)')} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 29, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 14 }}>
            <RestaurantHeader logo={r.logo} name={r.name} cuisine={r.cuisine} open={r.isOpen} size={72} />
          </View>

          {items.map(({ item, qty }) => (
            <Card key={item.id} style={styles.itemCard}>
              <Image source={item.image} style={styles.img} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.price}>{rupee(item.price)}</Text>
                <View style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                  <QuantityStepper qty={qty} onMinus={() => decrement(item.id)} onPlus={() => increment(item.id)} />
                </View>
              </View>
            </Card>
          ))}

          <Card style={{ marginTop: 6 }}>
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
            <Text style={styles.h}>Bill Details</Text>
            <BillRow label="Item Total" value={rupee(bill.subtotal)} />
            <BillRow label="Delivery Fee" value={rupee(bill.deliveryFee)} />
            <BillRow label="Discount" value={`−${rupee(bill.discount)}`} valueColor={colors.green} />
            <BillRow label="Taxes & charges" value={rupee(bill.taxes)} />
            <BillRow label="Total Amount" value={rupee(bill.total)} bold valueColor={colors.cyan} />
          </Card>

          <PrimaryButton title="Proceed to Checkout" style={{ marginTop: 16 }} onPress={() => router.push('/checkout')} />
        </ScrollView>
      )}
      <BottomNav active="index" onPress={goTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 12 },
  img: { width: 120, height: 96, borderRadius: 14 },
  itemName: { fontFamily: fonts.semi, fontSize: 18, color: '#fff' },
  price: { fontFamily: fonts.semi, fontSize: 17, color: colors.cyan, marginTop: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h: { fontFamily: fonts.semi, fontSize: 18, color: '#fff' },
  change: { fontFamily: fonts.regular, fontSize: 14, color: colors.cyan },
  addrTitle: { fontFamily: fonts.medium, fontSize: 16, color: '#fff' },
  addrLine: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});
