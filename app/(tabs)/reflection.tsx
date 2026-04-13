import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import { BodyText, Card, HelperText, MoodSelector, PrimaryButton, RajulScreen, SectionTitle } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { REFLECTION_PROMPTS } from '@/src/data/reflectionPrompts';
import { getLessonById } from '@/src/data/lessons';
import { formatLongDate, toLocalDateKey } from '@/src/lib/date';
import { STORAGE_KEYS, getEntries, getReflections, getUsedPrompts, setEntries, setJson, setReflections, setUsedPrompts, useStoredJson } from '@/src/lib/storage';
import type { Entry, ReflectionEntry } from '@/src/types/app';

type ReflectionDraft = {
  date: string;
  answer: string;
  mood: string | null;
};

const emptyDraft: ReflectionDraft = {
  date: '',
  answer: '',
  mood: null,
};

export default function ReflectionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const entries = useStoredJson<Entry[]>(STORAGE_KEYS.userEntries, []);
  const draft = useStoredJson<ReflectionDraft>(STORAGE_KEYS.reflectionDraft, emptyDraft);
  const [answer, setAnswer] = useState(draft.date === toLocalDateKey() ? draft.answer : '');
  const [mood, setMood] = useState<string | null>(draft.date === toLocalDateKey() ? draft.mood : null);
  const [saving, setSaving] = useState(false);

  const today = toLocalDateKey();
  const todaysEntry = [...entries].reverse().find((entry) => entry.date === today) ?? null;
  const todaysLesson = todaysEntry ? getLessonById(todaysEntry.lessonId) : null;
  const usedPromptIds = getUsedPrompts();

  const prompt = useMemo(() => {
    if (!todaysEntry) {
      return null;
    }

    const matches = REFLECTION_PROMPTS.filter((item) => item.pillar === todaysEntry.pillar);
    const unused = matches.filter((item) => !usedPromptIds.includes(item.id));
    return unused[0] ?? matches[0] ?? null;
  }, [todaysEntry, usedPromptIds]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setJson(STORAGE_KEYS.reflectionDraft, {
        date: today,
        answer,
        mood,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [answer, mood, today]);

  if (!todaysEntry || !todaysLesson || !prompt) {
    return (
      <RajulScreen contentContainerStyle={styles.content}>
        <Card outlined>
          <SectionTitle>No reflection yet</SectionTitle>
          <BodyText muted>Complete today&apos;s lesson first, then come back here to write honestly about what Allah showed you today.</BodyText>
        </Card>
      </RajulScreen>
    );
  }

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  const handleSave = () => {
    if (!answer.trim() || !mood) {
      return;
    }

    setSaving(true);
    const savedAt = new Date().toISOString();
    const reflections = getReflections();
    const nextReflection: ReflectionEntry = {
      id: `${today}-${todaysLesson.id}`,
      date: today,
      lessonId: todaysLesson.id,
      pillar: todaysEntry.pillar,
      promptId: prompt.id,
      promptText: prompt.prompt,
      answer: answer.trim(),
      mood,
      wordCount,
      savedAt,
    };

    const deduped = reflections.filter((reflection) => reflection.id !== nextReflection.id);
    setReflections([nextReflection, ...deduped]);
    setUsedPrompts([...usedPromptIds.filter((item) => item !== prompt.id), prompt.id].slice(-7));
    setEntries(
      getEntries().map((entry) =>
        entry.date === today && entry.lessonId === todaysLesson.id
          ? { ...entry, reflectionSaved: true, mood }
          : entry
      )
    );
    setJson(STORAGE_KEYS.reflectionDraft, emptyDraft);
    setSaving(false);
    router.push('/day-complete');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <RajulScreen contentContainerStyle={styles.content}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
          <View style={styles.copy}>
            <SectionTitle>{formatLongDate(today)}</SectionTitle>
            <Text style={[styles.heading, { color: theme.colors.text }]}>Sit with the day honestly.</Text>
            <BodyText muted>{todaysLesson.title}</BodyText>
          </View>

          <Card dark>
            <SectionTitle>Tonight&apos;s question</SectionTitle>
            <Text style={[styles.prompt, { color: theme.colors.accent }]}>{prompt.prompt}</Text>
            {prompt.followUp ? <BodyText muted>{prompt.followUp}</BodyText> : null}
          </Card>

          <Card outlined>
            <TextInput
              multiline
              value={answer}
              onChangeText={setAnswer}
              placeholder="Write the truth, not the polished version."
              placeholderTextColor={theme.colors.muted}
              style={[styles.input, { color: theme.colors.text }]}
              textAlignVertical="top"
            />
          </Card>

          <View style={styles.metaRow}>
            <BodyText muted>{`${wordCount} words`}</BodyText>
            <BodyText muted>Auto-saves every 3 seconds</BodyText>
          </View>

          <Card>
            <SectionTitle>How do you feel tonight?</SectionTitle>
            <MoodSelector value={mood} onChange={setMood} />
          </Card>

          {!answer.trim() || !mood ? <HelperText error>Write a short reflection and choose a mood before saving.</HelperText> : null}

          <PrimaryButton label="Save reflection" onPress={handleSave} loading={saving} disabled={!answer.trim() || !mood} />
        </KeyboardAvoidingView>
      </RajulScreen>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  keyboard: {
    gap: 18,
  },
  copy: {
    gap: 8,
  },
  heading: {
    fontSize: 34,
    lineHeight: 38,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  prompt: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  input: {
    minHeight: 220,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'DMSans_400Regular',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
