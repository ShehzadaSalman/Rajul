import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BodyText, Card, IconButton, RajulScreen, Tag, TopBar } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { PILLARS } from '@/src/data/pillars';
import { useStreak } from '@/src/hooks/useStreak';
import { formatMonthKey } from '@/src/lib/date';
import { STORAGE_KEYS, useStoredJson } from '@/src/lib/storage';
import type { ReflectionEntry } from '@/src/types/app';

function monthKey(date: string) {
  return date.slice(0, 7);
}

export default function JournalHistoryScreen() {
  const { theme } = useTheme();
  const reflections = useStoredJson<ReflectionEntry[]>(STORAGE_KEYS.userReflections, []);
  const { currentStreak } = useStreak();
  const monthKeys = Array.from(new Set(reflections.map((entry) => monthKey(entry.date)))).sort().reverse();
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);

  const activeMonth = monthKeys[activeMonthIndex] ?? monthKey(new Date().toISOString());
  const currentMonthEntries = reflections.filter((entry) => monthKey(entry.date) === activeMonth);

  const mostActivePillar = useMemo(() => {
    const counts = currentMonthEntries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.pillar] = (acc[entry.pillar] ?? 0) + 1;
      return acc;
    }, {});

    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return winner ? PILLARS[winner].english : 'None yet';
  }, [currentMonthEntries]);

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <TopBar
        title="Reflection history"
        subtitle={formatMonthKey(`${activeMonth}-01`)}
        left={<IconButton icon="arrow-back" href="/(tabs)/reflection" />}
        right={
          <View style={styles.monthNav}>
            <Pressable disabled={activeMonthIndex >= monthKeys.length - 1} onPress={() => setActiveMonthIndex((value) => Math.min(monthKeys.length - 1, value + 1))}>
              <MaterialIcons name="chevron-left" size={20} color={theme.colors.text} />
            </Pressable>
            <Pressable disabled={activeMonthIndex <= 0} onPress={() => setActiveMonthIndex((value) => Math.max(0, value - 1))}>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.text} />
            </Pressable>
          </View>
        }
      />

      <Card dark>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.accent }]}>{reflections.length}</Text>
            <BodyText muted>Total reflections</BodyText>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.colors.accent }]}>{currentStreak}</Text>
            <BodyText muted>Current streak</BodyText>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>{mostActivePillar}</Text>
            <BodyText muted>Most active pillar</BodyText>
          </View>
        </View>
      </Card>

      {currentMonthEntries.length === 0 ? (
        <Card outlined>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No reflections yet</Text>
          <BodyText muted>Write honestly after your next lesson and this history will start to feel alive.</BodyText>
        </Card>
      ) : (
        <View style={styles.list}>
          {currentMonthEntries.map((entry) => (
            <Link key={entry.id} href={{ pathname: '/journal/[entry]', params: { entry: entry.id } }} asChild>
              <Pressable>
                <Card style={styles.entryCard}>
                  <View style={styles.rowBetween}>
                    <Tag label={PILLARS[entry.pillar].english} />
                    <BodyText muted>{entry.date}</BodyText>
                  </View>
                  <Text style={[styles.prompt, { color: theme.colors.text }]} numberOfLines={2}>
                    {entry.promptText}
                  </Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.mood}>{entry.mood}</Text>
                    <BodyText muted>{`${entry.wordCount} words`}</BodyText>
                  </View>
                </Card>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 18 },
  monthNav: { flexDirection: 'row', gap: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, gap: 4 },
  statNumber: { fontSize: 28, lineHeight: 32, fontFamily: 'CormorantGaramond_700Bold' },
  statLabel: { fontSize: 18, lineHeight: 22, fontFamily: 'CormorantGaramond_700Bold' },
  emptyTitle: { fontSize: 28, lineHeight: 32, fontFamily: 'CormorantGaramond_700Bold' },
  list: { gap: 12 },
  entryCard: { gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  prompt: { fontSize: 24, lineHeight: 30, fontFamily: 'CormorantGaramond_700Bold' },
  mood: { fontSize: 24, lineHeight: 28 },
});
