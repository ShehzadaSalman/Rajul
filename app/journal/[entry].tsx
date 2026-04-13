import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { BodyText, Card, IconButton, RajulScreen, Tag, TopBar } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { PILLARS } from '@/src/data/pillars';
import { STORAGE_KEYS, useStoredJson } from '@/src/lib/storage';
import type { ReflectionEntry } from '@/src/types/app';

export default function JournalEntryScreen() {
  const { theme } = useTheme();
  const { entry } = useLocalSearchParams<{ entry: string }>();
  const reflections = useStoredJson<ReflectionEntry[]>(STORAGE_KEYS.userReflections, []);
  const selected = reflections.find((item) => item.id === entry) ?? reflections[0];

  if (!selected) {
    return null;
  }

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <TopBar title={selected.date} left={<IconButton icon="arrow-back" href="/journal-history" />} />
      <Tag label={PILLARS[selected.pillar].english} />

      <Card outlined>
        <Text style={[styles.label, { color: theme.colors.muted }]}>Prompt</Text>
        <Text style={[styles.prompt, { color: theme.colors.accent }]}>{selected.promptText}</Text>
      </Card>

      <Card>
        <Text style={[styles.label, { color: theme.colors.muted }]}>Your reflection</Text>
        <BodyText>{selected.answer}</BodyText>
      </Card>

      <Card dark>
        <Text style={[styles.label, { color: theme.colors.muted }]}>Mood</Text>
        <Text style={styles.mood}>{selected.mood}</Text>
      </Card>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 18 },
  label: { fontSize: 11, lineHeight: 14, fontFamily: 'DMSans_700Bold', textTransform: 'uppercase', letterSpacing: 1.6 },
  prompt: { fontSize: 28, lineHeight: 34, fontFamily: 'CormorantGaramond_700Bold' },
  mood: { fontSize: 28, lineHeight: 32 },
});
