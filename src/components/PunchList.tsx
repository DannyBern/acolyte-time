import React, { useState } from 'react';
import type { Punch, Tag } from '../types';
import { formatTime, formatDate, formatDuration } from '../utils/dateUtils';
import { calculatePunchDuration } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import PunchEditor from './PunchEditor';

interface PunchListProps {
  punches: Punch[];
  tags: Tag[];
}

const PunchList: React.FC<PunchListProps> = ({ punches, tags }) => {
  const { deletePunch } = useApp();
  const { theme } = useTheme();
  const [editingPunch, setEditingPunch] = useState<Punch | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const deleteAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const tagMap = new Map(tags.map(t => [t.id, t]));

  const toggleNotes = (punchId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(punchId)) {
        newSet.delete(punchId);
      } else {
        newSet.add(punchId);
      }
      return newSet;
    });
  };

  const handleDelete = (punchId: string) => {
    // Jouer le son de poubelle
    if (deleteAudioRef.current) {
      deleteAudioRef.current.volume = 1.0;
      deleteAudioRef.current.currentTime = 0;
      deleteAudioRef.current.play().catch(err => {
        console.log('Delete audio bloqué:', err);
      });
    }
    // Supprimer le punch
    deletePunch(punchId);
  };

  // Sort by date descending
  const sortedPunches = [...punches].sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <>
      {/* Audio element for delete sound */}
      <audio
        ref={deleteAudioRef}
        src="/acolyte-time/delete-sound.mp3"
        preload="auto"
      />

      <div className={`rounded-2xl p-6 border transition-colors ${
        theme === 'dark'
          ? 'bg-slate-850 border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
          : 'bg-slate-100/90 backdrop-blur-md border-slate-300 shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)]'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 uppercase tracking-wider transition-colors ${
          theme === 'dark' ? 'text-platinum-100' : 'text-gray-900'
        }`}>
          Time Entries
        </h3>

        <div className="space-y-3">
          {sortedPunches.map(punch => {
            const duration = calculatePunchDuration(punch);
            const startDate = new Date(punch.startTime);

            return (
              <div
                key={punch.id}
                className={`rounded-lg p-4 border transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700/50 hover:border-slate-600 shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                    : 'bg-white backdrop-blur-sm border-slate-200 hover:border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-medium transition-colors ${
                        theme === 'dark' ? 'text-platinum-400' : 'text-gray-700'
                      }`}>
                        {formatDate(startDate)}
                      </span>
                      <span className={`text-sm transition-colors ${
                        theme === 'dark' ? 'text-platinum-500' : 'text-gray-600'
                      }`}>
                        {formatTime(punch.startTime)} -{' '}
                        {punch.endTime ? formatTime(punch.endTime) : 'Active'}
                      </span>
                    </div>

                    {/* Description */}
                    {punch.description && (
                      <div className={`mb-2 transition-colors ${
                        theme === 'dark' ? 'text-platinum-100' : 'text-gray-900'
                      }`}>
                        {punch.description}
                      </div>
                    )}

                    {/* Tags */}
                    {punch.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {punch.tags.map(tagId => {
                          const tag = tagMap.get(tagId);
                          if (!tag) return null;

                          return (
                            <span
                              key={tagId}
                              className="px-2 py-1 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.icon && <span className="mr-1">{tag.icon}</span>}
                              {tag.name}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Duration */}
                    <div className={`font-semibold transition-colors ${
                      theme === 'dark' ? 'text-gold-400' : 'text-amber-600'
                    }`}>
                      {formatDuration(duration)}
                    </div>

                    {/* Notes Button - Only show if notes exist */}
                    {punch.notes && punch.notes.trim() && (
                      <button
                        onClick={() => toggleNotes(punch.id)}
                        className={`mt-2 text-sm transition-colors flex items-center gap-1 ${
                          theme === 'dark'
                            ? 'text-platinum-400 hover:text-gold-400'
                            : 'text-gray-600 hover:text-amber-600'
                        }`}
                      >
                        <span>{expandedNotes.has(punch.id) ? '▼' : '▶'}</span>
                        <span>Notes</span>
                      </button>
                    )}

                    {/* Expanded Notes */}
                    {expandedNotes.has(punch.id) && punch.notes && (
                      <div className={`mt-3 p-3 border rounded-lg text-sm leading-relaxed whitespace-pre-wrap transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-800/50 border-slate-700/50 text-platinum-300'
                          : 'bg-white border-gray-300 text-gray-700'
                      }`}>
                        {punch.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPunch(punch)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        theme === 'dark'
                          ? 'text-platinum-400 hover:text-platinum-100 hover:bg-slate-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(punch.id)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        theme === 'dark'
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingPunch && (
        <PunchEditor
          punch={editingPunch}
          tags={tags}
          onClose={() => setEditingPunch(null)}
        />
      )}
    </>
  );
};

export default PunchList;
