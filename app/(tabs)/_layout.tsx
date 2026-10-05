import React from 'react';
import { View } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import BottomNav, { TabKey } from '../../src/components/BottomNav';
import CartBar from '../../src/components/CartBar';
import { useAuth } from '../../src/store/auth';

export default function TabsLayout() {
  const user = useAuth((s) => s.user);
  if (!user) return <Redirect href="/login" />;
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const active = props.state.routes[props.state.index].name as TabKey;
        return (
          <View>
            {active === 'index' || active === 'explore' ? <CartBar /> : null}
            <BottomNav active={active} onPress={(k) => props.navigation.navigate(k)} />
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
