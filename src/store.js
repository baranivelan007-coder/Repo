import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FEES, byId } from './data';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
const PAST = [
  { id: 'NM40111', rid: 'pizza', items: 3, total: 448, date: 'Sep 18, 2026', status: 'Delivered' },
  { id: 'NM40092', rid: 'brew', items: 1, total: 120, date: 'Sep 15, 2026', status: 'Cancelled' },
];
export function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [rid, setRid] = useState(null);
  const [qty, setQty] = useState({});
  const [orders, setOrders] = useState(PAST);
  const [active, setActive] = useState(null);
  useEffect(() => { AsyncStorage.getItem('user').then(u => u && setUser(JSON.parse(u))).catch(() => {}); }, []);
  const login = u => { setUser(u); AsyncStorage.setItem('user', JSON.stringify(u)).catch(() => {}); };
  const logout = () => { setUser(null); AsyncStorage.removeItem('user').catch(() => {}); };
  const add = (r, id) => { if (rid && rid !== r) setQty({}); setRid(r); setQty(q => ({ ...(rid && rid !== r ? {} : q), [id]: (rid && rid !== r ? 0 : q[id] || 0) + 1 })); };
  const dec = id => setQty(q => { const n = { ...q, [id]: (q[id] || 0) - 1 }; if (n[id] <= 0) delete n[id]; return n; });
  const rest = rid ? byId(rid) : null;
  const lines = rest ? rest.menu.filter(i => qty[i.id]).map(i => ({ ...i, qty: qty[i.id] })) : [];
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const sub = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const total = count ? sub + FEES.delivery + FEES.tax - FEES.discount : 0;
  const place = method => {
    const o = { id: 'NM' + Math.floor(10000 + Math.random() * 89999), rid, items: count, sub, total, method, lines, date: new Date().toDateString(), status: 'On the way' };
    setActive(o); setQty({}); setRid(null); return o;
  };
  const complete = () => { setOrders(os => [{ ...active, status: 'Delivered' }, ...os]); setActive(null); };
  return <Ctx.Provider value={{ user, login, logout, rest, lines, count, sub, total, add, dec, qty, place, active, complete, orders }}>{children}</Ctx.Provider>;
}
