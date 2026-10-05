import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBg from '../../src/components/GradientBg';
import { Chip, EmptyState } from '../../src/components/Common';
import PrimaryButton from '../../src/components/PrimaryButton';
import { RESTAURANTS } from '../../src/data/restaurants';
import { useNow } from '../../src/hooks/useNow';
import { deliveryProvider } from '../../src/services/delivery/SimulatedDeliveryProvider';
import { isActive, useOrders } from '../../src/store/orders';
import { colors, fonts } from '../../src/theme';
import { Order } from '../../src/types';
import { formatDate, plural, rupee } from '../../src/utils/format';
import { toast } from '../../src/store/ui';

const STATUS_LABEL: Record<string, string> = {
  PLACED: 'Placed', CONFIRMED: 'Confirmed', PREPARING: 'Preparing', READY_FOR_PICKUP: 'Ready', PICKED_UP: 'Picked up', ON_THE_WAY: 'On the way',
};

export default function Orders() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const orders = useOrders((s) => s.orders);
  const active = orders.filter(isActive);
  const past = orders.filter((o) => !isActive(o));
  const now = useNow(1000, active.length > 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#030814' }}>
      <GradientBg variant="tab" />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: 30, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Text style={styles.title}>My Orders</Text>
          <Pressable hitSlop={10} onPress={() => toast('No new notifications')}>
            <Feather name="bell" size={34} color="#fff" />
          </Pressable>
        </View>

        {active.length > 0 && (
          <>
            <Text style={styles.section}>ACTIVE ORDER</Text>
            {active.map((o) => {
              const st = deliveryProvider.getStatus(o, now);
              const logo = RESTAURANTS.find((r) => r.id === o.restaurantId)?.logo;
              return (
                <View key={o.id} style={styles.activeCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.logo}>{logo ? <Image source={logo} style={{ width: 40, height: 40 }} resizeMode="contain" /> : null}</View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.name}>{o.restaurantName}</Text>
                      <Text style={styles.sub}>{plural(o.itemCount, 'item')} • {rupee(o.total)}</Text>
                    </View>
                    <Chip label={STATUS_LABEL[st.status] ?? st.status} tone="blue" />
                  </View>
                  <View style={styles.etaRow}>
                    <Text style={styles.eta}>Arriving in {st.etaMin} mins</Text>
                    <Text style={styles.near}>Near {o.addressTitle.split(',')[0]}</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${Math.max(6, st.overall * 100)}%` }]} />
                  </View>
                  <PrimaryButton title="Track Order" height={44} radius={12} fontSize={15} style={{ marginTop: 14 }} onPress={() => router.push({ pathname: '/track', params: { id: o.id } })} />
                </View>
              );
            })}
          </>
        )}

        <Text style={[styles.section, { marginTop: 22 }]}>PAST ORDERS</Text>
        {past.length === 0 ? (
          <EmptyState icon="shopping-bag" title="No past orders yet" subtitle="Your delivered and cancelled orders will show up here." />
        ) : (
          past.map((o) => <PastCard key={o.id} o={o} onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })} />)
        )}
      </ScrollView>
    </View>
  );
}

function PastCard({ o, onPress }: { o: Order; onPress: () => void }) {
  const delivered = o.status === 'DELIVERED';
  return (
    <Pressable onPress={onPress} style={styles.pastCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={styles.pastName}>{o.restaurantName}</Text>
          <Text style={styles.pastSub}>{formatDate(o.createdAt)} • {plural(o.itemCount, 'item')}</Text>
        </View>
        <Chip label={delivered ? 'Delivered' : 'Cancelled'} tone={delivered ? 'green' : 'red'} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
        <Text style={styles.total}>{rupee(o.total)}</Text>
        <Text style={styles.viewDetails}>View Details ›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  title: { fontFamily: fonts.bold, fontSize: 26, color: '#fff' },
  section: { fontFamily: fonts.semi, fontSize: 14, color: colors.cyan, letterSpacing: 0.6, marginBottom: 10 },
  activeCard: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.cardBorder, padding: 18 },
  logo: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.semi, fontSize: 17, color: '#fff' },
  sub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  eta: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted },
  near: { fontFamily: fonts.semi, fontSize: 12.5, color: colors.cyan },
  barBg: { height: 7, borderRadius: 4, backgroundColor: '#1B2B45', marginTop: 8, overflow: 'hidden' },
  barFill: { height: 7, borderRadius: 4, backgroundColor: colors.cyan },
  pastCard: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, marginBottom: 12 },
  pastName: { fontFamily: fonts.semi, fontSize: 17, color: '#fff' },
  pastSub: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  total: { fontFamily: fonts.semi, fontSize: 18, color: '#fff' },
  viewDetails: { fontFamily: fonts.medium, fontSize: 14, color: colors.cyan },
});
