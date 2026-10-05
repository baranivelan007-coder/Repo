import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AuthShell from '../src/components/AuthShell';
import PrimaryButton from '../src/components/PrimaryButton';
import TextField from '../src/components/TextField';
import { colors, fonts } from '../src/theme';
import { register } from '../src/services/auth';
import { useAuth } from '../src/store/auth';
import { useLocationStore } from '../src/store/location';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Please enter your full name';
    if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address';
    if (pw.length < 6) e.pw = 'Use at least 6 characters';
    if (pw2 !== pw) e.pw2 = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const user = await register(name, email, pw);
      setUser(user);
      router.replace(useLocationStore.getState().asked ? '/(tabs)' : '/location');
    } catch (err: any) {
      setErrors({ email: err?.message ?? 'Could not create account' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.sub}>Join Navi Meal and discover food around you.</Text>
      <View style={{ marginTop: 14 }}>
        <TextField label="Full Name" icon="user" placeholder="Enter your name" value={name} onChangeText={setName} autoCapitalize="words" error={errors.name} />
        <TextField label="Email" icon="mail" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
        <TextField label="Password" icon="lock" placeholder="Create a password" value={pw} onChangeText={setPw} secure error={errors.pw} />
        <TextField label="Confirm Password" icon="lock" placeholder="Confirm password" value={pw2} onChangeText={setPw2} secure error={errors.pw2} />
      </View>
      <PrimaryButton title="Create Account" height={52} radius={16} fontSize={21} loading={busy} onPress={submit} style={{ marginTop: 10 }} />
      <View style={styles.foot}>
        <Text style={styles.footText}>Already have an account?</Text>
        <Pressable onPress={() => router.replace('/login')} hitSlop={8}>
          <Text style={styles.link}> Login In</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.text, textAlign: 'center' },
  sub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.text, textAlign: 'center', marginTop: 2 },
  foot: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  footText: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textSoft },
  link: { fontFamily: fonts.semi, fontSize: 12.5, color: colors.cyan },
});
