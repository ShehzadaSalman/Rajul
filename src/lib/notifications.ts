import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import type * as NotificationsType from 'expo-notifications';

import type { ReminderTime } from '@/src/types/app';
import { STORAGE_KEYS, getBoolean, setString } from '@/src/lib/storage';

type NotificationsModule = typeof NotificationsType;

// expo-notifications is unavailable on web and throws in Expo Go on SDK 53+
const canNotify = Platform.OS !== 'web' && !isRunningInExpoGo();

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Notifications: NotificationsModule | null = canNotify
  ? (() => { try { return require('expo-notifications') as NotificationsModule; } catch { return null; } })()
  : null;

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

const REMINDER_SCHEDULE: Record<ReminderTime, { hour: number; minute: number; label: string; time: string }> = {
  fajr: { hour: 5, minute: 0, label: 'Fajr', time: '5:00 AM' },
  dhuhr: { hour: 13, minute: 0, label: 'Dhuhr', time: '1:00 PM' },
  asr: { hour: 16, minute: 0, label: 'Asr', time: '4:00 PM' },
  maghrib: { hour: 18, minute: 30, label: 'Maghrib', time: '6:30 PM' },
  isha: { hour: 21, minute: 0, label: 'Isha', time: '9:00 PM' },
};

export function getReminderMeta(reminderTime: ReminderTime) {
  return REMINDER_SCHEDULE[reminderTime];
}

export async function ensureReminderPermissions() {
  if (!Notifications) {
    return false;
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function cancelReminderNotification() {
  if (!Notifications) {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyReminder(reminderTime: ReminderTime) {
  if (!Notifications) {
    setString(STORAGE_KEYS.userReminderTime, reminderTime);
    return false;
  }

  const granted = await ensureReminderPermissions();
  if (!granted) {
    return false;
  }

  await cancelReminderNotification();
  const meta = getReminderMeta(reminderTime);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Rajul \u2022 ${meta.label} reminder`,
      body: 'Your lesson is waiting. Show up before the day pulls you elsewhere.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: meta.hour,
      minute: meta.minute,
    },
  });

  return true;
}

export async function syncReminderState(reminderTime: ReminderTime | null, enabled?: boolean) {
  const remindersEnabled = enabled ?? getBoolean(STORAGE_KEYS.settingsRemindersEnabled, true);

  if (!remindersEnabled || !reminderTime) {
    await cancelReminderNotification();
    return false;
  }

  return scheduleDailyReminder(reminderTime);
}
