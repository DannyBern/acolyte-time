import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
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
      <div className="bg-slate-850 rounded-2xl p-4 border border-slate-700/50">
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'year'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm uppercase tracking-wider transition-all ${
                viewMode === mode
                  ? 'bg-gold-600 text-slate-900 shadow-elegant'
                  : 'bg-slate-700 text-platinum-400 hover:bg-slate-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-slate-850 rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate('prev')}
            className="px-4 py-2 text-platinum-300 hover:text-platinum-100 hover:bg-slate-700 rounded-lg transition-all"
          >
            ← Prev
          </button>

          <div className="text-center flex-1">
            <div className="text-lg font-semibold text-platinum-100">
              {formatDateRange(dateRange, viewMode)}
            </div>
          </div>

          <button
            onClick={() => handleNavigate('next')}
            className="px-4 py-2 text-platinum-300 hover:text-platinum-100 hover:bg-slate-700 rounded-lg transition-all"
          >
            Next →
          </button>
        </div>

        <button
          onClick={handleToday}
          className="mt-3 w-full py-2 text-sm text-gold-400 hover:text-gold-300 hover:bg-slate-700 rounded-lg transition-all"
        >
          Today
        </button>
      </div>

      {/* Stats Summary */}
      <div className="bg-slate-850 rounded-2xl p-6 border border-slate-700/50">
        <div className="text-center mb-6">
          <div className="text-4xl font-light text-gold-400 mb-2">
            {formatDuration(stats.totalMinutes)}
          </div>
          <div className="text-sm text-platinum-400 uppercase tracking-widest">
            Total Time
          </div>
        </div>

        {/* Tag Distribution */}
        {stats.tagDistribution.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-platinum-300 uppercase tracking-wider mb-3">
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
                    <span className="text-platinum-200">{item.tagName}</span>
                  </div>
                  <span className="text-platinum-400 font-mono">
                    {formatDuration(item.minutes)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
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
          <div className="text-center text-platinum-500 py-8">
            No time entries for this period
          </div>
        )}
      </div>

      {/* Chart - Collapsible */}
      {filteredPunches.length > 0 && (
        <div className="bg-slate-850 rounded-2xl border border-slate-700/50">
          <button
            onClick={() => setIsDistributionOpen(!isDistributionOpen)}
            className="w-full flex items-center justify-between text-lg font-semibold text-platinum-100 uppercase tracking-wider hover:text-gold-400 transition-colors py-4 px-6 hover:bg-slate-700/50 rounded-t-2xl"
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
