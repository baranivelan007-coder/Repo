import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AuthShell from '../src/components/AuthShell';
import PrimaryButton from '../src/components/PrimaryButton';
import TextField from '../src/components/TextField';
import { colors, fonts } from '../src/theme';
import { login } from '../src/services/auth';
import { useAuth } from '../src/store/auth';
import { useLocationStore } from '../src/store/location';
import { toast } from '../src/store/ui';

export default function Login() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !pw) {
      setError('Enter your email and password');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const user = await login(email, pw);
      setUser(user);
      router.replace(useLocationStore.getState().asked ? '/(tabs)' : '/location');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.sub}>Log in to continue your food journey.</Text>
      <View style={{ marginTop: 26 }}>
        <TextField label="Email" icon="mail" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextField label="Password" icon="lock" placeholder="Enter password" value={pw} onChangeText={setPw} secure error={error} />
        <Pressable style={{ alignSelf: 'flex-end', marginTop: -4 }} onPress={() => toast('Password reset is coming soon')} hitSlop={8}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>
      </View>
      <PrimaryButton title="Log In" height={52} radius={16} fontSize={22} loading={busy} onPress={submit} style={{ marginTop: 26 }} />
      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.or}>OR</Text>
        <View style={styles.line} />
      </View>
      <Pressable style={styles.google} onPress={() => toast('Google sign-in is not configured yet')}>
        <Image source={require('../assets/images/google.png')} style={{ width: 26, height: 26 }} />
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>
      <View style={styles.foot}>
        <Text style={styles.footText}>Don't have an account?</Text>
        <Pressable onPress={() => router.replace('/signup')} hitSlop={8}>
          <Text style={styles.link}> Sign Up</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.text, textAlign: 'center' },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.text, textAlign: 'center', marginTop: 2 },
  forgot: { fontFamily: fonts.medium, fontSize: 12, color: colors.cyan },
  orRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginVertical: 12 },
  line: { height: 1, width: 62, backgroundColor: '#1E3B66' },
  or: { fontFamily: fonts.medium, fontSize: 12, color: colors.cyan },
  google: { height: 52, borderRadius: 16, borderWidth: 1, borderColor: '#3A4558', backgroundColor: '#1D2634', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  googleText: { fontFamily: fonts.semi, fontSize: 18, color: colors.text },
  foot: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  footText: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textSoft },
  link: { fontFamily: fonts.semi, fontSize: 12.5, color: colors.cyan },
});
