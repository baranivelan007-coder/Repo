import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  radius?: number;
  fontSize?: number;
};

export default function PrimaryButton({ title, onPress, style, textStyle, disabled, loading, height = 54, radius = 18, fontSize = 20 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.btn, { height, borderRadius: radius }, disabled && { opacity: 0.5 }, pressed && { opacity: 0.85 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onCyan} />
      ) : (
        <Text style={[styles.text, { fontSize }, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: colors.cyan, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fonts.semi, color: colors.onCyan },
});
