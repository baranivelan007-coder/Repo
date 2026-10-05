import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BillRow, Card, RestaurantHeader } from '../src/components/Common';
import PrimaryButton from '../src/components/PrimaryButton';
import { RESTAURANTS } from '../src/data/restaurants';
import { useOrders } from '../src/store/orders';
import { colors, fonts } from '../src/theme';
import { plural, rupee } from '../src/utils/format';

export default function Confirmed() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  if (!order) {
    return (
      <View style={[styles.root, { justifyContent: 'center', padding: 29 }]}>
        <PrimaryButton title="Back to Home" onPress={() => router.replace('/(tabs)')} />
      </View>
    );
  }
  const logo = RESTAURANTS.find((r) => r.id === order.restaurantId)?.logo ?? null;
  const paidLabel = order.paymentMethod === 'COD' ? 'Total to pay on delivery' : `Total paid via ${order.paymentMethod === 'UPI' ? 'UPI' : 'Card'}`;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: 29, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.outer}>
            <View style={styles.inner}>
              <Feather name="check" size={40} color={colors.green} />
            </View>
          </View>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.sub}>Your delicious order is being prepared by {order.restaurantName}.</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Order #{order.id}</Text>
          </View>
        </View>

        <Card style={{ marginTop: 20, paddingVertical: 20 }}>
          <Text style={styles.small}>Estimated delivery time</Text>
          <Text style={styles.big}>10–15 min</Text>
          <Text style={styles.prep}>Restaurant is preparing your order</Text>
        </Card>

        <Card style={{ marginTop: 14, paddingBottom: 20 }}>
          <RestaurantHeader logo={logo} name={order.restaurantName} cuisine={order.restaurantCuisine} size={66} />
          <View style={{ marginTop: 6 }}>
            <BillRow label={plural(order.itemCount, 'item')} value={rupee(order.subtotal)} />
            <BillRow label="Delivery + taxes" value={rupee(order.deliveryFee + order.taxes)} />
            <BillRow label="Discount" value={`−${rupee(order.discount)}`} valueColor={colors.green} />
            <BillRow label={paidLabel} value={rupee(order.total)} bold valueColor={colors.cyan} />
          </View>
        </Card>
      </ScrollView>

      <View style={{ paddingHorizontal: 29, paddingBottom: Math.max(insets.bottom, 14) + 4, paddingTop: 10 }}>
        <PrimaryButton title="Track Order" height={56} onPress={() => router.replace({ pathname: '/track', params: { id: order.id } })} />
        <Text style={styles.home} onPress={() => router.replace('/(tabs)')}>Back to Home</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  outer: { width: 176, height: 176, borderRadius: 88, borderWidth: 3, borderColor: colors.green, backgroundColor: '#0E3E2B', alignItems: 'center', justifyContent: 'center' },
  inner: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 30, color: '#fff', marginTop: 26 },
  sub: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSoft, textAlign: 'center', marginTop: 14, lineHeight: 23, paddingHorizontal: 8 },
  pill: { backgroundColor: '#101C2E', borderRadius: 20, paddingHorizontal: 22, paddingVertical: 9, marginTop: 18 },
  pillText: { fontFamily: fonts.medium, fontSize: 15, color: colors.cyan },
  small: { fontFamily: fonts.regular, fontSize: 15, color: colors.muted },
  big: { fontFamily: fonts.bold, fontSize: 34, color: '#fff', marginTop: 4 },
  prep: { fontFamily: fonts.regular, fontSize: 14, color: colors.green, marginTop: 4 },
  home: { fontFamily: fonts.semi, fontSize: 16, color: colors.cyan, textAlign: 'center', marginTop: 14 },
});
