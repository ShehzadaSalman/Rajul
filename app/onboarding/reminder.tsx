import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Reanimated, { FadeInRight } from 'react-native-reanimated';

import { BodyText, Card, HeroTitle, PrimaryButton, RajulScreen, SectionTitle, StepDots } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { getReminderMeta, scheduleDailyReminder } from '@/src/lib/notifications';
import type { ReminderTime } from '@/src/types/app';
import { useAuth } from '@/providers/auth-provider';

const reminderOptions: ReminderTime[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function ReminderOnboardingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { onboardingDraft, updateOnboardingDraft } = useAuth();

  const handleContinue = async () => {
    if (!onboardingDraft.reminderSlot) {
      return;
    }

    const scheduled = await scheduleDailyReminder(onboardingDraft.reminderSlot);
    if (!scheduled) {
      Alert.alert('Notifications disabled', 'Rajul can still continue, but your daily reminder was not scheduled.');
    }

    router.push('/onboarding/focus');
  };

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <Reanimated.View entering={FadeInRight.duration(240)} style={styles.wrapper}>
        <StepDots total={3} active={1} />
        <View style={styles.copy}>
          <SectionTitle>Step 2 of 3</SectionTitle>
          <HeroTitle>When should Rajul remind you?</HeroTitle>
          <BodyText muted>Pick the moment you are most likely to obey instead of saying “later.”</BodyText>
        </View>

        <View style={styles.list}>
          {reminderOptions.map((option) => {
            const meta = getReminderMeta(option);
            const active = onboardingDraft.reminderSlot === option;

            return (
              <Pressable key={option} onPress={() => updateOnboardingDraft({ reminderSlot: option })}>
                <Card
                  dark={active}
                  outlined={!active}
                  style={[
                    styles.optionCard,
                    active && { borderColor: theme.colors.accent, backgroundColor: 'rgba(201,168,76,0.12)' },
                  ]}>
                  <View style={styles.row}>
                    <View style={[styles.dot, active && { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent }]} />
                    <View style={styles.optionCopy}>
                      <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{meta.label}</Text>
                      <BodyText muted>{`Daily reminder around ${meta.time}`}</BodyText>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <PrimaryButton label="Set reminder" disabled={!onboardingDraft.reminderSlot} onPress={() => void handleContinue()} />
      </Reanimated.View>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  wrapper: {
    gap: 18,
  },
  copy: {
    gap: 8,
  },
  list: {
    gap: 12,
  },
  optionCard: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'CormorantGaramond_700Bold',
  },
});
