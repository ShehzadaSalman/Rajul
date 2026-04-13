import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';

import { BodyText, Card, HelperText, IconButton, RajulScreen, SectionTitle, Tag, TopBar } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { getReminderMeta, syncReminderState } from '@/src/lib/notifications';
import { STORAGE_KEYS, getReflections, getReminderTime, resetRajulData, setBoolean, setName, setReminderTime, setString, useStoredBoolean, useStoredString } from '@/src/lib/storage';
import type { ReminderTime } from '@/src/types/app';

const reminderOptions: ReminderTime[] = ['fajr', 'asr', 'isha'];

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, mode, setMode } = useTheme();
  const name = useStoredString(STORAGE_KEYS.userName, 'Rajul user');
  const joinedAt = useStoredString(STORAGE_KEYS.userJoinedAt, '');
  const reminder = useStoredString(STORAGE_KEYS.userReminderTime) as ReminderTime | '';
  const remindersEnabled = useStoredBoolean(STORAGE_KEYS.settingsRemindersEnabled, true);
  const storedClaudeKey = useStoredString(STORAGE_KEYS.settingsClaudeApiKey, '');
  const [draftName, setDraftName] = useState(name);
  const [claudeKey, setClaudeKey] = useState(storedClaudeKey);
  const [showKey, setShowKey] = useState(false);

  const handleReminderChange = async (value: ReminderTime) => {
    setReminderTime(value);
    await syncReminderState(value, remindersEnabled);
  };

  const exportJournal = async () => {
    const reflections = getReflections();
    const text = reflections.length
      ? reflections
          .map((reflection) => `${reflection.date}\n${reflection.promptText}\nMood: ${reflection.mood}\n${reflection.answer}`)
          .join('\n\n---\n\n')
      : 'No reflections saved yet.';

    await Share.share({ message: text });
  };

  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <TopBar title="Settings" left={<IconButton icon="arrow-back" onPress={() => router.back()} />} />

      <Card dark>
        <SectionTitle>Profile</SectionTitle>
        <TextInput
          value={draftName}
          onChangeText={setDraftName}
          onEndEditing={() => setName(draftName)}
          placeholder="Your name"
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.overlay }]}
        />
        <BodyText muted>{joinedAt ? `Joined ${new Date(joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Joined today'}</BodyText>
      </Card>

      <SectionTitle>Notifications</SectionTitle>
      <Card>
        <View style={styles.rowBetween}>
          <BodyText>Daily reminders</BodyText>
          <Pressable
            onPress={() => {
              const next = !remindersEnabled;
              setBoolean(STORAGE_KEYS.settingsRemindersEnabled, next);
              void syncReminderState((reminder || getReminderTime()) as ReminderTime | null, next);
            }}>
            <Tag label={remindersEnabled ? 'Enabled' : 'Disabled'} filled={remindersEnabled} />
          </Pressable>
        </View>
        <View style={styles.options}>
          {reminderOptions.map((option) => {
            const meta = getReminderMeta(option);
            const active = reminder === option;
            return (
              <Pressable key={option} onPress={() => void handleReminderChange(option)}>
                <Card outlined style={[styles.optionCard, active && { borderColor: theme.colors.accent }]}>
                  <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{meta.label}</Text>
                  <BodyText muted>{option === 'fajr' ? '5:00 AM' : option === 'asr' ? '4:00 PM' : '9:00 PM'}</BodyText>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <SectionTitle>Appearance</SectionTitle>
      <Card>
        <View style={styles.rowBetween}>
          <BodyText>Theme</BodyText>
          <View style={styles.tagRow}>
            <Pressable onPress={() => setMode('dark')}>
              <Tag label="Dark" filled={mode === 'dark'} />
            </Pressable>
            <Pressable onPress={() => setMode('light')}>
              <Tag label="Light" filled={mode === 'light'} />
            </Pressable>
          </View>
        </View>
      </Card>

      <SectionTitle>Claude API key</SectionTitle>
      <Card outlined>
        <View style={styles.rowBetween}>
          <BodyText muted>Optional. Stored locally only.</BodyText>
          <Pressable onPress={() => setShowKey((value) => !value)}>
            <MaterialIcons name={showKey ? 'visibility-off' : 'visibility'} size={20} color={theme.colors.text} />
          </Pressable>
        </View>
        <TextInput
          value={claudeKey}
          onChangeText={setClaudeKey}
          onEndEditing={() => {
            if (!claudeKey || claudeKey.startsWith('sk-')) {
              setString(STORAGE_KEYS.settingsClaudeApiKey, claudeKey || undefined);
            }
          }}
          secureTextEntry={!showKey}
          placeholder="sk-ant-..."
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.overlay }]}
        />
        {claudeKey && !claudeKey.startsWith('sk-') ? <HelperText error>Claude keys should begin with `sk-`.</HelperText> : null}
      </Card>

      <SectionTitle>Data</SectionTitle>
      <Card>
        <Pressable onPress={() => void exportJournal()}>
          <BodyText>Export my journal</BodyText>
        </Pressable>
      </Card>
      <Card outlined>
        <Pressable
          onPress={() =>
            Alert.alert('Reset all data', 'This will clear your lessons, reflections, bookmarks, and onboarding data.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  resetRajulData();
                  router.replace('/splash');
                },
              },
            ])
          }>
          <BodyText>Reset all data</BodyText>
        </Pressable>
      </Card>

      <BodyText muted>{`Version ${Constants.expoConfig?.version ?? '1.0.0'}`}</BodyText>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  options: {
    gap: 8,
  },
  optionCard: {
    gap: 4,
  },
  optionTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
