import { useMemo } from 'react';

import { addDays, toLocalDateKey } from '@/src/lib/date';
import { STORAGE_KEYS, useStoredJson } from '@/src/lib/storage';
import type { Entry } from '@/src/types/app';

export function useStreak() {
  const entries = useStoredJson<Entry[]>(STORAGE_KEYS.userEntries, []);

  return useMemo(() => {
    const completedDates = Array.from(
      new Set(entries.filter((entry) => entry.completed).map((entry) => entry.date))
    ).sort();
    const today = toLocalDateKey();
    const isTodayComplete = completedDates.includes(today);

    let currentStreak = 0;
    let cursor = isTodayComplete ? today : addDays(today, -1);

    while (completedDates.includes(cursor)) {
      currentStreak += 1;
      cursor = addDays(cursor, -1);
    }

    let longestStreak = 0;
    let running = 0;
    let previous: string | null = null;

    completedDates.forEach((date) => {
      if (!previous) {
        running = 1;
      } else if (date === addDays(previous, 1)) {
        running += 1;
      } else {
        running = 1;
      }

      previous = date;
      longestStreak = Math.max(longestStreak, running);
    });

    return {
      currentStreak,
      longestStreak,
      totalCompleted: entries.length,
      completedDates,
      isTodayComplete,
    };
  }, [entries]);
}
