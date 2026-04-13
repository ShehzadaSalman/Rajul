import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Reanimated, { FadeInDown } from 'react-native-reanimated';

import { BodyText, Card, PrimaryButton, ProgressBar, RajulScreen, SectionTitle } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { PILLAR_ORDER } from '@/src/data/pillars';
import { useLesson } from '@/src/hooks/useLesson';
import { useStreak } from '@/src/hooks/useStreak';
import { addDays, toLocalDateKey } from '@/src/lib/date';
import { STORAGE_KEYS, useStoredJson } from '@/src/lib/storage';
import type { Entry } from '@/src/types/app';

function buildHeatmap(completedDates: string[]) {
  const today = toLocalDateKey();
  return Array.from({ length: 30 }).map((_, index) => addDays(today, index - 29)).map((date) => ({
    date,
    done: completedDates.includes(date),
  }));
}

export default function DashboardScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const entries = useStoredJson<Entry[]>(STORAGE_KEYS.userEntries, []);
  const { currentStreak, completedDates } = useStreak();
  const { todaysLesson } = useLesson();

  const heatmap = buildHeatmap(completedDates);

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <Reanimated.View entering={FadeInDown.duration(260)} style={styles.wrapper}>
        <View style={styles.header}>
          <SectionTitle>Dashboard</SectionTitle>
          <Text style={[styles.heading, { color: theme.colors.text }]}>Character is trained, not announced.</Text>
          <BodyText muted>{`${entries.length} completed lessons · ${currentStreak} day streak`}</BodyText>
        </View>

        <Card dark>
          <SectionTitle>Continue today</SectionTitle>
          {todaysLesson ? (
            <>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>{todaysLesson.title}</Text>
              <BodyText muted>{todaysLesson.subtitle}</BodyText>
              <PrimaryButton
                label="Open lesson"
                onPress={() =>
                  router.push({
                    pathname: '/lesson',
                    params: { lessonId: todaysLesson.id },
                  })
                }
              />
            </>
          ) : (
            <BodyText muted>Complete onboarding to unlock your daily lesson flow.</BodyText>
          )}
        </Card>

        <View style={styles.grid}>
          {PILLAR_ORDER.map((pillar) => {
            const completed = entries.filter((entry) => entry.pillar === pillar.key).length;
            const progress = completed / pillar.totalLessons;

            return (
              <Pressable key={pillar.key} onPress={() => router.push(`/pillar/${pillar.key}`)} style={[styles.pillarCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
                <Text style={[styles.pillarArabic, { color: theme.colors.accent }]}>{pillar.arabic}</Text>
                <Text style={[styles.cardHeading, { color: theme.colors.text }]}>{pillar.english}</Text>
                <BodyText muted>{`${completed}/${pillar.totalLessons} lessons completed`}</BodyText>
                <ProgressBar progress={progress} />
              </Pressable>
            );
          })}
        </View>

        <Card outlined>
          <View style={styles.rowBetween}>
            <View>
              <SectionTitle>30 day heatmap</SectionTitle>
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>Your recent consistency</Text>
            </View>
            <BodyText muted>{`${completedDates.length} active days`}</BodyText>
          </View>
          <View style={styles.heatmapGrid}>
            {heatmap.map((item) => (
              <View
                key={item.date}
                style={[
                  styles.heatCell,
                  {
                    backgroundColor: item.done ? theme.colors.accent : theme.colors.overlay,
                    borderColor: item.done ? theme.colors.accent : theme.colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </Card>
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
  header: {
    gap: 8,
  },
  heading: {
    fontSize: 34,
    lineHeight: 38,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  cardHeading: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pillarCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  pillarArabic: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heatCell: {
    width: '13%',
    height: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
});
