import React, { useState } from 'react';
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

type Props = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words';
};

export default function TextField({ label, icon, placeholder, value, onChangeText, secure, keyboardType, error, autoCapitalize = 'none' }: Props) {
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, error ? { borderColor: colors.red } : null]}>
        <Feather name={icon} size={20} color="#B8C0CC" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8E98A8"
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={styles.input}
        />
        {secure ? (
          <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)}>
            <Feather name={hidden ? 'eye-off' : 'eye'} size={20} color="#B8C0CC" />
          </Pressable>
        ) : (
          <View style={{ width: 20 }} />
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.semi, fontSize: 14, color: colors.text, marginLeft: 14, marginBottom: 4 },
  box: {
    height: 52, borderRadius: 14, backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8,
  },
  input: { flex: 1, fontFamily: fonts.semi, fontSize: 14, color: colors.text, textAlign: 'center', paddingVertical: 0 },
  error: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.red, marginLeft: 14, marginTop: 3 },
});
