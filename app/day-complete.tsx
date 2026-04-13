import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Reanimated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { BodyText, Card, PrimaryButton, RajulScreen, SectionTitle } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { PILLARS } from '@/src/data/pillars';
import { useLesson } from '@/src/hooks/useLesson';
import { useStreak } from '@/src/hooks/useStreak';
import { STORAGE_KEYS, useStoredString } from '@/src/lib/storage';

export default function DayCompleteScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { nextLesson } = useLesson();
  const { currentStreak } = useStreak();
  const name = useStoredString(STORAGE_KEYS.userName, 'Brother');
  const scale = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 160 });
    const timer = setTimeout(() => router.replace('/(tabs)'), 8000);
    return () => clearTimeout(timer);
  }, [router, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const milestone = [7, 14, 21, 30].includes(currentStreak);
  const nextPillar = nextLesson ? PILLARS[nextLesson.pillar] : null;

  return (
    <RajulScreen scroll={false} contentContainerStyle={styles.content}>
      <Reanimated.View entering={FadeInDown.duration(260)} style={styles.wrapper}>
        <Reanimated.View style={[styles.checkWrap, animatedStyle, { borderColor: theme.colors.accent }]}>
          <Text style={[styles.check, { color: theme.colors.accent }]}>✓</Text>
        </Reanimated.View>

        <View style={styles.copy}>
          <SectionTitle>Day complete</SectionTitle>
          <Text style={[styles.heading, { color: theme.colors.text }]}>{`${name}, you showed up today.`}</Text>
          <BodyText muted>
            {milestone
              ? `This is a ${currentStreak}-day milestone. Do not get arrogant about it, but do thank Allah for the consistency.`
              : 'Rajul records the repetition, not the mood. One sincere day still counts.'}
          </BodyText>
        </View>

        <Card dark style={styles.streakCard}>
          <Text style={[styles.streak, { color: theme.colors.accent }]}>{currentStreak}</Text>
          <Text style={[styles.streakLabel, { color: theme.colors.text }]}>day streak</Text>
        </Card>

        {nextLesson && nextPillar ? (
          <Card outlined>
            <SectionTitle>Tomorrow&apos;s pillar</SectionTitle>
            <Text style={[styles.nextTitle, { color: theme.colors.text }]}>{nextLesson.title}</Text>
            <BodyText muted>{`${nextPillar.english} · ${nextPillar.arabic}`}</BodyText>
          </Card>
        ) : null}

        <PrimaryButton label="Back to home" onPress={() => router.replace('/(tabs)')} />
      </Reanimated.View>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: 20 },
  wrapper: { gap: 20 },
  checkWrap: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { fontSize: 42, lineHeight: 46, fontFamily: 'DMSans_700Bold' },
  copy: { alignItems: 'center', gap: 8 },
  heading: { fontSize: 36, lineHeight: 40, textAlign: 'center', fontFamily: 'CormorantGaramond_700Bold' },
  streakCard: { alignItems: 'center', gap: 4 },
  streak: { fontSize: 48, lineHeight: 52, fontFamily: 'CormorantGaramond_700Bold' },
  streakLabel: { fontSize: 16, lineHeight: 20, fontFamily: 'DMSans_500Medium' },
  nextTitle: { fontSize: 26, lineHeight: 30, fontFamily: 'CormorantGaramond_700Bold' },
});
