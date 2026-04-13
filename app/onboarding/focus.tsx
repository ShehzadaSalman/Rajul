import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import Reanimated, { FadeInRight } from 'react-native-reanimated';

import { BodyText, HelperText, HeroTitle, PrimaryButton, RajulScreen, SectionTitle, StepDots } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { PILLAR_ORDER } from '@/src/data/pillars';
import { useAuth } from '@/providers/auth-provider';

export default function FocusOnboardingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { onboardingDraft, updateOnboardingDraft, completeOnboarding } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!onboardingDraft.focusPillar) {
      setScreenError('Choose your first pillar.');
      return;
    }

    setSubmitting(true);
    setScreenError(null);

    try {
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : 'Unable to save onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <Reanimated.View entering={FadeInRight.duration(240)} style={styles.wrapper}>
        <StepDots total={3} active={2} />
        <View style={styles.copy}>
          <SectionTitle>Step 3 of 3</SectionTitle>
          <HeroTitle>Choose your first pillar.</HeroTitle>
          <BodyText muted>Start where life feels weakest right now. Rajul will build the daily lessons around that pillar first.</BodyText>
        </View>

        <View style={styles.grid}>
          {PILLAR_ORDER.map((pillar) => {
            const selected = onboardingDraft.focusPillar === pillar.key;

            return (
              <Pressable
                key={pillar.key}
                onPress={() => updateOnboardingDraft({ focusPillar: pillar.key })}
                style={[
                  styles.card,
                  {
                    borderColor: selected ? theme.colors.accent : theme.colors.border,
                    backgroundColor: selected ? 'rgba(201,168,76,0.12)' : theme.colors.card,
                  },
                ]}>
                <Text style={[styles.arabic, { color: theme.colors.accent }]}>{pillar.arabic}</Text>
                <Text style={[styles.english, { color: theme.colors.text }]}>{pillar.english}</Text>
                <BodyText muted>{pillar.description}</BodyText>
              </Pressable>
            );
          })}
        </View>

        {screenError ? <HelperText error>{screenError}</HelperText> : null}

        <PrimaryButton label="Begin" onPress={() => void handleSubmit()} disabled={!onboardingDraft.focusPillar} loading={submitting} />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    minHeight: 210,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  arabic: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  english: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_700Bold',
  },
});
