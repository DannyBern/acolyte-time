import { useMemo } from 'react';
import type { Punch, ViewMode, DateRange } from '../types';
import { getDailyTotals, getMonthlyTotals } from '../utils/analytics';
import { formatDuration } from '../utils/dateUtils';

interface TimeChartProps {
  punches: Punch[];
  viewMode: ViewMode;
  dateRange: DateRange;
}

const TimeChart: React.FC<TimeChartProps> = ({ punches, viewMode, dateRange }) => {
  const chartData = useMemo(() => {
    switch (viewMode) {
      case 'day': {
        // Hourly distribution for the day
        const hours = new Array(24).fill(0);
        punches.forEach(punch => {
          const start = new Date(punch.startTime);
          const hour = start.getHours();
          const duration = punch.endTime
            ? (new Date(punch.endTime).getTime() - start.getTime()) / 1000 / 60
            : 0;
          hours[hour] += duration;
        });

        return hours.map((minutes, hour) => ({
          label: `${hour}:00`,
          value: minutes,
        }));
      }

      case 'week': {
        const days = getDailyTotals(punches, dateRange.start, 7);
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return days.map((minutes, index) => ({
          label: dayNames[index],
          value: minutes,
        }));
      }

      case 'month': {
        const days = getDailyTotals(
          punches,
          dateRange.start,
          new Date(dateRange.end).getDate()
        );

        return days.map((minutes, index) => ({
          label: `${index + 1}`,
          value: minutes,
        }));
      }

      case 'year': {
        const months = getMonthlyTotals(punches, dateRange.start.getFullYear());
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return months.map((minutes, index) => ({
          label: monthNames[index],
          value: minutes,
        }));
      }

      default:
        return [];
    }
  }, [punches, viewMode, dateRange]);

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div>
      <div className="space-y-2">
        {chartData.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const hours = item.value / 60;

          return (
            <div key={index} className="group">
              <div className="flex items-center gap-3">
                <div className="w-12 text-xs text-platinum-500 text-right font-mono">
                  {item.label}
                </div>

                <div className="flex-1 h-8 bg-slate-700 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-500 transition-all duration-500 rounded-lg"
                    style={{ width: `${percentage}%` }}
                  />
                  {item.value > 0 && (
                    <div className="absolute inset-0 flex items-center px-3 text-xs font-medium text-white">
                      {formatDuration(item.value)}
                    </div>
                  )}
                </div>

                <div className="w-16 text-xs text-platinum-500 font-mono">
                  {hours > 0 ? `${hours.toFixed(1)}h` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {chartData.every(d => d.value === 0) && (
        <div className="text-center text-platinum-500 py-8">
          No data to display
        </div>
      )}
    </div>
  );
};

export default TimeChart;
