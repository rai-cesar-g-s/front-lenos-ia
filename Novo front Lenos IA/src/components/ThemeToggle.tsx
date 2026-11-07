import { useSyncExternalStore } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const key = 'lenos-theme';
let theme: 'light' | 'dark' = 'light';
try {
  if (localStorage.getItem(key) === 'dark') theme = 'dark';
} catch { /* The toggle still works when storage is unavailable. */ }
document.documentElement.dataset.theme = theme;

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const getTheme = () => theme;

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getTheme) === 'dark';
  const label = dark ? 'Ativar tema claro' : 'Ativar tema escuro';
  return <button type="button" className="theme-toggle" aria-label={label} title={label}
    onClick={() => {
      theme = dark ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem(key, theme); } catch { /* Keep the current theme. */ }
      listeners.forEach(listener => listener());
    }}>
    {dark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
  </button>;
}
