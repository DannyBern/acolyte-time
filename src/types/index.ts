export interface Punch {
  id: string;
  startTime: string; // ISO 8601
  endTime: string | null; // null si punch actif
  tags: string[];
  description: string;
  notes?: string; // Notes facultatives
  duration?: number; // calculé en minutes
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface AppData {
  punches: Punch[];
  tags: Tag[];
  settings: {
    theme?: string;
    exportReminder?: boolean;
  };
}

export type ViewMode = 'day' | 'week' | 'month' | 'year';

export interface TimeStats {
  totalMinutes: number;
  tagDistribution: Array<{
    tagId: string;
    tagName: string;
    tagColor: string;
    minutes: number;
    percentage: number;
  }>;
}

export interface DateRange {
  start: Date;
  end: Date;
}
