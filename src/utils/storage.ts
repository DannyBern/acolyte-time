import type { AppData, Punch, Tag } from '../types';

const STORAGE_KEY = 'acolyte-time-data';
const STORAGE_VERSION = '1.0.0';

const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'Development', color: '#6B7280', icon: '💻' },
  { id: '2', name: 'Meeting', color: '#475569', icon: '📱' },
  { id: '3', name: 'Design', color: '#64748B', icon: '🎨' },
  { id: '4', name: 'Research', color: '#71717A', icon: '🔍' },
  { id: '5', name: 'Documentation', color: '#52525B', icon: '📝' },
];

export const getDefaultAppData = (): AppData => ({
  punches: [],
  tags: DEFAULT_TAGS,
  settings: {
    theme: 'dark',
    exportReminder: true,
  },
});

export const loadAppData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultAppData();
    }

    const parsed = JSON.parse(stored);

    // Validation basique
    if (!parsed.punches || !Array.isArray(parsed.punches)) {
      console.warn('Invalid punches data, resetting to defaults');
      return getDefaultAppData();
    }

    if (!parsed.tags || !Array.isArray(parsed.tags) || parsed.tags.length === 0) {
      console.warn('Invalid tags data, using default tags');
      parsed.tags = DEFAULT_TAGS;
    }

    return {
      punches: parsed.punches,
      tags: parsed.tags,
      settings: parsed.settings || getDefaultAppData().settings,
    };
  } catch (error) {
    console.error('Error loading app data:', error);
    return getDefaultAppData();
  }
};

export const saveAppData = (data: AppData): void => {
  try {
    const toStore = {
      ...data,
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving app data:', error);
    throw new Error('Failed to save data. Storage might be full.');
  }
};

export const calculatePunchDuration = (punch: Punch): number => {
  const start = new Date(punch.startTime);
  const end = punch.endTime ? new Date(punch.endTime) : new Date();
  return Math.floor((end.getTime() - start.getTime()) / 1000 / 60); // minutes
};

export const exportToJSON = (data: AppData): string => {
  const exportData = {
    ...data,
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(exportData, null, 2);
};

export const exportToCSV = (punches: Punch[], tags: Tag[]): string => {
  const tagMap = new Map(tags.map(t => [t.id, t.name]));

  const headers = ['Date', 'Start Time', 'End Time', 'Duration (h)', 'Tags', 'Description'];
  const rows = punches.map(punch => {
    const start = new Date(punch.startTime);
    const end = punch.endTime ? new Date(punch.endTime) : new Date();
    const duration = calculatePunchDuration(punch) / 60;

    const date = start.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const startTime = start.toLocaleTimeString('en-US', { hour12: false });
    const endTime = end.toLocaleTimeString('en-US', { hour12: false });
    const tagNames = punch.tags.map(tid => tagMap.get(tid) || tid).join('; ');
    const desc = punch.description.replace(/"/g, '""'); // Escape quotes

    return [date, startTime, endTime, duration.toFixed(2), tagNames, `"${desc}"`];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
};

export const importFromJSON = (jsonString: string): AppData => {
  try {
    const parsed = JSON.parse(jsonString);

    // Validation stricte
    if (!parsed.punches || !Array.isArray(parsed.punches)) {
      throw new Error('Invalid JSON: missing or invalid punches array');
    }

    if (!parsed.tags || !Array.isArray(parsed.tags)) {
      throw new Error('Invalid JSON: missing or invalid tags array');
    }

    // Valider chaque punch
    for (const punch of parsed.punches) {
      if (!punch.id || !punch.startTime) {
        throw new Error('Invalid punch data: missing required fields');
      }
    }

    // Valider chaque tag
    for (const tag of parsed.tags) {
      if (!tag.id || !tag.name || !tag.color) {
        throw new Error('Invalid tag data: missing required fields');
      }
    }

    return {
      punches: parsed.punches,
      tags: parsed.tags,
      settings: parsed.settings || getDefaultAppData().settings,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Import failed: ${error.message}`);
    }
    throw new Error('Import failed: invalid JSON format');
  }
};

export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
