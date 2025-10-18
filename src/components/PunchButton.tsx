import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatDurationWithSeconds, getSecondsSinceStart } from '../utils/dateUtils';
import TagSelector from './TagSelector';

const PunchButton: React.FC = () => {
  const { activePunch, startPunch, stopPunch, data, updatePunch } = useApp();
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [initialTag, setInitialTag] = useState<string>('');
  const [initialDescription, setInitialDescription] = useState<string>('');

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
      setNotes(activePunch.notes || '');
      setElapsedSeconds(getSecondsSinceStart(activePunch.startTime));
      setInitialTag(activePunch.tags[0] || '');
      setInitialDescription(activePunch.description);
    } else {
      setDescription('');
      setSelectedTags([]);
      setNotes('');
      setElapsedSeconds(0);
      setInitialTag('');
      setInitialDescription('');
    }
  }, [activePunch]);

  // Auto-restart punch si tag ou description change
  useEffect(() => {
    if (activePunch && (selectedTags[0] !== initialTag || description !== initialDescription)) {
      // Ne déclencher que si les valeurs sont différentes ET non vides
      if ((selectedTags[0] && selectedTags[0] !== initialTag) ||
          (description && description !== initialDescription)) {
        // Stopper le punch actuel avec les anciennes valeurs
        stopPunch(initialDescription, [initialTag]);
        // Démarrer un nouveau punch avec les nouvelles valeurs
        setTimeout(() => {
          startPunch(description, selectedTags, notes);
        }, 100);
      }
    }
  }, [selectedTags, description]);

  // Mettre à jour les notes en temps réel
  useEffect(() => {
    if (activePunch && notes !== (activePunch.notes || '')) {
      updatePunch(activePunch.id, { notes });
    }
  }, [notes, activePunch]);

  const handlePunchToggle = () => {
    if (activePunch) {
      stopPunch(description, selectedTags);
      setShowForm(false);
    } else {
      if (!showForm) {
        setShowForm(true);
      } else {
        startPunch(description, selectedTags, notes);
        setShowForm(false);
      }
    }
  };

  const handleCancel = () => {
    if (!activePunch) {
      setShowForm(false);
      setDescription('');
      setSelectedTags([]);
      setNotes('');
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
              Tag
            </label>
            <TagSelector
              availableTags={data.tags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              singleSelect={true}
            />
          </div>

          {/* Notes Section - Zen Contemporary Design */}
          {activePunch && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-platinum-300 mb-3 flex items-center gap-2">
                <span className="text-base">📝</span>
                <span>Notes</span>
                <span className="text-xs text-platinum-500 font-normal ml-auto">Optional</span>
              </label>
              <div className="relative">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your thoughts, context, or reflections..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-platinum-100 placeholder-platinum-600/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/30 transition-all resize-none text-sm leading-relaxed backdrop-blur-sm"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: '1.6',
                  }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-platinum-600 pointer-events-none">
                  {notes.length} chars
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePunchToggle}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            activePunch
              ? 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-platinum-200 shadow-elegant-lg border border-slate-500/30'
              : showForm
              ? 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-900 shadow-elegant-lg'
              : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-platinum-100 shadow-elegant-lg border border-gold-500/20'
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
            activePunch ? 'bg-gold-500 animate-pulse-subtle' : 'bg-slate-600'
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
