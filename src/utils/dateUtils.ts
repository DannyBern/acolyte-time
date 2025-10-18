import type { DateRange, Punch, ViewMode } from '../types';

export const getDateRange = (mode: ViewMode, referenceDate: Date): DateRange => {
  const date = new Date(referenceDate);
  date.setHours(0, 0, 0, 0);

  switch (mode) {
    case 'day': {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case 'week': {
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Lundi = début
      const start = new Date(date);
      start.setDate(date.getDate() + diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case 'month': {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }

    case 'year': {
      const start = new Date(date.getFullYear(), 0, 1);
      const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { start, end };
    }

    default:
      throw new Error(`Unknown view mode: ${mode}`);
  }
};

export const formatDateRange = (range: DateRange, mode: ViewMode): string => {
  const { start, end } = range;

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  switch (mode) {
    case 'day':
      return start.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

    case 'week': {
      const startStr = start.toLocaleDateString('en-US', formatOptions);
      const endStr = end.toLocaleDateString('en-US', formatOptions);
      return `${startStr} - ${endStr}, ${start.getFullYear()}`;
    }

    case 'month':
      return start.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

    case 'year':
      return start.getFullYear().toString();

    default:
      return '';
  }
};

export const navigateDate = (currentDate: Date, mode: ViewMode, direction: 'prev' | 'next'): Date => {
  const newDate = new Date(currentDate);
  const delta = direction === 'next' ? 1 : -1;

  switch (mode) {
    case 'day':
      newDate.setDate(newDate.getDate() + delta);
      break;

    case 'week':
      newDate.setDate(newDate.getDate() + (delta * 7));
      break;

    case 'month':
      newDate.setMonth(newDate.getMonth() + delta);
      break;

    case 'year':
      newDate.setFullYear(newDate.getFullYear() + delta);
      break;
  }

  return newDate;
};

export const filterPunchesByRange = (punches: Punch[], range: DateRange): Punch[] => {
  return punches.filter(punch => {
    const punchDate = new Date(punch.startTime);
    return punchDate >= range.start && punchDate <= range.end;
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getTimeSinceStart = (startTime: string): number => {
  const start = new Date(startTime);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
};
