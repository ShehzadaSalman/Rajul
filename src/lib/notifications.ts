import { Platform } from 'react-native';

import type { ReminderTime } from '@/src/types/app';
import { STORAGE_KEYS, getBoolean, setString } from '@/src/lib/storage';

type NotificationsModule = {
  getPermissionsAsync: () => Promise<{ granted: boolean }>;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  cancelAllScheduledNotificationsAsync: () => Promise<void>;
  scheduleNotificationAsync: (input: unknown) => Promise<string>;
  setNotificationHandler: (handler: unknown) => void;
  SchedulableTriggerInputTypes: {
    DAILY: string;
  };
};

function getNotificationsModule(): NotificationsModule | null {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require('expo-notifications') as NotificationsModule;
    return module;
  } catch {
    return null;
  }
}

const Notifications = getNotificationsModule();

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

const REMINDER_SCHEDULE: Record<ReminderTime, { hour: number; minute: number; label: string }> = {
  fajr: { hour: 5, minute: 0, label: 'Fajr' },
  asr: { hour: 16, minute: 0, label: 'Asr' },
  isha: { hour: 21, minute: 0, label: 'Isha' },
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
      title: `Rajul • ${meta.label} reminder`,
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
