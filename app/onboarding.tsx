import React, { useRef, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBg from '../src/components/GradientBg';
import PrimaryButton from '../src/components/PrimaryButton';
import { colors, fonts } from '../src/theme';
import { useAuth } from '../src/store/auth';

const PAGES = [
  { title: 'Discover Food Around You', body: 'Explore nearby restaurants on an interactive map and find your next favourite meal.', img: require('../assets/images/onb1.jpg'), w: 312, h: 218, fit: 'cover' as const },
  { title: 'Choose What Fits You', body: 'Compare ratings, distance, delivery time, and food options to find the perfect place for you.', img: require('../assets/images/onb2.jpg'), w: 220, h: 196, fit: 'cover' as const },
  { title: 'Track Your Order Live', body: 'Follow your order in real time from the restaurant to your doorstep.', img: require('../assets/images/onb3.jpg'), w: 220, h: 220, fit: 'cover' as const },
];

export default function Onboarding() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const finish = useAuth((s) => s.finishOnboarding);
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);
  const cardW = width - 44;

  const done = () => {
    finish();
    router.replace('/signup');
  };
  const next = () => {
    if (index >= PAGES.length - 1) return done();
    ref.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#02060F' }}>
      <GradientBg variant="card" />
      <View style={{ flex: 1, paddingTop: Math.max(insets.top + 8, height * 0.12), paddingBottom: Math.max(insets.bottom + 16, height * 0.1), paddingHorizontal: 22 }}>
        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <Image source={require('../assets/images/logo.png')} style={{ width: 72, height: 72 }} resizeMode="contain" />
        </View>
        <View style={styles.card}>
          <Pressable style={styles.skip} hitSlop={12} onPress={done}>
            <Text style={styles.skipText}>skip</Text>
          </Pressable>
          <FlatList
            ref={ref}
            data={PAGES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(p) => p.title}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / cardW))}
            getItemLayout={(_, i) => ({ length: cardW, offset: cardW * i, index: i })}
            style={{ flexGrow: 0 }}
            renderItem={({ item }) => (
              <View style={{ width: cardW, alignItems: 'center', paddingHorizontal: 22 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Image source={item.img} style={[styles.img, { width: item.w, height: item.h }]} resizeMode={item.fit} />
                <Text style={styles.body}>{item.body}</Text>
              </View>
            )}
          />
          <View style={{ flex: 1 }} />
          <View style={styles.dots}>
            {PAGES.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
            ))}
          </View>
          <PrimaryButton
            title={index === PAGES.length - 1 ? 'Get Started →' : 'Next →'}
            height={50}
            radius={16}
            fontSize={21}
            style={{ marginHorizontal: 22 }}
            textStyle={{ fontFamily: fonts.bold }}
            onPress={next}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 40, borderWidth: 1, borderColor: '#15294A', backgroundColor: 'rgba(7,15,32,0.72)', paddingTop: 24, paddingBottom: 24, overflow: 'hidden' },
  skip: { position: 'absolute', right: 32, top: 22, zIndex: 2 },
  skipText: { fontFamily: fonts.semi, fontSize: 13, color: '#B7C3DA' },
  title: { fontFamily: fonts.bold, fontSize: 21, color: colors.text, textAlign: 'center', marginTop: 28, marginBottom: 22 },
  img: { borderRadius: 12, borderWidth: 1.5, borderColor: colors.cyan, marginBottom: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 24, color: colors.text, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 22 },
  dot: { width: 11, height: 11, borderRadius: 6, borderWidth: 1.5, borderColor: colors.cyan },
  dotOn: { backgroundColor: colors.cyan },
});
