import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BodyText, Card, RajulScreen, SectionTitle, Tag } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { LESSONS } from '@/src/data/lessons';
import { PILLAR_ORDER, PILLARS } from '@/src/data/pillars';
import { STORAGE_KEYS, useStoredJson } from '@/src/lib/storage';
import type { Entry, PillarKey } from '@/src/types/app';

type FilterKey = 'all' | PillarKey;

export default function LibraryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const entries = useStoredJson<Entry[]>(STORAGE_KEYS.userEntries, []);
  const bookmarks = useStoredJson<string[]>(STORAGE_KEYS.userBookmarks, []);

  const completedLessonIds = new Set(entries.map((entry) => entry.lessonId));

  const lessons = useMemo(() => {
    return LESSONS.filter((lesson) => (filter === 'all' ? true : lesson.pillar === filter)).filter((lesson) => {
      const haystack = `${lesson.title} ${lesson.body} ${lesson.subtitle}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [filter, query]);

  const bookmarkedLessons = LESSONS.filter((lesson) => bookmarks.includes(lesson.id));

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <SectionTitle>Lesson library</SectionTitle>
        <Text style={[styles.heading, { color: theme.colors.text }]}>Browse every lesson across the four pillars.</Text>
      </View>

      <Card outlined>
        <SectionTitle>Search</SectionTitle>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by title or body text"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.overlay }]}
        />
      </Card>

      <View style={styles.filterRow}>
        {(['all', ...PILLAR_ORDER.map((pillar) => pillar.key)] as FilterKey[]).map((key) => (
          <Pressable key={key} onPress={() => setFilter(key)}>
            <Tag label={key === 'all' ? 'All' : PILLARS[key].english} filled={filter === key} />
          </Pressable>
        ))}
      </View>

      {bookmarkedLessons.length > 0 ? (
        <Card dark>
          <SectionTitle>Bookmarked</SectionTitle>
          {bookmarkedLessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}
              style={styles.row}>
              <View style={styles.copy}>
                <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>{lesson.title}</Text>
                <BodyText muted>{PILLARS[lesson.pillar].english}</BodyText>
              </View>
              <Text style={[styles.time, { color: theme.colors.accent }]}>{`${lesson.estimatedReadMinutes} min`}</Text>
            </Pressable>
          ))}
        </Card>
      ) : null}

      {lessons.length === 0 ? (
        <Card outlined>
          <SectionTitle>No results</SectionTitle>
          <BodyText muted>Try a different title, keyword, or pillar filter.</BodyText>
        </Card>
      ) : (
        <View style={styles.list}>
          {lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}>
              <Card style={styles.lessonCard}>
                <View style={styles.rowBetween}>
                  <Tag label={PILLARS[lesson.pillar].english} />
                  {completedLessonIds.has(lesson.id) ? <Text style={[styles.check, { color: theme.colors.accent }]}>✓</Text> : null}
                </View>
                <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>{lesson.title}</Text>
                <BodyText muted numberOfLines={2}>
                  {lesson.body}
                </BodyText>
                <Text style={[styles.time, { color: theme.colors.muted }]}>{`${lesson.estimatedReadMinutes} min read`}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: {
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
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  list: {
    gap: 12,
  },
  lessonCard: {
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  lessonTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  time: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: 'DMSans_500Medium',
  },
  check: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'DMSans_700Bold',
  },
});
