export type PillarKey = 'quwwah' | 'amanah' | 'sabr' | 'muruwwah';

export type ReminderTime = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type Lesson = {
  id: string;
  pillar: PillarKey;
  day: number;
  title: string;
  subtitle: string;
  ayah: {
    arabic: string;
    translation: string;
    reference: string;
    sourceUrl?: string;
  };
  sahabahStory: {
    companion: string;
    story: string;
  };
  body: string;
  action: {
    title: string;
    description: string;
    hadithReference?: string;
    sourceUrl?: string;
  };
  estimatedReadMinutes: number;
};

export type PillarMeta = {
  key: PillarKey;
  arabic: string;
  english: string;
  description: string;
  quranRef: string;
  icon: string;
  totalLessons: number;
};

export type ReflectionPrompt = {
  id: string;
  pillar: PillarKey;
  prompt: string;
  followUp?: string;
};

export type SahabahStory = {
  id: string;
  companion: string;
  title: string;
  pillar: PillarKey;
  story: string;
  lesson: string;
  reference: string;
};

export type Entry = {
  date: string;
  pillar: PillarKey;
  lessonId: string;
  completed: true;
  reflectionSaved?: boolean;
  mood?: string;
};

export type ReflectionEntry = {
  id: string;
  date: string;
  lessonId: string;
  pillar: PillarKey;
  promptId: string;
  promptText: string;
  answer: string;
  mood: string;
  wordCount: number;
  savedAt: string;
};

export type RajulProfile = {
  name: string;
  focusPillar: PillarKey | null;
  reminderTime: ReminderTime | null;
  onboardingComplete: boolean;
  joinedAt: string | null;
};
