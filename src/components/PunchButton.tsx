import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatDurationWithSeconds, getSecondsSinceStart } from '../utils/dateUtils';
import TagSelector from './TagSelector';

const PunchButton: React.FC = () => {
  const { activePunch, startPunch, stopPunch, data } = useApp();
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Update elapsed time every second when active
  useEffect(() => {
    if (activePunch) {
      const interval = setInterval(() => {
        setElapsedSeconds(getSecondsSinceStart(activePunch.startTime));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activePunch]);

  useEffect(() => {
    if (activePunch) {
      setDescription(activePunch.description);
      setSelectedTags(activePunch.tags);
      setElapsedSeconds(getSecondsSinceStart(activePunch.startTime));
    } else {
      setDescription('');
      setSelectedTags([]);
      setElapsedSeconds(0);
    }
  }, [activePunch]);

  const handlePunchToggle = () => {
    if (activePunch) {
      stopPunch(description, selectedTags);
      setShowForm(false);
    } else {
      if (!showForm) {
        setShowForm(true);
      } else {
        startPunch(description, selectedTags);
        setShowForm(false);
      }
    }
  };

  const handleCancel = () => {
    if (!activePunch) {
      setShowForm(false);
      setDescription('');
      setSelectedTags([]);
    }
  };

  return (
    <div className="bg-slate-850 rounded-2xl p-6 shadow-elegant-xl border border-slate-700/50">
      {/* Timer Display */}
      {activePunch && (
        <div className="mb-6 text-center animate-fade-in">
          <div className="text-5xl font-light text-gold-400 tracking-wider mb-2">
            {formatDurationWithSeconds(elapsedSeconds)}
          </div>
          <div className="text-sm text-platinum-400 uppercase tracking-widest">
            Time Elapsed
          </div>
        </div>
      )}

      {/* Form Fields */}
      {(showForm || activePunch) && (
        <div className="space-y-4 mb-6 animate-slide-down">
          <div>
            <label className="block text-sm font-medium text-platinum-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-platinum-100 placeholder-platinum-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-platinum-300 mb-2">
              Tags
            </label>
            <TagSelector
              availableTags={data.tags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePunchToggle}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            activePunch
              ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-elegant-lg'
              : showForm
              ? 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-900 shadow-elegant-lg'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-elegant-lg'
          }`}
        >
          {activePunch ? '⏹ Stop' : showForm ? '▶ Start' : '▶ Punch In'}
        </button>

        {showForm && !activePunch && (
          <button
            onClick={handleCancel}
            className="px-6 py-4 rounded-xl font-semibold text-platinum-300 bg-slate-700 hover:bg-slate-600 transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <div
          className={`w-2 h-2 rounded-full ${
            activePunch ? 'bg-emerald-500 animate-pulse-subtle' : 'bg-slate-600'
          }`}
        />
        <span className="text-platinum-500">
          {activePunch ? 'Active' : 'Idle'}
        </span>
      </div>
    </div>
  );
};

export default PunchButton;
