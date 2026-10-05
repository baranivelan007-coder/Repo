// Local mock auth (no backend yet). Passwords are SHA-256 hashed before being stored;
// the real app will call POST /api/auth/register & /login (Spring Security + JWT).
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { User } from '../types';

const USERS_KEY = 'navimeal.users.v1';
type Stored = User & { passwordHash: string };

const hash = (pw: string, email: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${email.toLowerCase()}::${pw}`);

async function readUsers(): Promise<Stored[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Stored[]) : [];
  } catch {
    return [];
  }
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const users = await readUsers();
  const e = email.trim().toLowerCase();
  if (users.some((u) => u.email === e)) throw new Error('An account with this email already exists.');
  const user: Stored = {
    id: `u_${Date.now()}`,
    name: name.trim(),
    email: e,
    passwordHash: await hash(password, e),
  };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return { id: user.id, name: user.name, email: user.email };
}

export async function login(email: string, password: string): Promise<User> {
  const users = await readUsers();
  const e = email.trim().toLowerCase();
  const found = users.find((u) => u.email === e);
  if (!found || found.passwordHash !== (await hash(password, e))) {
    throw new Error('Invalid email or password.');
  }
  return { id: found.id, name: found.name, email: found.email };
}
