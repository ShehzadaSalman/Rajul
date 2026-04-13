export const rajulColors = {
  background: '#111009',
  backgroundSoft: '#17140f',
  surface: '#1c1810',
  surfaceRaised: '#241d13',
  surfaceMuted: '#2d2418',
  border: 'rgba(201, 168, 76, 0.18)',
  borderStrong: 'rgba(201, 168, 76, 0.42)',
  text: '#faf8f4',
  textMuted: '#c8bcad',
  textSoft: '#8a7b69',
  accent: '#c9a84c',
  accentSoft: '#e8d5a3',
  overlay: 'rgba(255, 255, 255, 0.04)',
  success: '#7fa382',
  warning: '#d39a5d',
  danger: '#de7b77',
  quwwah: '#8b2635',
  quwwahSoft: '#e8a0aa',
  amanah: '#1a3a5c',
  amanahSoft: '#a0bce8',
  sabr: '#2d5a3d',
  sabrSoft: '#a0c8ae',
  muruah: '#5c3d1a',
  muruahSoft: '#e8c8a0',
} as const;

export const pillarSlugs = ['quwwah', 'amanah', 'sabr', 'muruah'] as const;

export type FocusPillar = (typeof pillarSlugs)[number];
export type ReminderSlot = 'fajr' | 'asr' | 'isha';

export type Pillar = {
  slug: FocusPillar;
  arabic: string;
  english: string;
  subtitle: string;
  progress: number;
  complete: number;
  lessons: number;
  topics: string[];
};

export const reminderOptions: {
  value: ReminderSlot;
  label: string;
  description: string;
}[] = [
  {
    value: 'fajr',
    label: 'Fajr',
    description: 'Receive the lesson before dawn prayer.',
  },
  {
    value: 'asr',
    label: 'Asr',
    description: 'Midday catch-up if mornings are missed.',
  },
  {
    value: 'isha',
    label: 'Isha',
    description: 'Evening reminder before reflection.',
  },
];

export const pillars: Pillar[] = [
  {
    slug: 'quwwah',
    arabic: 'قوة',
    english: 'Strength',
    subtitle: 'Discipline, restraint, and rising early.',
    progress: 0.65,
    complete: 9,
    lessons: 14,
    topics: ['Early rising', 'Fasting', 'Anger'],
  },
  {
    slug: 'amanah',
    arabic: 'أمانة',
    english: 'Responsibility',
    subtitle: 'Keeping trust, leading yourself, and carrying duty.',
    progress: 0.35,
    complete: 5,
    lessons: 14,
    topics: ['Promises', 'Family', 'Work ethic'],
  },
  {
    slug: 'sabr',
    arabic: 'صبر',
    english: 'Endurance',
    subtitle: 'Patience with hardship, ego, and delay.',
    progress: 0.78,
    complete: 11,
    lessons: 14,
    topics: ['Delay', 'Loss', 'Consistency'],
  },
  {
    slug: 'muruah',
    arabic: 'مروءة',
    english: 'Nobility',
    subtitle: 'Honor, dignity, and serving others well.',
    progress: 0.55,
    complete: 8,
    lessons: 14,
    topics: ['Speech', 'Generosity', 'Presence'],
  },
];

export const pillarThemes = {
  quwwah: {
    tint: rajulColors.quwwah,
    soft: rajulColors.quwwahSoft,
    wash: 'rgba(139, 38, 53, 0.22)',
    border: 'rgba(139, 38, 53, 0.45)',
  },
  amanah: {
    tint: rajulColors.amanah,
    soft: rajulColors.amanahSoft,
    wash: 'rgba(26, 58, 92, 0.22)',
    border: 'rgba(26, 58, 92, 0.48)',
  },
  sabr: {
    tint: rajulColors.sabr,
    soft: rajulColors.sabrSoft,
    wash: 'rgba(45, 90, 61, 0.22)',
    border: 'rgba(45, 90, 61, 0.48)',
  },
  muruah: {
    tint: rajulColors.muruah,
    soft: rajulColors.muruahSoft,
    wash: 'rgba(92, 61, 26, 0.22)',
    border: 'rgba(92, 61, 26, 0.48)',
  },
} as const;

export const streakDays = [
  { label: 'M', done: true },
  { label: 'T', done: true },
  { label: 'W', done: true },
  { label: 'T', done: true },
  { label: 'F', done: true },
  { label: 'S', today: true },
  { label: 'S' },
];

export const todayLesson = {
  day: 14,
  pillar: pillars[0],
  title: 'Wake before the world does',
  subtitle: 'Build a life that can obey what is right before the day gets loud.',
  ayahArabic: 'وَالْفَجْرِ',
  ayahTranslation: '"By the dawn." — Surah Al-Fajr 89:1',
  story:
    'Allah swears by the dawn. The strongest men in our tradition were not men of impulse but men of discipline, prayer, and command over the self before sunrise.',
  body: [
    'Morning discipline is one of the clearest proofs that a man can lead himself before he tries to lead anything else.',
    'Rajul treats small acts done early as training for larger acts done under pressure. Quiet obedience compounds into visible character.',
  ],
  actionTitle: 'Set your alarm 30 minutes before Fajr. Sit in silence. No phone. Just you and Allah.',
  actionWhy:
    'A small victory over comfort resets the tone of the whole day and teaches your body that your intentions are not negotiable.',
  hadith:
    'The strong man is not the one who overcomes people by strength, but the one who controls himself while in anger.',
};

export const libraryLessons = [
  {
    id: '14',
    title: 'Wake before the world does',
    pillar: 'Quwwah',
    summary: 'Own the first hour before the day starts negotiating with you.',
    completed: true,
  },
  {
    id: '13',
    title: 'Hold your tongue when tired',
    pillar: 'Quwwah',
    summary: 'Exhaustion reveals where discipline actually lives.',
    completed: true,
  },
  {
    id: '19',
    title: 'Carry trust without display',
    pillar: 'Amanah',
    summary: 'Reliability is built in private, long before anyone praises it.',
    locked: true,
  },
  {
    id: '21',
    title: 'Stay steady when reward is late',
    pillar: 'Sabr',
    summary: 'Delayed outcomes are where sincerity gets tested.',
    locked: true,
  },
];

export const journalEntries = [
  {
    id: 'apr-06',
    title: 'Day 14 · Quwwah',
    date: 'Saturday, Apr 6',
    shortDate: 'Sat 6',
    mood: '😊',
    moodLabel: 'Good',
    prompt: 'When did I choose discomfort today because it was right?',
    answer:
      'I got out of bed before dawn without bargaining for five more minutes. The rest of the day felt cleaner because I started it with obedience instead of delay.',
  },
  {
    id: 'apr-05',
    title: 'Day 13 · Sabr',
    date: 'Friday, Apr 5',
    shortDate: 'Fri 5',
    mood: '😐',
    moodLabel: 'Okay',
    prompt: 'Where did I show patience instead of proving a point?',
    answer:
      'I left one argument unanswered and noticed that silence protected both dignity and peace.',
  },
  {
    id: 'apr-04',
    title: 'Day 12 · Amanah',
    date: 'Thursday, Apr 4',
    shortDate: 'Thu 4',
    mood: '🙂',
    moodLabel: 'Better',
    prompt: 'What responsibility did I carry fully today?',
    answer:
      'I finished a task I kept postponing and felt relief in doing what I had already promised.',
  },
];

export const monthlyHeatmap = [
  1, 1, 0.4, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0.2,
];
