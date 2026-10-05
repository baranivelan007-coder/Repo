export const rupee = (n: number) => `₹${Math.round(n)}`;

export function formatClock(ms: number, withMeridiem = true): string {
  const d = new Date(ms);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const mer = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return withMeridiem ? `${h}:${m} ${mer}` : `${h}:${m}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDate(ms: number): string {
  const d = new Date(ms);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
