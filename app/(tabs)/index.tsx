import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';

import { BodyText, Card, HeroTitle, IconButton, PrimaryButton, RajulScreen, SectionTitle, StreakRow, Tag } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { PILLARS } from '@/src/data/pillars';
import { useLesson } from '@/src/hooks/useLesson';
import { useStreak } from '@/src/hooks/useStreak';
import { addDays, formatLongDate, toLocalDateKey } from '@/src/lib/date';
import { STORAGE_KEYS, getEntries, setEntries, useStoredString } from '@/src/lib/storage';

function getSevenDayDots(completedDates: string[]) {
  const today = toLocalDateKey();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(today, index - 6);
    const label = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'narrow' });
    return {
      label,
      done: completedDates.includes(date),
      today: date === today,
    };
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const { theme, toggleMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const name = useStoredString(STORAGE_KEYS.userName, 'Brother');
  const { todaysLesson, isCompletedToday, nextLesson } = useLesson();
  const { currentStreak, completedDates } = useStreak();

  if (!todaysLesson) {
    return null;
  }

  const pillarMeta = PILLARS[todaysLesson.pillar];
  const today = toLocalDateKey();
  const streakDots = getSevenDayDots(completedDates);

  const handleMarkComplete = () => {
    if (isCompletedToday) {
      return;
    }

    const entries = getEntries();
    setEntries([
      ...entries,
      {
        date: today,
        pillar: todaysLesson.pillar,
        lessonId: todaysLesson.id,
        completed: true,
      },
    ]);
    router.push('/(tabs)/reflection');
  };

  return (
    <RajulScreen
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 350);
      }} tintColor={theme.colors.accent} />}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={[styles.arabicWord, { color: theme.colors.accent }]}>رجل</Text>
          <SectionTitle>{formatLongDate(today)}</SectionTitle>
          <BodyText muted>Daily self-development for Muslim men</BodyText>
        </View>
        <View style={styles.headerActions}>
          <IconButton icon="contrast" onPress={toggleMode} />
          <IconButton icon="settings" href="/settings" />
        </View>
      </View>

      <View style={styles.heroBlock}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>{`As-salamu alaykum, ${name}`}</Text>
        <HeroTitle>{todaysLesson.title}</HeroTitle>
        <BodyText muted>{todaysLesson.subtitle}</BodyText>
      </View>

      <Card dark style={styles.streakCard}>
        <View style={styles.rowBetween}>
          <View>
            <SectionTitle>Consistency</SectionTitle>
            <Text style={[styles.metric, { color: theme.colors.accent }]}>{`${currentStreak} day streak`}</Text>
          </View>
          <MaterialIcons name="local-fire-department" size={22} color={theme.colors.accent} />
        </View>
        <StreakRow days={streakDots} />
      </Card>

      <Card dark style={styles.lessonCard}>
        <View style={styles.rowBetween}>
          <View style={styles.lessonHeader}>
            <SectionTitle>Today&apos;s lesson</SectionTitle>
            <Tag label={`${pillarMeta.english} · Day ${todaysLesson.day}`} />
          </View>
          <IconButton
            icon="menu-book"
            onPress={() =>
              router.push({
                pathname: '/lesson',
                params: { lessonId: todaysLesson.id },
              })
            }
          />
        </View>

        <View style={[styles.ayahBlock, { borderColor: theme.colors.border }]}>
          <Text style={[styles.ayahArabic, { color: theme.colors.accent }]}>{todaysLesson.ayah.arabic}</Text>
          <Text style={[styles.ayahReference, { color: theme.colors.text }]}>{todaysLesson.ayah.translation}</Text>
          <BodyText muted>{todaysLesson.ayah.reference}</BodyText>
        </View>

        <Text style={[styles.bodySnippet, { color: theme.colors.text }]} numberOfLines={3}>
          {todaysLesson.body}
        </Text>

        <Card outlined style={[styles.actionCallout, { borderColor: theme.colors.border }]}>
          <SectionTitle>Today&apos;s action</SectionTitle>
          <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{todaysLesson.action.title}</Text>
          <BodyText muted>{todaysLesson.action.description}</BodyText>
        </Card>

        {isCompletedToday ? (
          <Card outlined>
            <SectionTitle>Completed today</SectionTitle>
            <BodyText muted>
              You already showed up today. Come back tomorrow. For now, keep the standard and avoid drifting.
            </BodyText>
            {nextLesson ? <BodyText>{`Tomorrow: ${nextLesson.title}`}</BodyText> : null}
          </Card>
        ) : (
          <View style={styles.ctaRow}>
            <PrimaryButton
              label="Read more"
              onPress={() =>
                router.push({
                  pathname: '/lesson',
                  params: { lessonId: todaysLesson.id },
                })
              }
            />
            <PrimaryButton label="Mark complete" onPress={handleMarkComplete} />
          </View>
        )}
      </Card>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  arabicWord: {
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  heroBlock: {
    gap: 8,
  },
  greeting: {
    fontSize: 30,
    lineHeight: 34,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  streakCard: {
    gap: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  metric: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  lessonCard: {
    gap: 16,
  },
  lessonHeader: {
    gap: 8,
  },
  ayahBlock: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  ayahArabic: {
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'right',
    fontFamily: 'CormorantGaramond_700Bold',
  },
  ayahReference: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  bodySnippet: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'DMSans_400Regular',
  },
  actionCallout: {
    gap: 8,
  },
  actionTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  ctaRow: {
    gap: 10,
  },
});
