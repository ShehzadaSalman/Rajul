import { PropsWithChildren, createContext, useContext, useMemo } from 'react';

import { syncReminderState } from '@/src/lib/notifications';
import {
  STORAGE_KEYS,
  getFocusPillar,
  getReminderTime,
  setBoolean,
  setFocusPillar,
  setName,
  setReminderTime,
  setString,
  useStoredBoolean,
  useStoredString,
} from '@/src/lib/storage';
import type { PillarKey, RajulProfile, ReminderTime } from '@/src/types/app';

type OnboardingDraft = {
  displayName: string;
  reminderSlot: ReminderTime | null;
  focusPillar: PillarKey | null;
};

type AuthContextValue = {
  session: null;
  user: null;
  profile: RajulProfile | null;
  loading: boolean;
  authError: string | null;
  onboardingDraft: OnboardingDraft;
  onboardingCompleted: boolean;
  signIn: (_email: string, _password: string) => Promise<void>;
  signUp: (_email: string, _password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateOnboardingDraft: (patch: Partial<OnboardingDraft>) => void;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const displayName = useStoredString(STORAGE_KEYS.userName);
  const reminderSlot = useStoredString(STORAGE_KEYS.userReminderTime) as ReminderTime | '';
  const focusPillar = useStoredString(STORAGE_KEYS.userFocusPillar) as PillarKey | '';
  const onboardingCompleted = useStoredBoolean(STORAGE_KEYS.userOnboardingComplete, false);
  const joinedAt = useStoredString(STORAGE_KEYS.userJoinedAt);

  const value = useMemo<AuthContextValue>(
    () => ({
      session: null,
      user: null,
      profile:
        displayName || focusPillar || reminderSlot || joinedAt || onboardingCompleted
          ? {
              name: displayName,
              focusPillar: focusPillar || null,
              reminderTime: reminderSlot || null,
              onboardingComplete: onboardingCompleted,
              joinedAt: joinedAt || null,
            }
          : null,
      loading: false,
      authError: null,
      onboardingDraft: {
        displayName,
        reminderSlot: reminderSlot || null,
        focusPillar: focusPillar || null,
      },
      onboardingCompleted,
      signIn: async () => {
        throw new Error('Authentication is not part of this Rajul build.');
      },
      signUp: async () => {
        throw new Error('Authentication is not part of this Rajul build.');
      },
      signOut: async () => {},
      refreshProfile: async () => {},
      updateOnboardingDraft: (patch) => {
        if (patch.displayName !== undefined) {
          setName(patch.displayName);
        }

        if (patch.reminderSlot !== undefined) {
          setReminderTime(patch.reminderSlot);
        }

        if (patch.focusPillar !== undefined) {
          setFocusPillar(patch.focusPillar);
        }
      },
      completeOnboarding: async () => {
        const currentName = displayName.trim();
        const currentReminder = getReminderTime();
        const currentPillar = getFocusPillar();

        if (currentName.length < 2) {
          throw new Error('Name is required.');
        }

        if (!currentReminder || !currentPillar) {
          throw new Error('Complete every onboarding step before continuing.');
        }

        setBoolean(STORAGE_KEYS.userOnboardingComplete, true);
        if (!joinedAt) {
          const now = new Date().toISOString();
          setString(STORAGE_KEYS.userJoinedAt, now);
        }

        await syncReminderState(currentReminder);
      },
    }),
    [displayName, focusPillar, joinedAt, onboardingCompleted, reminderSlot]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
