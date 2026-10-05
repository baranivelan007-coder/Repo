import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';
import { useUI } from '../store/ui';

export default function ToastHost() {
  const message = useUI((s) => s.message);
  const opacity = useRef(new Animated.Value(0)).current;
  const last = useRef('');
  if (message) last.current = message;
  useEffect(() => {
    Animated.timing(opacity, { toValue: message ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [message, opacity]);
  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]}>
      <Text style={styles.text}>{last.current}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: '#18263C',
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    maxWidth: '86%',
  },
  text: { fontFamily: fonts.medium, color: colors.text, fontSize: 13, textAlign: 'center' },
});
