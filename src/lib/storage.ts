import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import type { Entry, PillarKey, ReflectionEntry, ReminderTime } from '@/src/types/app';

type Listener = () => void;

type NativeStorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => boolean;
};

export const STORAGE_KEYS = {
  userName: 'user.name',
  userReminderTime: 'user.reminderTime',
  userFocusPillar: 'user.focusPillar',
  userOnboardingComplete: 'user.onboardingComplete',
  userEntries: 'user.entries',
  userBookmarks: 'user.bookmarks',
  userUsedPrompts: 'user.usedPrompts',
  userReflections: 'user.reflections',
  userJoinedAt: 'user.joinedAt',
  settingsTheme: 'settings.theme',
  settingsRemindersEnabled: 'settings.remindersEnabled',
  settingsClaudeApiKey: 'settings.claudeApiKey',
  reflectionDraft: 'reflection.draft',
} as const;

const listeners = new Set<Listener>();
const secureStoreCache = new Map<string, string | undefined>();
const jsonSnapshotCache = new Map<string, { raw: string | undefined; value: unknown }>();

function notify() {
  listeners.forEach((listener) => listener());
}

function getWebValue(key: string) {
  if (typeof localStorage === 'undefined') {
    return undefined;
  }

  const value = localStorage.getItem(key);
  return value === null ? undefined : value;
}

function setWebValue(key: string, value: string | undefined) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (value === undefined) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, value);
}

function getNativeStorage(): NativeStorageLike | null {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    // Keep MMKV optional so Expo Go can boot using the SecureStore fallback.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mmkvModule = require('react-native-mmkv') as {
      createMMKV?: (config?: { id?: string }) => NativeStorageLike;
    };

    if (typeof mmkvModule.createMMKV === 'function') {
      return mmkvModule.createMMKV({ id: 'rajul-app' });
    }
  } catch {
    return null;
  }

  return null;
}

const nativeStorage = getNativeStorage();

async function hydrateSecureStoreCache() {
  if (Platform.OS === 'web' || nativeStorage) {
    return;
  }

  await Promise.all(
    Object.values(STORAGE_KEYS).map(async (key) => {
      const value = await SecureStore.getItemAsync(key);
      secureStoreCache.set(key, value ?? undefined);
    })
  );

  notify();
}

void hydrateSecureStoreCache();

export function subscribeStorage(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getString(key: string) {
  if (nativeStorage) {
    return nativeStorage.getString(key);
  }

  if (Platform.OS === 'web') {
    return getWebValue(key);
  }

  return secureStoreCache.get(key);
}

export function setString(key: string, value: string | undefined) {
  if (nativeStorage) {
    if (value === undefined) {
      nativeStorage.remove(key);
    } else {
      nativeStorage.set(key, value);
    }
  } else if (Platform.OS === 'web') {
    setWebValue(key, value);
  } else {
    secureStoreCache.set(key, value);

    if (value === undefined) {
      void SecureStore.deleteItemAsync(key);
    } else {
      void SecureStore.setItemAsync(key, value);
    }
  }

  notify();
}

export function getBoolean(key: string, fallback = false) {
  const value = getString(key);
  if (value === undefined) {
    return fallback;
  }

  return value === '1' || value === 'true';
}

export function setBoolean(key: string, value: boolean) {
  setString(key, value ? '1' : '0');
}

export function getJson<T>(key: string, fallback: T): T {
  const value = getString(key);
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function setJson<T>(key: string, value: T) {
  setString(key, JSON.stringify(value));
}

export function useStoredString(key: string, fallback = '') {
  return useSyncExternalStore(
    subscribeStorage,
    () => getString(key) ?? fallback,
    () => fallback
  );
}

export function useStoredBoolean(key: string, fallback = false) {
  return useSyncExternalStore(
    subscribeStorage,
    () => getBoolean(key, fallback),
    () => fallback
  );
}

export function useStoredJson<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    subscribeStorage,
    (): T => {
      const raw = getString(key);
      const cached = jsonSnapshotCache.get(key);
      if (cached !== undefined && cached.raw === raw) {
        return cached.value as T;
      }
      let value: T;
      if (!raw) {
        value = fallback;
      } else {
        try {
          value = JSON.parse(raw) as T;
        } catch {
          value = fallback;
        }
      }
      jsonSnapshotCache.set(key, { raw, value });
      return value;
    },
    () => fallback
  );
}

export function getName() {
  return getString(STORAGE_KEYS.userName) ?? '';
}

export function setName(name: string) {
  setString(STORAGE_KEYS.userName, name.trim());
}

export function getReminderTime() {
  return (getString(STORAGE_KEYS.userReminderTime) as ReminderTime | undefined) ?? null;
}

export function setReminderTime(reminderTime: ReminderTime | null) {
  setString(STORAGE_KEYS.userReminderTime, reminderTime ?? undefined);
}

export function getFocusPillar() {
  return (getString(STORAGE_KEYS.userFocusPillar) as PillarKey | undefined) ?? null;
}

export function setFocusPillar(pillar: PillarKey | null) {
  setString(STORAGE_KEYS.userFocusPillar, pillar ?? undefined);
}

export function getEntries() {
  return getJson<Entry[]>(STORAGE_KEYS.userEntries, []);
}

export function setEntries(entries: Entry[]) {
  setJson(STORAGE_KEYS.userEntries, entries);
}

export function getReflections() {
  return getJson<ReflectionEntry[]>(STORAGE_KEYS.userReflections, []);
}

export function setReflections(reflections: ReflectionEntry[]) {
  setJson(STORAGE_KEYS.userReflections, reflections);
}

export function getBookmarks() {
  return getJson<string[]>(STORAGE_KEYS.userBookmarks, []);
}

export function setBookmarks(bookmarks: string[]) {
  setJson(STORAGE_KEYS.userBookmarks, bookmarks);
}

export function getUsedPrompts() {
  return getJson<string[]>(STORAGE_KEYS.userUsedPrompts, []);
}

export function setUsedPrompts(promptIds: string[]) {
  setJson(STORAGE_KEYS.userUsedPrompts, promptIds);
}

export function resetRajulData() {
  Object.values(STORAGE_KEYS).forEach((key) => setString(key, undefined));
}
