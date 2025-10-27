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
  const tagMap = new Map(tags.map(t => [t.id, t]));

  // Sort punches by date (oldest first) for chronological report
  const sortedPunches = [...punches].sort((a, b) =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Report header section
  const reportTitle = 'ACOLYTE TIME - TIME TRACKING REPORT';
  const generatedDate = `Generated: ${new Date().toLocaleDateString('en-CA')} ${new Date().toLocaleTimeString('en-US', { hour12: false })}`;
  const totalEntries = `Total Entries: ${punches.length}`;

  // Calculate total hours
  const totalMinutes = punches.reduce((sum, punch) => sum + calculatePunchDuration(punch), 0);
  const totalHours = (totalMinutes / 60).toFixed(2);
  const totalHoursLine = `Total Hours: ${totalHours}`;

  // Empty line for spacing
  const emptyLine = '';

  // Main data headers - Professional timesheet format
  const headers = [
    'Entry ID',
    'Date',
    'Day of Week',
    'Start Time',
    'End Time',
    'Duration (Hours)',
    'Duration (Minutes)',
    'Project/Tag',
    'Tag Icon',
    'Description',
    'Notes',
    'Status'
  ];

  // Data rows
  const rows = sortedPunches.map((punch, index) => {
    const start = new Date(punch.startTime);
    const end = punch.endTime ? new Date(punch.endTime) : new Date();
    const durationMinutes = calculatePunchDuration(punch);
    const durationHours = (durationMinutes / 60).toFixed(2);

    // Format date and time for Excel/Sheets compatibility
    const date = start.toLocaleDateString('en-CA'); // YYYY-MM-DD (ISO format)
    const dayOfWeek = start.toLocaleDateString('en-US', { weekday: 'long' });
    const startTime = start.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Get tag information
    const tagInfo = punch.tags.map(tid => {
      const tag = tagMap.get(tid);
      return tag ? tag.name : 'Untagged';
    }).join(' + ') || 'Untagged';

    const tagIcons = punch.tags.map(tid => {
      const tag = tagMap.get(tid);
      return tag?.icon || '';
    }).join(' ');

    // Escape and format text fields for CSV
    const escapeCSV = (text: string) => {
      if (!text) return '';
      // Replace quotes with double quotes and wrap in quotes if contains comma/newline
      const escaped = text.replace(/"/g, '""');
      return text.includes(',') || text.includes('\n') || text.includes('"')
        ? `"${escaped}"`
        : escaped;
    };

    const description = escapeCSV(punch.description || 'No description');
    const notes = escapeCSV(punch.notes || '');
    const status = punch.endTime ? 'Completed' : 'In Progress';
    const entryId = `E${String(index + 1).padStart(4, '0')}`; // E0001, E0002, etc.

    return [
      entryId,
      date,
      dayOfWeek,
      startTime,
      endTime,
      durationHours,
      durationMinutes,
      escapeCSV(tagInfo),
      tagIcons,
      description,
      notes,
      status
    ];
  });

  // Calculate summary by tag
  const tagSummary: { [key: string]: number } = {};
  sortedPunches.forEach(punch => {
    punch.tags.forEach(tid => {
      const tag = tagMap.get(tid);
      const tagName = tag ? tag.name : 'Untagged';
      tagSummary[tagName] = (tagSummary[tagName] || 0) + calculatePunchDuration(punch);
    });
  });

  // Summary section
  const summaryTitle = 'SUMMARY BY PROJECT/TAG';
  const summaryHeaders = ['Project/Tag', 'Total Hours', 'Total Minutes', 'Percentage'];
  const summaryRows = Object.entries(tagSummary)
    .sort(([, a], [, b]) => b - a) // Sort by duration descending
    .map(([tagName, minutes]) => {
      const hours = (minutes / 60).toFixed(2);
      const percentage = ((minutes / totalMinutes) * 100).toFixed(1);
      return [tagName, hours, minutes, `${percentage}%`];
    });

  // Build CSV content with proper formatting
  const csvContent = [
    reportTitle,
    generatedDate,
    totalEntries,
    totalHoursLine,
    emptyLine,
    emptyLine,
    headers.join(','),
    ...rows.map(row => row.join(',')),
    emptyLine,
    emptyLine,
    summaryTitle,
    summaryHeaders.join(','),
    ...summaryRows.map(row => row.join(',')),
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
