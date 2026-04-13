import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import Reanimated, { FadeInDown } from 'react-native-reanimated';

import { BodyText, Card, IconButton, ProgressBar, RajulScreen, Tag, TopBar } from '@/components/rajul-ui';
import { useTheme } from '@/src/context/ThemeContext';
import { LESSONS, getLessonById } from '@/src/data/lessons';
import { PILLARS } from '@/src/data/pillars';
import { getEntries, getBookmarks, setBookmarks, setEntries } from '@/src/lib/storage';

export default function LessonDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const lesson = getLessonById(lessonId ?? '') ?? LESSONS[0];
  const [progress, setProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(getBookmarks().includes(lesson.id));

  const pillar = PILLARS[lesson.pillar];

  const handleBookmark = () => {
    const current = getBookmarks();
    const next = current.includes(lesson.id)
      ? current.filter((item) => item !== lesson.id)
      : [...current, lesson.id];

    setBookmarks(next);
    setBookmarked(next.includes(lesson.id));
  };

  const handleAct = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, '0')}-${`${today.getDate()}`.padStart(2, '0')}`;
    const entries = getEntries();
    if (!entries.some((entry) => entry.date === date && entry.lessonId === lesson.id)) {
      setEntries([
        ...entries,
        {
          date,
          pillar: lesson.pillar,
          lessonId: lesson.id,
          completed: true,
        },
      ]);
    }

    router.navigate('/(tabs)/reflection');
  };

  return (
    <RajulScreen scroll={false} contentContainerStyle={styles.screen}>
      <TopBar
        title={pillar.english}
        subtitle={`Day ${lesson.day}`}
        left={<IconButton icon="arrow-back" onPress={() => router.back()} />}
        right={
          <View style={styles.rightActions}>
            <IconButton icon={bookmarked ? 'bookmark' : 'bookmark-border'} onPress={handleBookmark} />
            <IconButton
              icon="share"
              onPress={() =>
                void Share.share({
                  message: `${lesson.title}\n\n${lesson.ayah.translation}\n${lesson.ayah.reference}`,
                })
              }
            />
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const totalScrollable = contentSize.height - layoutMeasurement.height;
          if (totalScrollable <= 0) {
            setProgress(1);
            return;
          }

          setProgress(Math.min(1, Math.max(0, contentOffset.y / totalScrollable)));
        }}
        scrollEventThrottle={16}>
        <Reanimated.View entering={FadeInDown.duration(260)} style={styles.content}>
          <Tag label={`${pillar.english} · ${pillar.arabic}`} />

          <View style={styles.hero}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{lesson.title}</Text>
            <BodyText muted>{lesson.subtitle}</BodyText>
          </View>

          <Card dark style={[styles.ayahPanel, { backgroundColor: 'rgba(201,168,76,0.08)' }]}>
            <Text style={[styles.ayahArabic, { color: theme.colors.accent }]}>{lesson.ayah.arabic}</Text>
            <Text style={[styles.ayahTranslation, { color: theme.colors.text }]}>{lesson.ayah.translation}</Text>
            <BodyText muted>{lesson.ayah.reference}</BodyText>
          </Card>

          <Card outlined>
            <Text style={[styles.sectionHeading, { color: theme.colors.accent }]}>Sahabah lens</Text>
            <Text style={[styles.storyCompanion, { color: theme.colors.text }]}>{lesson.sahabahStory.companion}</Text>
            <BodyText>{lesson.sahabahStory.story}</BodyText>
          </Card>

          <Card>
            <Text style={[styles.sectionHeading, { color: theme.colors.accent }]}>The lesson</Text>
            <BodyText>{lesson.body}</BodyText>
          </Card>

          <Card dark>
            <Text style={[styles.sectionHeading, { color: theme.colors.accent }]}>Today&apos;s action</Text>
            <Text style={[styles.storyCompanion, { color: theme.colors.text }]}>{lesson.action.title}</Text>
            <BodyText>{lesson.action.description}</BodyText>
            {lesson.action.hadithReference ? <BodyText muted>{lesson.action.hadithReference}</BodyText> : null}
          </Card>

          <Card outlined>
            <View style={styles.rowBetween}>
              <BodyText muted>Reading progress</BodyText>
              <BodyText muted>{`${Math.round(progress * 100)}%`}</BodyText>
            </View>
            <ProgressBar progress={progress} />
          </Card>

          <Pressable style={[styles.cta, { backgroundColor: theme.colors.accent }]} onPress={handleAct}>
            <Text style={[styles.ctaText, { color: theme.colors.background }]}>I&apos;m ready to act</Text>
          </Pressable>
        </Reanimated.View>
      </ScrollView>
    </RajulScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 14,
  },
  content: {
    gap: 16,
    paddingBottom: 24,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  hero: {
    gap: 8,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  ayahPanel: {
    gap: 8,
  },
  ayahArabic: {
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'right',
    fontFamily: 'CormorantGaramond_700Bold',
  },
  ayahTranslation: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  sectionHeading: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'DMSans_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  storyCompanion: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'CormorantGaramond_700Bold',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  cta: {
    minHeight: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'DMSans_700Bold',
  },
});
