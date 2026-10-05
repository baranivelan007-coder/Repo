import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../src/components/PrimaryButton';
import ScreenHeader from '../src/components/ScreenHeader';
import { useCartSummary } from '../src/store/cart';
import { useCheckout } from '../src/store/checkout';
import { colors, fonts } from '../src/theme';
import { PaymentMethod } from '../src/types';
import { rupee } from '../src/utils/format';

const METHODS: { key: PaymentMethod; title: string; sub: string; icon: any }[] = [
  { key: 'UPI', title: 'UPI', sub: 'Google Pay, PhonePe, Paytm', icon: 'wallet-outline' },
  { key: 'CARD', title: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: 'credit-card-outline' },
  { key: 'COD', title: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: 'cash' },
];

export default function Payment() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bill, count } = useCartSummary();
  const method = useCheckout((s) => s.method);
  const setMethod = useCheckout((s) => s.setMethod);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Payment" />
      <View style={{ paddingHorizontal: 29 }}>
        <Text style={styles.h}>Choose payment method</Text>
        {METHODS.map((m) => {
          const on = m.key === method;
          return (
            <Pressable key={m.key} onPress={() => setMethod(m.key)} style={[styles.card, on && styles.cardOn]}>
              <MaterialCommunityIcons name={m.icon} size={28} color={colors.cyan} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.title}>{m.title}</Text>
                <Text style={styles.sub}>{m.sub}</Text>
              </View>
              <View style={[styles.radio, on && { borderColor: colors.cyan }]}>{on ? <View style={styles.radioDot} /> : null}</View>
            </Pressable>
          );
        })}

        <View style={styles.totals}>
          <View style={styles.row}>
            <Text style={styles.lbl}>Order total</Text>
            <Text style={styles.val}>{rupee(bill.total)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 14 }]}>
            <Text style={[styles.lbl, { color: '#fff', fontFamily: fonts.semi }]}>Amount to pay</Text>
            <Text style={[styles.val, { color: colors.cyan, fontFamily: fonts.semi }]}>{method === 'COD' ? '₹0 now' : rupee(bill.total)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <Feather name="shield" size={22} color={colors.green} />
          <Text style={styles.secure}>Payments are secure and encrypted</Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />
      <PrimaryButton
        title={method === 'COD' ? `Place Order  ${rupee(bill.total)}` : `Pay Now  ${rupee(bill.total)}`}
        style={{ marginHorizontal: 29, marginBottom: Math.max(insets.bottom, 16) + 8 }}
        disabled={count === 0}
        height={56}
        onPress={() => router.push('/processing')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontFamily: fonts.semi, fontSize: 20, color: '#fff', marginBottom: 14 },
  card: { flexDirection: 'row', alignItems: 'center', height: 82, backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 20, marginBottom: 12 },
  cardOn: { borderColor: colors.cyan, borderWidth: 2 },
  title: { fontFamily: fonts.semi, fontSize: 18, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 2 },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#7C889B', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.cyan },
  totals: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.cardBorder, padding: 20, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  lbl: { fontFamily: fonts.regular, fontSize: 17, color: colors.muted },
  val: { fontFamily: fonts.medium, fontSize: 17, color: '#fff' },
  secure: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
});
