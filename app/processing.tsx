import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PrimaryButton from '../src/components/PrimaryButton';
import { DEFAULT_ADDRESS } from '../src/data/address';
import { payMock } from '../src/services/payment';
import { placeOrder } from '../src/services/orders';
import { restaurantById } from '../src/services/api';
import { useCart } from '../src/store/cart';
import { useCheckout } from '../src/store/checkout';
import { FALLBACK_LOCATION, colors, fonts } from '../src/theme';
import { useLocationStore } from '../src/store/location';
import { useOrders } from '../src/store/orders';
import { calcBill } from '../src/utils/bill';
import { getMenuItem } from '../src/data/menu';
import { rupee } from '../src/utils/format';

export default function Processing() {
  const router = useRouter();
  const spin = useRef(new Animated.Value(0)).current;
  const started = useRef(false);
  const method = useCheckout((s) => s.method);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // amount is computed once, from the cart, when this screen opens
  const total = useRef(
    calcBill(
      Object.entries(useCart.getState().lines).reduce((n, [id, q]) => n + (getMenuItem(id)?.price ?? 0) * q, 0)
    ).total
  ).current;

  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true })).start();
  }, [spin]);

  useEffect(() => {
    if (started.current && attempt === 0) return;
    started.current = true;
    let cancelled = false;
    (async () => {
      const { lines, restaurantId } = useCart.getState();
      const loc = useLocationStore.getState().coords ?? FALLBACK_LOCATION;
      const restaurant = restaurantId ? restaurantById(restaurantId, loc) : undefined;
      if (!restaurant || Object.keys(lines).length === 0) {
        router.replace('/(tabs)');
        return;
      }
      try {
        const [pay, order] = await Promise.all([
          payMock(method, total),
          placeOrder({ restaurant, lines, method, dest: loc, addressTitle: DEFAULT_ADDRESS.title, addressLine: DEFAULT_ADDRESS.line }),
        ]);
        if (cancelled) return;
        if (!pay.ok) {
          setError(pay.reason);
          return;
        }
        useOrders.getState().addOrder(order);
        useCart.getState().clear();
        router.replace({ pathname: '/confirmed', params: { id: order.id } });
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Something went wrong');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const cod = method === 'COD';

  if (error) {
    return (
      <View style={styles.root}>
        <View style={[styles.iconCircle, { borderColor: colors.red, backgroundColor: colors.redBg }]}>
          <Feather name="x" size={44} color={colors.red} />
        </View>
        <Text style={styles.title}>Payment failed</Text>
        <Text style={styles.sub}>{error}</Text>
        <PrimaryButton title="Try Again" style={{ width: 240, marginTop: 28 }} height={50} fontSize={18} onPress={() => { setError(null); setAttempt((a) => a + 1); }} />
        <Text style={styles.back} onPress={() => router.back()}>Back to Payment</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.ringWrap}>
        <View style={styles.ringBase} />
        <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
        <Feather name="shield" size={34} color={colors.cyan} />
      </View>
      <Text style={styles.title}>{cod ? 'Placing your order...' : 'Processing Payment...'}</Text>
      <Text style={styles.amount}>{rupee(total)}</Text>
      <Text style={styles.sub}>Please don't close the app or go back.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  ringWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  ringBase: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 5, borderColor: '#14223A' },
  ring: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 5, borderColor: 'transparent', borderTopColor: colors.cyan },
  iconCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: '#fff', textAlign: 'center' },
  amount: { fontFamily: fonts.semi, fontSize: 30, color: colors.cyan, marginTop: 10 },
  sub: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted, marginTop: 10, textAlign: 'center' },
  back: { fontFamily: fonts.semi, fontSize: 15, color: colors.cyan, marginTop: 20 },
});
