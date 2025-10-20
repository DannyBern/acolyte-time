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
          ? 'bg-slate-850 border-slate-700/50'
          : 'bg-slate-50/60 backdrop-blur-sm border-slate-200/80'
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
                    : 'bg-blue-500 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-slate-700 text-platinum-400 hover:bg-slate-600'
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
          ? 'bg-slate-850 border-slate-700/50'
          : 'bg-slate-50/60 backdrop-blur-sm border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate('prev')}
            className={`px-4 py-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'text-platinum-300 hover:text-platinum-100 hover:bg-slate-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            ← Prev
          </button>

          <div className="text-center flex-1">
            <div className={`text-lg font-semibold transition-colors ${
              theme === 'dark' ? 'text-platinum-100' : 'text-gray-900'
            }`}>
              {formatDateRange(dateRange, viewMode)}
            </div>
          </div>

          <button
            onClick={() => handleNavigate('next')}
            className={`px-4 py-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'text-platinum-300 hover:text-platinum-100 hover:bg-slate-700'
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
              : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
          }`}
        >
          Today
        </button>
      </div>

      {/* Stats Summary */}
      <div className={`rounded-2xl p-6 border transition-colors ${
        theme === 'dark'
          ? 'bg-slate-850 border-slate-700/50'
          : 'bg-slate-50/60 backdrop-blur-sm border-slate-200/80'
      }`}>
        <div className="text-center mb-6">
          <div className={`text-4xl font-light mb-2 transition-colors ${
            theme === 'dark' ? 'text-gold-400' : 'text-amber-600'
          }`}>
            {formatDuration(stats.totalMinutes)}
          </div>
          <div className={`text-sm uppercase tracking-widest transition-colors ${
            theme === 'dark' ? 'text-platinum-400' : 'text-gray-600'
          }`}>
            Total Time
          </div>
        </div>

        {/* Tag Distribution */}
        {stats.tagDistribution.length > 0 && (
          <div className="space-y-3">
            <div className={`text-sm font-medium uppercase tracking-wider mb-3 transition-colors ${
              theme === 'dark' ? 'text-platinum-300' : 'text-gray-700'
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
                      theme === 'dark' ? 'text-platinum-200' : 'text-gray-800'
                    }`}>{item.tagName}</span>
                  </div>
                  <span className={`font-mono transition-colors ${
                    theme === 'dark' ? 'text-platinum-400' : 'text-gray-600'
                  }`}>
                    {formatDuration(item.minutes)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden transition-colors ${
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
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
            theme === 'dark' ? 'text-platinum-500' : 'text-gray-500'
          }`}>
            No time entries for this period
          </div>
        )}
      </div>

      {/* Chart - Collapsible */}
      {filteredPunches.length > 0 && (
        <div className={`rounded-2xl border transition-colors ${
          theme === 'dark'
            ? 'bg-slate-850 border-slate-700/50'
            : 'bg-slate-50/60 backdrop-blur-sm border-slate-200/80'
        }`}>
          <button
            onClick={() => setIsDistributionOpen(!isDistributionOpen)}
            className={`w-full flex items-center justify-between text-lg font-semibold uppercase tracking-wider transition-colors py-4 px-6 rounded-t-2xl ${
              theme === 'dark'
                ? 'text-platinum-100 hover:text-gold-400 hover:bg-slate-700/50'
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
