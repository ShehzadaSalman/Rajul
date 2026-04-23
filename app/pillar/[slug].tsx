import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BodyText, Card, IconButton, ProgressBar, RajulScreen, Tag, TopBar } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { getLessonsByPillar } from '@/src/data/lessons';
import { PILLARS } from '@/src/data/pillars';
import { STORAGE_KEYS, useStoredJson } from '@/src/lib/storage';
import type { Entry, PillarKey } from '@/src/types/app';

export default function PillarDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: PillarKey }>();
  const pillar = PILLARS[slug] ?? PILLARS.quwwah;
  const lessons = getLessonsByPillar(pillar.key);
  const entries = useStoredJson<Entry[]>(STORAGE_KEYS.userEntries, []);
  const completed = entries.filter((entry) => entry.pillar === pillar.key).length;

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <TopBar left={<IconButton icon="arrow-back" onPress={() => router.back()} />} />

      <Card dark>
        <Text style={[styles.arabic, { color: theme.colors.accent }]}>{pillar.arabic}</Text>
        <Text style={[styles.english, { color: theme.colors.text }]}>{pillar.english}</Text>
        <BodyText muted>{pillar.description}</BodyText>
        <ProgressBar progress={completed / pillar.totalLessons} />
        <BodyText muted>{`${completed}/${pillar.totalLessons} lessons completed`}</BodyText>
      </Card>

      <View style={styles.list}>
        {lessons.map((lesson) => {
          const isComplete = entries.some((entry) => entry.lessonId === lesson.id);
          return (
            <Pressable key={lesson.id} onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}>
              <Card outlined>
                <View style={styles.rowBetween}>
                  <Tag label={`Day ${lesson.day}`} />
                  {isComplete ? <Text style={[styles.check, { color: theme.colors.accent }]}>✓</Text> : null}
                </View>
                <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>{lesson.title}</Text>
                <BodyText muted>{lesson.subtitle}</BodyText>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 18 },
  arabic: { fontSize: 32, lineHeight: 36, fontFamily: 'CormorantGaramond_700Bold' },
  english: { fontSize: 34, lineHeight: 38, fontFamily: 'CormorantGaramond_700Bold' },
  list: { gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  lessonTitle: { fontSize: 24, lineHeight: 28, fontFamily: 'CormorantGaramond_700Bold' },
  check: { fontSize: 20, lineHeight: 24, fontFamily: 'DMSans_700Bold' },
});
