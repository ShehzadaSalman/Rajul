import { useMemo } from 'react';

import { LESSONS, getLessonsByPillar } from '@/src/data/lessons';
import { addDays, toLocalDateKey } from '@/src/lib/date';
import { STORAGE_KEYS, useStoredJson, useStoredString } from '@/src/lib/storage';
import type { Entry, Lesson, PillarKey } from '@/src/types/app';

export function useLesson() {
  const focusPillar = useStoredString(STORAGE_KEYS.userFocusPillar) as PillarKey | '';
  const entries = useStoredJson<Entry[]>(STORAGE_KEYS.userEntries, []);

  return useMemo(() => {
    if (!focusPillar) {
      return {
        todaysLesson: null,
        isCompletedToday: false,
        currentDay: 0,
        nextLesson: null,
        completedLessonIds: [],
      } satisfies {
        todaysLesson: Lesson | null;
        isCompletedToday: boolean;
        currentDay: number;
        nextLesson: Lesson | null;
        completedLessonIds: string[];
      };
    }

    const pillarLessons = getLessonsByPillar(focusPillar);
    const completedEntries = entries.filter((entry) => entry.pillar === focusPillar && entry.completed);
    const completedLessonIds = completedEntries.map((entry) => entry.lessonId);
    const today = toLocalDateKey();
    const isCompletedToday = entries.some((entry) => entry.date === today && entry.completed);
    const currentDay = completedEntries.length;

    const lessonIndex = currentDay % pillarLessons.length;
    const todaysLesson =
      pillarLessons.find((lesson) =>
        isCompletedToday ? lesson.id === completedEntries[currentDay - 1]?.lessonId : lesson === pillarLessons[lessonIndex]
      ) ?? pillarLessons[lessonIndex] ?? null;

    const nextIndex = isCompletedToday ? currentDay % pillarLessons.length : (currentDay + 1) % pillarLessons.length;
    const nextLesson = pillarLessons[nextIndex] ?? pillarLessons[0] ?? null;

    return {
      todaysLesson,
      isCompletedToday,
      currentDay,
      nextLesson,
      completedLessonIds,
    };
  }, [entries, focusPillar]);
}

export function getLessonForDate(date: string, pillar: PillarKey, entries: Entry[]) {
  const lessonEntries = entries.filter((entry) => entry.pillar === pillar && entry.completed && entry.date <= date);
  const pillarLessons = getLessonsByPillar(pillar);
  return pillarLessons[lessonEntries.length % pillarLessons.length] ?? null;
}

export function getTomorrowLesson(focusPillar: PillarKey | null, entries: Entry[]) {
  if (!focusPillar) {
    return null;
  }

  const tomorrow = addDays(toLocalDateKey(), 1);
  return getLessonForDate(tomorrow, focusPillar, entries) ?? LESSONS.find((lesson) => lesson.pillar === focusPillar) ?? null;
}
