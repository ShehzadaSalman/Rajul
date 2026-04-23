import type { PillarMeta } from '@/src/types/app';

export const PILLARS: Record<string, PillarMeta> = {
  quwwah: {
    key: 'quwwah',
    arabic: 'قوة',
    english: 'Quwwah',
    description:
      'When the gap between who you are and who you intend to be keeps growing wider.',
    quranRef: 'Surah Al-Anfal 8:60',
    icon: 'ق',
    totalLessons: 20,
  },
  amanah: {
    key: 'amanah',
    arabic: 'أمانة',
    english: 'Amanah',
    description:
      'When life is asking more of you than you have been willing to give.',
    quranRef: 'Surah An-Nisa 4:58',
    icon: 'أ',
    totalLessons: 20,
  },
  sabr: {
    key: 'sabr',
    arabic: 'صبر',
    english: 'Sabr',
    description:
      'When the road is long, the effort feels unanswered, and endurance itself has become the test.',
    quranRef: 'Surah Al-Baqarah 2:153',
    icon: 'ص',
    totalLessons: 20,
  },
  muruwwah: {
    key: 'muruwwah',
    arabic: 'مروءة',
    english: 'Muruwwah',
    description:
      'When strength is no longer the problem, but something in how you carry yourself still needs to be earned.',
    quranRef: 'Surah Al-Qalam 68:4',
    icon: 'م',
    totalLessons: 20,
  },
};

export const PILLAR_ORDER = [
  PILLARS.quwwah,
  PILLARS.amanah,
  PILLARS.sabr,
  PILLARS.muruwwah,
];
