import type { PillarMeta } from '@/src/types/app';

export const PILLARS: Record<string, PillarMeta> = {
  quwwah: {
    key: 'quwwah',
    arabic: 'قوة',
    english: 'Quwwah',
    description:
      'Strength in Rajul is not ego, noise, or aesthetics. It is disciplined worship, physical stewardship, restraint, and the ability to command yourself before trying to command life.',
    quranRef: 'Surah Al-Anfal 8:60',
    icon: 'ق',
    totalLessons: 8,
  },
  amanah: {
    key: 'amanah',
    arabic: 'أمانة',
    english: 'Amanah',
    description:
      'Responsibility means your word can be trusted, your effort is halal, and people become safer because you are present. It trains a man to carry duty without drama and to lead by reliability before speeches.',
    quranRef: 'Surah An-Nisa 4:58',
    icon: 'أ',
    totalLessons: 8,
  },
  sabr: {
    key: 'sabr',
    arabic: 'صبر',
    english: 'Sabr',
    description:
      'Endurance is what keeps a man standing when work is uncertain, marriage feels delayed, and dua seems unanswered. It is patient obedience, not passive drifting.',
    quranRef: 'Surah Al-Baqarah 2:153',
    icon: 'ص',
    totalLessons: 8,
  },
  muruwwah: {
    key: 'muruwwah',
    arabic: 'مروءة',
    english: 'Muruwwah',
    description:
      'Nobility is the refinement of a man once strength and duty begin to settle. It is mercy with dignity, generosity without showing off, and character that survives private moments.',
    quranRef: 'Surah Al-Qalam 68:4',
    icon: 'م',
    totalLessons: 8,
  },
};

export const PILLAR_ORDER = [
  PILLARS.quwwah,
  PILLARS.amanah,
  PILLARS.sabr,
  PILLARS.muruwwah,
];
