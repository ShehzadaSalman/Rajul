import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import {
  BodyText,
  Card,
  IconButton,
  PrimaryButton,
  RajulScreen,
  SecondaryButton,
  SectionTitle,
  TopBar,
} from '@/components/rajul-ui';
import { pillarThemes, rajulColors, todayLesson } from '@/constants/rajul';

const pillarTheme = pillarThemes[todayLesson.pillar.slug];

export default function ActionScreen() {
  return (
    <RajulScreen contentContainerStyle={styles.content}>
      <TopBar title="Today&apos;s action" left={<IconButton icon="arrow-back" href="/(tabs)" />} />

      <Card
        dark
        style={[
          styles.heroCard,
          { backgroundColor: pillarTheme.wash, borderColor: pillarTheme.border },
        ]}>
        <View style={styles.iconBubble}>
          <MaterialIcons name="wb-sunny" size={24} color={rajulColors.accentSoft} />
        </View>
        <Text style={styles.actionTitle}>{todayLesson.actionTitle}</Text>
      </Card>

      <Card>
        <SectionTitle>Why it matters</SectionTitle>
        <BodyText muted>{todayLesson.actionWhy}</BodyText>
      </Card>

      <Card outlined>
        <SectionTitle>Hadith reference</SectionTitle>
        <Text style={styles.hadith}>{todayLesson.hadith}</Text>
      </Card>

      <PrimaryButton label="I did this today" href="/day-complete" />
      <SecondaryButton label="Remind me tonight" href="/(tabs)/reflection" />
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  heroCard: {
    alignItems: 'center',
    gap: 16,
  },
  iconBubble: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: rajulColors.border,
  },
  actionTitle: {
    color: rajulColors.text,
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  hadith: {
    color: rajulColors.textMuted,
    fontSize: 16,
    lineHeight: 25,
    fontStyle: 'italic',
  },
});
