import React, { useState } from 'react';
import type { Punch, Tag } from '../types';
import { useApp } from '../context/AppContext';
import TagSelector from './TagSelector';

interface PunchEditorProps {
  punch: Punch;
  tags: Tag[];
  onClose: () => void;
}

const PunchEditor: React.FC<PunchEditorProps> = ({ punch, tags, onClose }) => {
  const { updatePunch } = useApp();

  const startDate = new Date(punch.startTime);
  const endDate = punch.endTime ? new Date(punch.endTime) : new Date();

  const [description, setDescription] = useState(punch.description);
  const [selectedTags, setSelectedTags] = useState(punch.tags);
  const [notes, setNotes] = useState(punch.notes || '');
  const [keepActive, setKeepActive] = useState(punch.endTime === null); // Si le punch est actif, garder actif par défaut
  const [startDateStr, setStartDateStr] = useState(
    startDate.toISOString().split('T')[0]
  );
  const [startTimeStr, setStartTimeStr] = useState(
    startDate.toTimeString().slice(0, 5)
  );
  const [endDateStr, setEndDateStr] = useState(
    endDate.toISOString().split('T')[0]
  );
  const [endTimeStr, setEndTimeStr] = useState(
    endDate.toTimeString().slice(0, 5)
  );

  const handleSave = () => {
    try {
      console.log('=== PUNCH EDITOR - SAVING ===');
      console.log('Original punch:', punch);
      console.log('keepActive:', keepActive);

      const [startHours, startMinutes] = startTimeStr.split(':').map(Number);

      // Parse date strings correctly to avoid timezone issues
      const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
      const newStartDate = new Date(startYear, startMonth - 1, startDay, startHours, startMinutes, 0, 0);

      console.log('New start date:', newStartDate.toISOString());

      let newEndTime: string | null = null;

      // Si on ne garde pas actif, calculer l'heure de fin
      if (!keepActive) {
        const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
        const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
        const newEndDate = new Date(endYear, endMonth - 1, endDay, endHours, endMinutes, 0, 0);

        if (newEndDate <= newStartDate) {
          alert('End time must be after start time');
          return;
        }

        newEndTime = newEndDate.toISOString();
        console.log('New end date:', newEndTime);
      } else {
        console.log('Keeping punch active (endTime: null)');
      }

      const updates = {
        startTime: newStartDate.toISOString(),
        endTime: newEndTime,
        description,
        tags: selectedTags,
        notes,
      };

      console.log('Updates to send:', updates);

      updatePunch(punch.id, updates);

      console.log('updatePunch called, closing editor');
      onClose();
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert('Invalid date/time format');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-850 rounded-2xl max-w-lg w-full shadow-elegant-xl border border-slate-700/50 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-platinum-100">Edit Punch</h2>
          <button
            onClick={onClose}
            className="text-platinum-400 hover:text-platinum-100 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-platinum-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-platinum-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          {/* Start Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-platinum-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-platinum-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-platinum-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTimeStr}
                onChange={(e) => setStartTimeStr(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-platinum-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
            </div>
          </div>

          {/* Keep Active Checkbox - Shown only if punch was originally active */}
          {punch.endTime === null && (
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <input
                type="checkbox"
                id="keepActive"
                checked={keepActive}
                onChange={(e) => setKeepActive(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 text-gold-600 focus:ring-2 focus:ring-gold-500/50 bg-slate-800"
              />
              <label htmlFor="keepActive" className="text-sm font-medium text-platinum-300 cursor-pointer flex-1">
                ⏱ Keep punch active (don't set end time)
              </label>
            </div>
          )}

          {/* End Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-platinum-300 mb-2">
                End Date {keepActive && <span className="text-xs text-platinum-500">(disabled - punch active)</span>}
              </label>
              <input
                type="date"
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                disabled={keepActive}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-platinum-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-platinum-300 mb-2">
                End Time {keepActive && <span className="text-xs text-platinum-500">(disabled - punch active)</span>}
              </label>
              <input
                type="time"
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
                disabled={keepActive}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-platinum-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-platinum-300 mb-2">
              Tag
            </label>
            <TagSelector
              availableTags={tags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              singleSelect={true}
            />
          </div>

          {/* Notes Section - Zen Contemporary Design */}
          <div>
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
                rows={4}
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gold-600 hover:bg-gold-500 text-slate-900 rounded-lg font-semibold transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-platinum-300 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchEditor;
