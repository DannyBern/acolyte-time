import type { Punch, Tag, TimeStats } from '../types';
import { calculatePunchDuration } from './storage';

export const calculateTimeStats = (punches: Punch[], tags: Tag[]): TimeStats => {
  const totalMinutes = punches.reduce((sum, punch) => sum + calculatePunchDuration(punch), 0);

  const tagMinutes = new Map<string, number>();

  // Calculer le temps par tag
  punches.forEach(punch => {
    const duration = calculatePunchDuration(punch);

    if (punch.tags.length === 0) {
      // Pas de tags = "Untagged"
      const current = tagMinutes.get('untagged') || 0;
      tagMinutes.set('untagged', current + duration);
    } else {
      // Répartir équitablement entre les tags
      const perTag = duration / punch.tags.length;
      punch.tags.forEach(tagId => {
        const current = tagMinutes.get(tagId) || 0;
        tagMinutes.set(tagId, current + perTag);
      });
    }
  });

  // Créer la distribution
  const tagMap = new Map(tags.map(t => [t.id, t]));

  const tagDistribution = Array.from(tagMinutes.entries())
    .map(([tagId, minutes]) => {
      const tag = tagMap.get(tagId);
      return {
        tagId,
        tagName: tag?.name || 'Untagged',
        tagColor: tag?.color || '#6b7280',
        minutes: Math.round(minutes),
        percentage: totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0,
      };
    })
    .filter(item => item.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  return {
    totalMinutes: Math.round(totalMinutes),
    tagDistribution,
  };
};

export const groupPunchesByDate = (punches: Punch[]): Map<string, Punch[]> => {
  const grouped = new Map<string, Punch[]>();

  punches.forEach(punch => {
    const date = new Date(punch.startTime).toLocaleDateString('en-CA'); // YYYY-MM-DD
    const existing = grouped.get(date) || [];
    grouped.set(date, [...existing, punch]);
  });

  return grouped;
};

export const getHourlyDistribution = (punches: Punch[]): number[] => {
  const hours = new Array(24).fill(0);

  punches.forEach(punch => {
    const start = new Date(punch.startTime);
    const end = punch.endTime ? new Date(punch.endTime) : new Date();

    let currentHour = start.getHours();
    let currentTime = start.getTime();
    const endTime = end.getTime();

    while (currentTime < endTime && currentHour < 24) {
      const nextHour = new Date(start);
      nextHour.setHours(currentHour + 1, 0, 0, 0);
      const nextHourTime = nextHour.getTime();

      const segmentEnd = Math.min(nextHourTime, endTime);
      const minutes = (segmentEnd - currentTime) / 1000 / 60;

      hours[currentHour] += minutes;

      currentTime = segmentEnd;
      currentHour++;
    }
  });

  return hours;
};

export const getDailyTotals = (punches: Punch[], startDate: Date, days: number): number[] => {
  const totals = new Array(days).fill(0);

  punches.forEach(punch => {
    const punchDate = new Date(punch.startTime);
    const daysDiff = Math.floor((punchDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 0 && daysDiff < days) {
      totals[daysDiff] += calculatePunchDuration(punch);
    }
  });

  return totals;
};

export const getWeeklyTotals = (punches: Punch[], startDate: Date, weeks: number): number[] => {
  const totals = new Array(weeks).fill(0);

  punches.forEach(punch => {
    const punchDate = new Date(punch.startTime);
    const weeksDiff = Math.floor((punchDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

    if (weeksDiff >= 0 && weeksDiff < weeks) {
      totals[weeksDiff] += calculatePunchDuration(punch);
    }
  });

  return totals;
};

export const getMonthlyTotals = (punches: Punch[], year: number): number[] => {
  const totals = new Array(12).fill(0);

  punches.forEach(punch => {
    const punchDate = new Date(punch.startTime);
    if (punchDate.getFullYear() === year) {
      const month = punchDate.getMonth();
      totals[month] += calculatePunchDuration(punch);
    }
  });

  return totals;
};
