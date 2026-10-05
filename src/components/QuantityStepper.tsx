import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

type Props = { qty: number; onMinus: () => void; onPlus: () => void; width?: number };

export default function QuantityStepper({ qty, onMinus, onPlus, width = 111 }: Props) {
  return (
    <View style={[styles.box, { width }]}>
      <Pressable hitSlop={8} onPress={onMinus} style={styles.btn}>
        <Feather name="minus" size={20} color={colors.cyan} />
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable hitSlop={8} onPress={onPlus} style={styles.btn}>
        <Feather name="plus" size={20} color={colors.cyan} />
      </Pressable>
    </View>
  );
}

export function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.add} hitSlop={6}>
      <Feather name="plus" size={20} color={colors.cyan} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  btn: { width: 28, alignItems: 'center' },
  qty: { fontFamily: fonts.semi, fontSize: 14, color: colors.text },
  add: {
    width: 38,
    height: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
