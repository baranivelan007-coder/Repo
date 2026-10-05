import React, { useEffect, useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { C } from './theme.js';
import { HOME, RESTAURANTS, byId, FEES } from './data';
import { useStore } from './store';
import { T, Card, Btn, Screen, Header, Pill, Row, Input, Stepper, RestHead } from './ui';

const logo = require('../assets/img/logo.png');
const rs = n => '₹' + n;
const pin = r => (
  <View style={{ alignItems: 'center' }}>
    <View style={{ backgroundColor: r.color, borderRadius: 10, padding: 6 }}><Feather name={r.icon} size={18} color="#fff" /></View>
    <View style={{ backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 5, marginTop: 2 }}><T z={9} f="s" c={r.color}>{r.min} min</T><T z={9} c="#222">{r.rating} ★</T></View>
  </View>
);

function Splash({ nav }) {
  const { user } = useStore();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}>
      <Image source={logo} style={{ width: 280, height: 280 }} resizeMode="contain" />
      <Btn label="Get Started" s={{ width: 200, marginTop: 30 }} onPress={() => nav.reset(user ? 'Home' : 'Onboarding')} />
    </View>
  );
}
const OB = [
  ['Discover Food Around You', 'Explore nearby restaurants on an interactive map and find your next favourite meal.', 'map'],
  ['Choose What Fits You', 'Compare ratings, distance, delivery time, and food options to find the perfect place for you.', 'star'],
  ['Track Your Order Live', 'Follow your order in real time from the restaurant to your doorstep.', 'navigation'],
];
function Onboarding({ nav }) {
  const [i, setI] = useState(0);
  const [t, d, ic] = OB[i];
  return (
    <Screen>
      <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => nav.reset('Signup')}><T c={C.mut}>skip</T></TouchableOpacity>
      <T f="b" z={22} s={{ textAlign: 'center', marginVertical: 14 }}>{t}</T>
      <Card s={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Feather name={ic} size={110} color={C.pri} /></Card>
      <T c={C.mut} s={{ textAlign: 'center' }}>{d}</T>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
        {OB.map((_, k) => <View key={k} style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 3, backgroundColor: k === i ? C.pri : C.line }} />)}
      </View>
      <Btn label={i < 2 ? 'Next →' : 'Get Started →'} onPress={() => (i < 2 ? setI(i + 1) : nav.reset('Signup'))} />
    </Screen>
  );
}
function Signup({ nav }) {
  const { login } = useStore();
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '' });
  const set = k => v => setF({ ...f, [k]: v });
  const go = () => {
    if (!f.name || !f.email || f.pw.length < 4) return Alert.alert('Check details', 'Enter name, email and a password (4+ characters).');
    if (f.pw !== f.pw2) return Alert.alert('Passwords differ', 'Confirm password must match.');
    login({ name: f.name, email: f.email }); nav.reset('Location');
  };
  return (
    <Screen>
      <Image source={logo} style={{ width: 90, height: 90, alignSelf: 'center' }} resizeMode="contain" />
      <T f="b" z={26} s={{ textAlign: 'center' }}>Create Your Account</T>
      <T c={C.mut} s={{ textAlign: 'center', marginBottom: 18 }}>Join Navi Meal and discover food around you.</T>
      <Input icon="user" placeholder="Enter your name" value={f.name} onChangeText={set('name')} />
      <Input icon="mail" placeholder="Enter your email" autoCapitalize="none" value={f.email} onChangeText={set('email')} />
      <Input icon="lock" placeholder="Create a password" secureTextEntry value={f.pw} onChangeText={set('pw')} />
      <Input icon="lock" placeholder="Confirm password" secureTextEntry value={f.pw2} onChangeText={set('pw2')} />
      <Btn label="Create Account" onPress={go} s={{ marginTop: 6 }} />
      <TouchableOpacity onPress={() => nav.go('Login')} style={{ marginTop: 14 }}><T c={C.mut} s={{ textAlign: 'center' }}>Already have an account? <T c={C.pri}>Login</T></T></TouchableOpacity>
    </Screen>
  );
}
function Login({ nav }) {
  const { login } = useStore();
  const [e, setE] = useState(''); const [p, setP] = useState('');
  return (
    <Screen>
      <Image source={logo} style={{ width: 90, height: 90, alignSelf: 'center' }} resizeMode="contain" />
      <T f="b" z={26} s={{ textAlign: 'center' }}>Welcome Back 👋</T>
      <T c={C.mut} s={{ textAlign: 'center', marginBottom: 18 }}>Log in to continue your food journey.</T>
      <Input icon="mail" placeholder="Enter your email" autoCapitalize="none" value={e} onChangeText={setE} />
      <Input icon="lock" placeholder="Enter password" secureTextEntry value={p} onChangeText={setP} />
      <T c={C.pri} z={12} s={{ alignSelf: 'flex-end', marginBottom: 14 }}>Forgot Password?</T>
      <Btn label="Log In" onPress={() => { if (!e || !p) return Alert.alert('Enter email and password'); login({ name: e.split('@')[0], email: e }); nav.reset('Location'); }} />
      <T c={C.mut} s={{ textAlign: 'center', marginVertical: 14 }}>OR</T>
      <Btn ghost label="Continue with Google" onPress={() => Alert.alert('Google sign-in', 'Not enabled in this demo build.')} />
      <TouchableOpacity onPress={() => nav.back()} style={{ marginTop: 14 }}><T c={C.mut} s={{ textAlign: 'center' }}>Don't have an account? <T c={C.pri}>Sign Up</T></T></TouchableOpacity>
    </Screen>
  );
}
function LocationScr({ nav }) {
  const ask = async () => { try { await Location.requestForegroundPermissionsAsync(); } catch (e) {} nav.reset('Home'); };
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Card s={{ width: 190, height: 190, alignItems: 'center', justifyContent: 'center' }}><Feather name="map-pin" size={90} color={C.pri} /></Card>
        <T f="b" z={22} s={{ marginTop: 24 }}>Find Food Near You</T>
        <T c={C.mut} s={{ textAlign: 'center', marginTop: 8 }}>Allow location access to discover nearby restaurants, get accurate delivery times, and track your order in real time.</T>
      </View>
      <Btn label="Allow Location" onPress={ask} />
      <TouchableOpacity onPress={() => nav.reset('Home')} style={{ marginTop: 14 }}><T c={C.mut} s={{ textAlign: 'center' }}>Not Now</T></TouchableOpacity>
    </Screen>
  );
}
function Home({ nav }) {
  const [me, setMe] = useState(HOME);
  const [sel, setSel] = useState(null);
  useEffect(() => { (async () => { try { const { status } = await Location.getForegroundPermissionsAsync(); if (status === 'granted') { const l = await Location.getCurrentPositionAsync({}); setMe(l.coords); } } catch (e) {} })(); }, []);
  const region = { ...me, latitudeDelta: 0.03, longitudeDelta: 0.03 };
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation>
        {RESTAURANTS.map(r => <Marker key={r.id} coordinate={r.loc} onPress={() => setSel(r.id)}>{pin(r)}</Marker>)}
      </MapView>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: C.bg, paddingTop: 50, paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Feather name="map-pin" size={22} color={C.pri} />
          <View style={{ flex: 1, marginLeft: 8 }}><T z={11} c={C.mut}>Deliver to</T><T f="s">Anna Nagar, Chennai ⌄</T></View>
          <Feather name="bell" size={22} color="#fff" style={{ marginRight: 16 }} /><Feather name="user" size={22} color="#fff" />
        </View>
        <TouchableOpacity onPress={() => nav.reset('Explore')}><Card s={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}><Feather name="search" size={18} color={C.mut} /><T c={C.mut} s={{ flex: 1, marginLeft: 10 }}>Search restaurants or food</T><Feather name="filter" size={18} color={C.mut} /></Card></TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', bottom: 86, left: 0, right: 0, backgroundColor: C.bg, paddingTop: 12, paddingBottom: 8 }}>
        <T f="s" z={16} s={{ marginHorizontal: 20, marginBottom: 8 }}>Nearby Restaurants</T>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {RESTAURANTS.map(r => (
            <TouchableOpacity key={r.id} onPress={() => nav.go('Restaurant', { id: r.id })} style={{ width: 150, marginRight: 12, borderRadius: 14, overflow: 'hidden', borderWidth: 1.5, borderColor: sel === r.id ? C.pri : C.line, backgroundColor: C.card }}>
              <Image source={r.img} style={{ width: '100%', height: 84 }} />
              <View style={{ padding: 8 }}><T f="s" z={13}>{r.name}</T><T z={10} c={C.mut}>{r.cuisine}</T><T z={10} c={C.mut}><T c="#FBBF24" z={10}>★ {r.rating}</T> {r.min} min • {r.km} km</T></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
function Explore({ nav }) {
  const [q, setQ] = useState('');
  const list = RESTAURANTS.filter(r => (r.name + r.cuisine + r.menu.map(m => m.name).join()).toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen bar>
      <Input icon="search" placeholder="Find foods or restaurants..." value={q} onChangeText={setQ} />
      <T f="s" z={18} s={{ marginBottom: 10 }}>Popular Restaurants</T>
      <ScrollView showsVerticalScrollIndicator={false}>
        {list.length === 0 && <T c={C.mut}>No restaurants match your search.</T>}
        {list.map(r => (
          <TouchableOpacity key={r.id} onPress={() => nav.go('Restaurant', { id: r.id })}>
            <Card s={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 10 }}>
              <Image source={r.img} style={{ width: 84, height: 84, borderRadius: 12, marginRight: 12 }} />
              <View><T f="s" z={16}>{r.name}</T><T c={C.mut} z={12}>{r.cuisine}</T><T z={12} c="#FBBF24">★ {r.rating} <T z={12} c={C.mut}>• {r.km} km • {r.min} mins</T></T><T z={12} c={C.mut}>{rs(r.cost)} for two</T></View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}
function Restaurant({ nav, p }) {
  const r = byId(p.id); const st = useStore();
  const mine = st.rest && st.rest.id === r.id;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={r.img} style={{ width: '100%', height: 230 }} />
        <TouchableOpacity onPress={nav.back} style={{ position: 'absolute', top: 50, left: 16, backgroundColor: '#000A', borderRadius: 20, padding: 8 }}><Feather name="arrow-left" size={20} color="#fff" /></TouchableOpacity>
        <View style={{ padding: 20, marginTop: -24, backgroundColor: C.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}><T f="b" z={26}>{r.name} </T><Pill label="open" /></View>
          <T c={C.mut}>{r.cuisine}</T>
          <T z={14}><T c="#FBBF24">★ {r.rating}</T> <T c={C.mut}>({r.reviews} reviews)</T></T>
          <T c={C.mut} z={12} s={{ marginVertical: 8 }}>{r.km} km • {r.min} min • Free delivery above ₹199</T>
          <Card s={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
            {[[r.off, 'Up to ₹90'], [r.rating, 'Ratings'], [rs(r.cost), 'Cost for two'], [`${r.min}-${r.min + 8} min`, 'Delivery time']].map(([a, b]) => <View key={b} style={{ alignItems: 'center' }}><T f="s" z={12} c={C.pri}>{a}</T><T z={10} c={C.mut}>{b}</T></View>)}
          </Card>
          <T f="s" z={18} s={{ marginVertical: 8 }}>Popular Near You</T>
          {r.menu.map(i => (
            <Card key={i.id} s={{ flexDirection: 'row', marginBottom: 10, padding: 10 }}>
              <Image source={i.img} style={{ width: 84, height: 84, borderRadius: 12, marginRight: 12 }} />
              <View style={{ flex: 1 }}><T f="s">{i.name}</T><T z={11} c={C.mut} numberOfLines={2}>{i.desc}</T>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <T f="s" c={C.pri} z={16}>{rs(i.price)}</T>
                  <TouchableOpacity onPress={() => st.add(r.id, i.id)} style={{ borderColor: C.pri, borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
                    {mine && st.qty[i.id] ? <T c={C.pri} f="s">{st.qty[i.id]} </T> : null}<Feather name="plus" size={18} color={C.pri} /></TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderTopColor: C.line, borderTopWidth: 1 }}>
        <Card s={{ flex: 1, marginRight: 10, paddingVertical: 12 }}><T z={13}>{st.count} items  {rs(st.sub)}</T></Card>
        <Btn label="View Cart >" s={{ flex: 1 }} onPress={() => (st.count ? nav.go('Cart') : Alert.alert('Cart is empty', 'Tap + to add an item.'))} />
      </View>
    </View>
  );
}
const Addr = ({ nav }) => (
  <Card s={{ marginBottom: 12 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T f="s" z={17}>Delivery Address</T><T c={C.pri}>Change ›</T></View>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}><Feather name="map-pin" size={22} color={C.pri} /><View style={{ marginLeft: 12 }}><T f="m">Anna Nagar, Chennai</T><T z={11} c={C.mut}>12, 2nd Avenue • Home</T></View></View>
  </Card>
);
function Cart({ nav }) {
  const st = useStore();
  if (!st.count) return (<Screen bar><Header title="Your Cart" back={nav.back} /><T c={C.mut}>Your cart is empty. Add something tasty from a restaurant.</T></Screen>);
  return (
    <Screen bar>
      <Header title="Your Cart" back={nav.back} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <RestHead r={st.rest} />
        {st.lines.map(l => (
          <Card key={l.id} s={{ flexDirection: 'row', marginBottom: 10, padding: 10 }}>
            <Image source={l.img} style={{ width: 100, height: 100, borderRadius: 14, marginRight: 14 }} />
            <View style={{ justifyContent: 'space-between' }}><T f="s" z={17}>{l.name}</T><T f="s" c={C.pri} z={17}>{rs(l.price)}</T><Stepper n={l.qty} inc={() => st.add(st.rest.id, l.id)} dec={() => st.dec(l.id)} /></View>
          </Card>
        ))}
        <Addr />
        <Card s={{ marginBottom: 12 }}><T f="s" z={17} s={{ marginBottom: 6 }}>Bill Details</T>
          <Row a="Item Total" b={rs(st.sub)} /><Row a="Delivery Fee" b={rs(FEES.delivery)} /><Row a="Discount" b={'−' + rs(FEES.discount)} cb={C.ok} /><Row a="Taxes & charges" b={rs(FEES.tax)} /><Row bold a="Total Amount" b={rs(st.total)} /></Card>
        <Btn label="Proceed to Checkout" onPress={() => nav.go('Checkout')} />
      </ScrollView>
    </Screen>
  );
}
function Checkout({ nav }) {
  const st = useStore();
  return (
    <Screen bar>
      <Header title="Checkout" back={nav.back} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Addr />
        <Card s={{ marginBottom: 12 }}><RestHead r={st.rest || RESTAURANTS[0]} /><T f="s" z={17}>Order Items</T>
          {st.lines.map(l => <Row key={l.id} a={`${l.qty} × ${l.name}`} b={rs(l.qty * l.price)} />)}
          <T z={11} c={C.mut} s={{ marginTop: 6 }}>No cutlery needed • Deliver with care</T></Card>
        <Card s={{ marginBottom: 12 }}><T f="s" z={17}>Payment Summary</T>
          <Row a="Item Total" b={rs(st.sub)} /><Row a="Delivery Fee" b={rs(FEES.delivery)} /><Row a="Taxes & charges" b={rs(FEES.tax)} /><Row a="Discount" b={'−' + rs(FEES.discount)} cb={C.ok} /><Row bold a="Total" b={rs(st.total)} /></Card>
        <Card s={{ marginBottom: 12 }}><Row a="Estimated delivery" b="10–15 min" /></Card>
        <Btn label="Continue to Payment" onPress={() => nav.go('Payment')} />
      </ScrollView>
    </Screen>
  );
}
const METHODS = [['UPI', 'Google Pay, PhonePe, Paytm', 'smartphone'], ['Credit / Debit Card', 'Visa, Mastercard, RuPay', 'credit-card'], ['Cash on Delivery', 'Pay when your order arrives', 'dollar-sign']];
function Payment({ nav }) {
  const st = useStore(); const [m, setM] = useState(0); const [busy, setBusy] = useState(false);
  const pay = () => { setBusy(true); setTimeout(() => { const o = st.place(METHODS[m][0]); nav.reset('Confirmed', { o }); }, 2200); };
  return (
    <Screen>
      <Header title="Payment" back={nav.back} />
      <T f="s" z={18} s={{ marginBottom: 12 }}>Choose payment method</T>
      {METHODS.map(([a, b, ic], k) => (
        <TouchableOpacity key={a} onPress={() => setM(k)}>
          <Card s={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderColor: m === k ? C.pri : C.line, borderWidth: m === k ? 2 : 1 }}>
            <Feather name={ic} size={22} color={C.pri} /><View style={{ flex: 1, marginLeft: 14 }}><T f="s" z={16}>{a}</T><T z={12} c={C.mut}>{b}</T></View>
            <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: m === k ? C.pri : C.mut, alignItems: 'center', justifyContent: 'center' }}>{m === k && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.pri }} />}</View>
          </Card>
        </TouchableOpacity>
      ))}
      <Card><Row a="Order total" b={rs(st.total)} /><Row bold a="Amount to pay" b={rs(st.total)} /></Card>
      <View style={{ flexDirection: 'row', marginTop: 12 }}><Feather name="shield" size={18} color={C.ok} /><T c={C.mut} z={13} s={{ marginLeft: 8 }}>Payments are secure and encrypted</T></View>
      <View style={{ flex: 1 }} /><Btn label={`Pay Now ${rs(st.total)}`} onPress={pay} />
      <Modal visible={busy} transparent animationType="fade"><View style={{ flex: 1, backgroundColor: '#050A14EE', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={C.pri} /><T f="s" z={18} s={{ marginTop: 16 }}>Processing Payment...</T></View></Modal>
    </Screen>
  );
}
function Confirmed({ nav, p }) {
  const o = p.o; const r = byId(o.rid);
  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <View style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: C.okbg, borderColor: C.ok, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: 80, height: 80, borderRadius: 40, borderColor: C.ok, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}><Feather name="check" size={40} color={C.ok} /></View></View>
        <T f="b" z={28} s={{ marginVertical: 14 }}>Order Confirmed!</T>
        <T c="#C9D3E3" s={{ textAlign: 'center' }}>Your delicious order is being prepared by {r.name}.</T>
        <View style={{ backgroundColor: C.card, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6, marginVertical: 14 }}><T c={C.pri}>Order #{o.id}</T></View>
      </View>
      <Card s={{ marginBottom: 12 }}><T c={C.mut}>Estimated delivery time</T><T f="b" z={28}>10–15 min</T><T c={C.ok} z={13}>Restaurant is preparing your order</T></Card>
      <Card><RestHead r={r} /><Row a={`${o.items} items`} b={rs(o.sub)} /><Row a="Delivery + taxes" b={rs(FEES.delivery + FEES.tax)} /><Row a="Discount" b={'−' + rs(FEES.discount)} cb={C.ok} /><Row bold a={`Total paid via ${o.method === 'UPI' ? 'UPI' : o.method}`} b={rs(o.total)} /></Card>
      <View style={{ flex: 1 }} /><Btn label="Track Order" onPress={() => nav.reset('Track')} />
      <TouchableOpacity onPress={() => nav.reset('Home')} style={{ marginTop: 14 }}><T c={C.pri} f="m" s={{ textAlign: 'center' }}>Back to Home</T></TouchableOpacity>
    </Screen>
  );
}
const N = 60;
function Track({ nav }) {
  const st = useStore(); const o = st.active;
  const [i, setI] = useState(0); const [stars, setStars] = useState(5); const [done, setDone] = useState(false);
  const r = o ? byId(o.rid) : RESTAURANTS[1];
  const pts = useRef(Array.from({ length: N + 1 }, (_, k) => { const t = k / N; return { latitude: r.loc.latitude + (HOME.latitude - r.loc.latitude) * t + 0.003 * Math.sin(t * Math.PI * 2), longitude: r.loc.longitude + (HOME.longitude - r.loc.longitude) * t }; })).current;
  useEffect(() => { const id = setInterval(() => setI(v => { if (v >= N) { clearInterval(id); return v; } return v + 1; }), 500); return () => clearInterval(id); }, []);
  useEffect(() => { if (i >= N) setTimeout(() => setDone(true), 600); }, [i]);
  const mins = Math.max(1, Math.round((N - i) / 5));
  const on = i >= 8; const fin = i >= N;
  const tl = [[true, 'Order confirmed', '9:32'], [on, `Picked up from ${r.name}`, '9:41'], [on, 'Rider is on the way', fin ? '' : 'Now'], [fin, 'Delivered to Anna Nagar', fin ? 'Now' : '9:58']];
  const finish = () => { st.complete(); nav.reset('Orders'); };
  return (
    <Screen>
      <Header title="Track Order" back={() => nav.reset('Home')} />
      <View style={{ height: 300, borderRadius: 22, overflow: 'hidden' }}>
        <MapView style={{ flex: 1 }} initialRegion={{ latitude: (r.loc.latitude + HOME.latitude) / 2, longitude: (r.loc.longitude + HOME.longitude) / 2, latitudeDelta: 0.025, longitudeDelta: 0.025 }}>
          <Polyline coordinates={pts} strokeColor="#4FC3F7" strokeWidth={5} />
          <Marker coordinate={r.loc}>{pin(r)}</Marker>
          <Marker coordinate={HOME}><View style={{ backgroundColor: '#F4623A', borderRadius: 24, padding: 10 }}><Feather name="home" size={20} color="#fff" /></View></Marker>
          <Marker coordinate={pts[Math.min(i, N)]} anchor={{ x: 0.5, y: 0.5 }}><View style={{ backgroundColor: C.pri, borderRadius: 26, padding: 10, borderColor: '#fff', borderWidth: 3 }}><Feather name="truck" size={22} color="#04101C" /></View></Marker>
        </MapView>
        <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#1B2433', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8 }}><T f="s" z={14}>{fin ? 'Delivered' : `Arriving in ${mins} min`}</T></View>
      </View>
      <Card s={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><View><T c={C.mut} z={13}>Estimated arrival</T><T f="b" z={24}>9:58 PM</T></View><Pill label="● Live" /></View>
        {tl.map(([d, a, b], k) => <View key={k} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: d ? (k === 2 && !fin ? C.pri : C.ok) : C.line, marginRight: 14 }} /><T f={k === 2 && on && !fin ? 's' : 'r'} c={d ? C.txt : C.mut} s={{ flex: 1 }}>{a}</T><T c={C.mut} z={12}>{b}</T></View>)}
      </Card>
      <Card s={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}><T c={C.mut}>{r.name} • {o ? o.items : 2} items</T><T f="s">{rs(o ? o.total : 480)}</T></Card>
      <Modal visible={done} transparent animationType="slide"><View style={{ flex: 1, backgroundColor: '#000B', justifyContent: 'center', padding: 24 }}>
        <Card s={{ alignItems: 'center', padding: 24 }}>
          <T f="b" z={22}>Delivered! Enjoy your meal</T><T c={C.mut} s={{ marginVertical: 8 }}>How was your experience with NAVI MEAL?</T>
          <View style={{ flexDirection: 'row', marginVertical: 12 }}>{[1, 2, 3, 4, 5].map(k => <TouchableOpacity key={k} onPress={() => setStars(k)}><T z={38} c={k <= stars ? '#FBBF24' : C.line}>★</T></TouchableOpacity>)}</View>
          <Btn label="Submit Review" s={{ alignSelf: 'stretch' }} onPress={finish} />
        </Card>
      </View></Modal>
    </Screen>
  );
}
function Orders({ nav }) {
  const st = useStore(); const a = st.active;
  return (
    <Screen bar>
      <Header title="My Orders" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {a && <><T c={C.pri} f="s" z={12} s={{ marginBottom: 8 }}>Active Order</T>
          <Card s={{ marginBottom: 16 }}><View style={{ flexDirection: 'row', alignItems: 'center' }}><Image source={byId(a.rid).img} style={{ width: 46, height: 46, borderRadius: 10, marginRight: 12 }} /><View style={{ flex: 1 }}><T f="s">{byId(a.rid).name}</T><T z={11} c={C.mut}>{a.items} items • {rs(a.total)}</T></View><Pill label="On the way" c={C.pri} bg="#12305A" /></View><Btn label="Track Order" s={{ marginTop: 12, height: 44 }} onPress={() => nav.go('Track')} /></Card></>}
        <T c={C.pri} f="s" z={12} s={{ marginBottom: 8 }}>Past Orders</T>
        {st.orders.map(o => (
          <Card key={o.id} s={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T f="s">{byId(o.rid).name}</T>{o.status === 'Cancelled' ? <Pill label="Cancelled" c="#F87171" bg="#3B1414" /> : <Pill label="Delivered" />}</View>
            <T z={11} c={C.mut}>{o.date} • {o.items} items</T><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}><T f="s">{rs(o.total)}</T><T c={C.pri} z={12}>View Details ›</T></View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
const MENU = [['Personal Information', 'user'], ['Saved Addresses', 'map-pin'], ['Payment Methods', 'credit-card'], ['Favorites', 'heart'], ['Notifications', 'bell'], ['Help & Support', 'help-circle'], ['Settings', 'settings']];
function Profile({ nav }) {
  const st = useStore(); const u = st.user || { name: 'Guest', email: '' };
  return (
    <Screen bar>
      <View style={{ alignItems: 'center', marginBottom: 14 }}>
        <View style={{ width: 92, height: 92, borderRadius: 46, borderColor: C.pri, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card }}><Feather name="user" size={44} color={C.pri} /></View>
        <T f="b" z={22} s={{ marginTop: 8 }}>{u.name}</T><T c={C.mut} z={13}>{u.email}</T>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {MENU.map(([a, ic]) => <Card key={a} s={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingVertical: 14 }}><Feather name={ic} size={20} color={C.pri} /><T f="m" s={{ flex: 1, marginLeft: 14 }}>{a}</T><T c={C.mut}>›</T></Card>)}
        <TouchableOpacity onPress={() => { st.logout(); nav.reset('Login'); }}><Card s={{ backgroundColor: '#2A1315', borderColor: '#4A1D20', alignItems: 'center' }}><T f="s" c={C.red}>Log Out</T></Card></TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
export const S = { Splash, Onboarding, Signup, Login, Location: LocationScr, Home, Explore, Restaurant, Cart, Checkout, Payment, Confirmed, Track, Orders, Profile };
