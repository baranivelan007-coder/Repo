import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Provider } from './src/store';
import { S } from './src/screens';
import { C } from './src/theme.js';
import { TabBar } from './src/ui';

const TABS = ['Home', 'Explore', 'Orders', 'Profile'];
const BAR = [...TABS, 'Cart', 'Checkout'];
export default function App() {
  const [ok] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [stack, setStack] = useState([{ n: 'Splash' }]);
  if (!ok) return null;
  const cur = stack[stack.length - 1];
  const nav = {
    go: (n, p = {}) => setStack(s => [...s, { n, p }]),
    back: () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s)),
    reset: (n, p = {}) => setStack([{ n, p }]),
  };
  const Scr = S[cur.n];
  return (
    <Provider>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar style="light" />
        <Scr nav={nav} p={cur.p || {}} />
        {BAR.includes(cur.n) && <TabBar cur={TABS.includes(cur.n) ? cur.n : 'Home'} onPick={t => nav.reset(t)} />}
      </View>
    </Provider>
  );
}
