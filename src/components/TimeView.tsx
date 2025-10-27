import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import type { ViewMode } from '../types';
import {
  getDateRange,
  formatDateRange,
  navigateDate,
  filterPunchesByRange,
  formatDuration,
} from '../utils/dateUtils';
import { calculateTimeStats } from '../utils/analytics';
import PunchList from './PunchList';
import TimeChart from './TimeChart';

const TimeView: React.FC = () => {
  const { data } = useApp();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDistributionOpen, setIsDistributionOpen] = useState(false);

  const dateRange = useMemo(() => getDateRange(viewMode, currentDate), [viewMode, currentDate]);

  const filteredPunches = useMemo(
    () => filterPunchesByRange(data.punches, dateRange),
    [data.punches, dateRange]
  );

  const stats = useMemo(
    () => calculateTimeStats(filteredPunches, data.tags),
    [filteredPunches, data.tags]
  );

  const handleNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate(navigateDate(currentDate, viewMode, direction));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className={`rounded-2xl p-4 border transition-colors ${
        theme === 'dark'
          ? 'bg-slate-850/60 backdrop-blur-md border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.6),0_5px_15px_rgba(100,149,237,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]'
          : theme === 'zen'
          ? 'bg-[#564635]/60 backdrop-blur-md border-[#889D35]/60 shadow-[0_20px_60px_rgba(86,70,53,0.8),0_10px_30px_rgba(86,70,53,0.6),0_5px_15px_rgba(136,157,53,0.4),inset_0_1px_2px_rgba(230,221,212,0.2)]'
          : 'bg-slate-200/60 backdrop-blur-md border-slate-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.3),0_5px_15px_rgba(96,165,250,0.3),inset_0_1px_2px_rgba(255,255,255,0.2)]'
      }`}>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'year'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
                viewMode === mode
                  ? theme === 'dark'
                    ? 'bg-gold-600 text-slate-900 shadow-elegant'
                    : theme === 'zen'
                    ? 'bg-[#889D35] text-[#E6DDD4] shadow-[0_8px_0_0_rgba(0,0,0,0.5),0_12px_35px_rgba(0,0,0,0.6),0_6px_18px_rgba(136,157,53,0.4),inset_0_2px_4px_rgba(230,221,212,0.15)]'
                    : 'bg-blue-500 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-slate-700 text-platinum-400 hover:bg-slate-600'
                  : theme === 'zen'
                  ? 'bg-[#6b5545] text-[#D2C0A7] hover:bg-[#7a6250] border border-[#889D35]/30 shadow-[0_4px_0_0_rgba(0,0,0,0.4),0_8px_20px_rgba(0,0,0,0.5),0_4px_12px_rgba(136,157,53,0.3)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.4),0_10px_25px_rgba(0,0,0,0.6),0_5px_15px_rgba(136,157,53,0.35)]'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Date Navigation */}
      <div className={`rounded-2xl p-4 border transition-colors ${
        theme === 'dark'
          ? 'bg-slate-850/60 backdrop-blur-md border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.6),0_5px_15px_rgba(100,149,237,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]'
          : theme === 'zen'
          ? 'bg-[#564635]/60 backdrop-blur-md border-[#889D35]/60 shadow-[0_20px_60px_rgba(86,70,53,0.8),0_10px_30px_rgba(86,70,53,0.6),0_5px_15px_rgba(136,157,53,0.4),inset_0_1px_2px_rgba(230,221,212,0.2)]'
          : 'bg-slate-200/60 backdrop-blur-md border-slate-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.3),0_5px_15px_rgba(96,165,250,0.3),inset_0_1px_2px_rgba(255,255,255,0.2)]'
      }`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate('prev')}
            className={`px-4 py-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'text-platinum-300 hover:text-platinum-100 hover:bg-slate-700'
                : theme === 'zen'
                ? 'text-[#E6DDD4] hover:text-[#889D35] hover:bg-[#889D35]/20 shadow-[0_6px_0_0_rgba(0,0,0,0.4),0_10px_25px_rgba(0,0,0,0.5),0_6px_15px_rgba(136,157,53,0.3)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.4),0_12px_30px_rgba(0,0,0,0.6),0_8px_18px_rgba(136,157,53,0.35)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.5)]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            ← Prev
          </button>

          <div className="text-center flex-1">
            <div className={`text-lg font-semibold transition-colors ${
              theme === 'dark'
                ? 'text-platinum-100'
                : theme === 'zen'
                ? 'text-[#E6DDD4]'
                : 'text-gray-900'
            }`}>
              {formatDateRange(dateRange, viewMode)}
            </div>
          </div>

          <button
            onClick={() => handleNavigate('next')}
            className={`px-4 py-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'text-platinum-300 hover:text-platinum-100 hover:bg-slate-700'
                : theme === 'zen'
                ? 'text-[#E6DDD4] hover:text-[#889D35] hover:bg-[#889D35]/20 shadow-[0_6px_0_0_rgba(0,0,0,0.4),0_10px_25px_rgba(0,0,0,0.5),0_6px_15px_rgba(136,157,53,0.3)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.4),0_12px_30px_rgba(0,0,0,0.6),0_8px_18px_rgba(136,157,53,0.35)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.5)]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Next →
          </button>
        </div>

        <button
          onClick={handleToday}
          className={`mt-3 w-full py-2 text-sm rounded-lg transition-all ${
            theme === 'dark'
              ? 'text-gold-400 hover:text-gold-300 hover:bg-slate-700'
              : theme === 'zen'
              ? 'text-[#889D35] hover:text-[#889D35] hover:bg-[#889D35]/20 shadow-[0_6px_0_0_rgba(0,0,0,0.4),0_10px_25px_rgba(0,0,0,0.5),0_6px_15px_rgba(136,157,53,0.3)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.4),0_12px_30px_rgba(0,0,0,0.6),0_8px_18px_rgba(136,157,53,0.35)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.5)]'
              : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
          }`}
        >
          Today
        </button>
      </div>

      {/* Stats Summary */}
      <div className={`rounded-2xl p-6 border transition-colors ${
        theme === 'dark'
          ? 'bg-slate-850/60 backdrop-blur-md border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.6),0_5px_15px_rgba(100,149,237,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]'
          : theme === 'zen'
          ? 'bg-[#564635]/60 backdrop-blur-md border-[#889D35]/60 shadow-[0_20px_60px_rgba(86,70,53,0.8),0_10px_30px_rgba(86,70,53,0.6),0_5px_15px_rgba(136,157,53,0.4),inset_0_1px_2px_rgba(230,221,212,0.2)]'
          : 'bg-slate-200/60 backdrop-blur-md border-slate-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.3),0_5px_15px_rgba(96,165,250,0.3),inset_0_1px_2px_rgba(255,255,255,0.2)]'
      }`}>
        <div className="text-center mb-6">
          <div className={`text-4xl font-light mb-2 transition-colors ${
            theme === 'dark'
              ? 'text-gold-400'
              : theme === 'zen'
              ? 'text-[#889D35]'
              : 'text-amber-600'
          }`}>
            {formatDuration(stats.totalMinutes)}
          </div>
          <div className={`text-sm uppercase tracking-widest transition-colors ${
            theme === 'dark'
              ? 'text-platinum-400'
              : theme === 'zen'
              ? 'text-[#D2C0A7]'
              : 'text-gray-600'
          }`}>
            Total Time
          </div>
        </div>

        {/* Tag Distribution */}
        {stats.tagDistribution.length > 0 && (
          <div className="space-y-3">
            <div className={`text-sm font-medium uppercase tracking-wider mb-3 transition-colors ${
              theme === 'dark'
                ? 'text-platinum-300'
                : theme === 'zen'
                ? 'text-[#E6DDD4]'
                : 'text-gray-700'
            }`}>
              Time by Tag
            </div>
            {stats.tagDistribution.map(item => (
              <div key={item.tagId} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.tagColor }}
                    />
                    <span className={`transition-colors ${
                      theme === 'dark'
                        ? 'text-platinum-200'
                        : theme === 'zen'
                        ? 'text-[#E6DDD4]'
                        : 'text-gray-800'
                    }`}>{item.tagName}</span>
                  </div>
                  <span className={`font-mono transition-colors ${
                    theme === 'dark'
                      ? 'text-platinum-400'
                      : theme === 'zen'
                      ? 'text-[#D2C0A7]'
                      : 'text-gray-600'
                  }`}>
                    {formatDuration(item.minutes)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700'
                    : theme === 'zen'
                    ? 'bg-[#6b5545]'
                    : 'bg-gray-200'
                }`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: item.tagColor,
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {stats.totalMinutes === 0 && (
          <div className={`text-center py-8 transition-colors ${
            theme === 'dark'
              ? 'text-platinum-500'
              : theme === 'zen'
              ? 'text-[#D2C0A7]/70'
              : 'text-gray-500'
          }`}>
            No time entries for this period
          </div>
        )}
      </div>

      {/* Chart - Collapsible */}
      {filteredPunches.length > 0 && (
        <div className={`rounded-2xl border transition-colors ${
          theme === 'dark'
            ? 'bg-slate-850 border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
            : theme === 'zen'
            ? 'bg-[#564635]/60 backdrop-blur-md border-[#889D35]/60 shadow-[0_20px_60px_rgba(86,70,53,0.8),0_10px_30px_rgba(86,70,53,0.6),0_5px_15px_rgba(136,157,53,0.4),inset_0_1px_2px_rgba(230,221,212,0.2)]'
            : 'bg-slate-200/95 backdrop-blur-md border-slate-400 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]'
        }`}>
          <button
            onClick={() => setIsDistributionOpen(!isDistributionOpen)}
            className={`w-full flex items-center justify-between text-lg font-semibold uppercase tracking-wider transition-colors py-4 px-6 rounded-t-2xl ${
              theme === 'dark'
                ? 'text-platinum-100 hover:text-gold-400 hover:bg-slate-700/50'
                : theme === 'zen'
                ? 'text-[#E6DDD4] hover:text-[#889D35] hover:bg-[#889D35]/20'
                : 'text-gray-900 hover:text-amber-600 hover:bg-gray-50'
            }`}
          >
            <span>Time Distribution</span>
            <span className="text-xl transition-transform duration-300" style={{ transform: isDistributionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {isDistributionOpen && (
            <div className="px-6 pb-6 pt-2">
              <TimeChart
                punches={filteredPunches}
                viewMode={viewMode}
                dateRange={dateRange}
              />
            </div>
          )}
        </div>
      )}

      {/* Punch List */}
      {filteredPunches.length > 0 && (
        <PunchList punches={filteredPunches} tags={data.tags} />
      )}
    </div>
  );
};

export default TimeView;
