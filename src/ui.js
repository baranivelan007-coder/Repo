import React from 'react';
import { Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { C, F } from './theme.js';

export const T = ({ f = 'r', c = C.txt, z = 14, s, children, ...p }) => <Text {...p} style={[{ fontFamily: F[f], color: c, fontSize: z }, s]}>{children}</Text>;
export const Card = ({ s, children, ...p }) => <View {...p} style={[{ backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 16, padding: 16 }, s]}>{children}</View>;
export const Btn = ({ label, onPress, s, ghost }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[{ backgroundColor: ghost ? C.card : C.pri, borderRadius: 16, height: 54, alignItems: 'center', justifyContent: 'center' }, s]}>
    <T f="s" z={17} c={ghost ? C.txt : '#04101C'}>{label}</T>
  </TouchableOpacity>
);
export const Screen = ({ children, pad = 20, bar }) => <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 54, paddingHorizontal: pad, paddingBottom: bar ? 96 : 24 }}>{children}</View>;
export const Header = ({ title, back }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
    {back && <TouchableOpacity onPress={back} style={{ marginRight: 14 }}><Feather name="arrow-left" size={26} color={C.pri} /></TouchableOpacity>}
    <T f="s" z={22}>{title}</T>
  </View>
);
export const Pill = ({ label, c = C.ok, bg = C.okbg }) => <View style={{ backgroundColor: bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 }}><T c={c} z={12}>{label}</T></View>;
export const Row = ({ a, b, bold, c, cb }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
    <T f={bold ? 's' : 'r'} c={bold ? C.txt : C.mut} z={15}>{a}</T><T f={bold ? 's' : 'm'} c={cb || (bold ? C.pri : C.txt)} z={15}>{b}</T>
  </View>
);
export const Input = ({ icon, ...p }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#18253A', borderRadius: 12, paddingHorizontal: 14, height: 48, marginBottom: 12 }}>
    <Feather name={icon} size={18} color={C.mut} />
    <TextInput placeholderTextColor={C.mut} {...p} style={{ flex: 1, color: C.txt, fontFamily: F.r, marginLeft: 10 }} />
  </View>
);
export const Stepper = ({ n, inc, dec }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: C.pri, borderWidth: 1.5, borderRadius: 14, width: 120, height: 36, paddingHorizontal: 12 }}>
    <TouchableOpacity onPress={dec}><Feather name="minus" size={18} color={C.pri} /></TouchableOpacity>
    <T f="s">{n}</T>
    <TouchableOpacity onPress={inc}><Feather name="plus" size={18} color={C.pri} /></TouchableOpacity>
  </View>
);
export const RestHead = ({ r }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
    <Image source={r.img} style={{ width: 56, height: 56, borderRadius: 14, marginRight: 14 }} />
    <View><View style={{ flexDirection: 'row', alignItems: 'center' }}><T f="s" z={22}>{r.name} </T><Pill label="open" /></View><T c={C.mut}>{r.cuisine}</T></View>
  </View>
);
const ICONS = { Home: 'home', Explore: 'navigation', Orders: 'shopping-bag', Profile: 'user' };
export const TabBar = ({ cur, onPick }) => (
  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 86, paddingBottom: 14, backgroundColor: C.bg, borderTopColor: C.line, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
    {Object.keys(ICONS).map(t => (
      <TouchableOpacity key={t} onPress={() => onPick(t)} style={{ alignItems: 'center' }}>
        <Feather name={ICONS[t]} size={26} color={cur === t ? C.pri : C.mut} />
        <T z={12} c={cur === t ? C.pri : C.mut}>{t}</T>
      </TouchableOpacity>
    ))}
  </View>
);
