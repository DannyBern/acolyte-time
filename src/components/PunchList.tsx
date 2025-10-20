import React, { useState } from 'react';
import type { Punch, Tag } from '../types';
import { formatTime, formatDate, formatDuration } from '../utils/dateUtils';
import { calculatePunchDuration } from '../utils/storage';
import { useApp } from '../context/AppContext';
import PunchEditor from './PunchEditor';

interface PunchListProps {
  punches: Punch[];
  tags: Tag[];
}

const PunchList: React.FC<PunchListProps> = ({ punches, tags }) => {
  const { deletePunch } = useApp();
  const [editingPunch, setEditingPunch] = useState<Punch | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

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

  // Sort by date descending
  const sortedPunches = [...punches].sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <>
      <div className="bg-slate-850 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-platinum-100 mb-4 uppercase tracking-wider">
          Time Entries
        </h3>

        <div className="space-y-3">
          {sortedPunches.map(punch => {
            const duration = calculatePunchDuration(punch);
            const startDate = new Date(punch.startTime);

            return (
              <div
                key={punch.id}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-platinum-400 text-sm font-medium">
                        {formatDate(startDate)}
                      </span>
                      <span className="text-platinum-500 text-sm">
                        {formatTime(punch.startTime)} -{' '}
                        {punch.endTime ? formatTime(punch.endTime) : 'Active'}
                      </span>
                    </div>

                    {/* Description */}
                    {punch.description && (
                      <div className="text-platinum-100 mb-2">
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
                    <div className="text-gold-400 font-semibold">
                      {formatDuration(duration)}
                    </div>

                    {/* Notes Button - Only show if notes exist */}
                    {punch.notes && punch.notes.trim() && (
                      <button
                        onClick={() => toggleNotes(punch.id)}
                        className="mt-2 text-sm text-platinum-400 hover:text-gold-400 transition-colors flex items-center gap-1"
                      >
                        <span>{expandedNotes.has(punch.id) ? '▼' : '▶'}</span>
                        <span>Notes</span>
                      </button>
                    )}

                    {/* Expanded Notes */}
                    {expandedNotes.has(punch.id) && punch.notes && (
                      <div className="mt-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-platinum-300 leading-relaxed whitespace-pre-wrap">
                        {punch.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPunch(punch)}
                      className="px-3 py-1 text-sm text-platinum-400 hover:text-platinum-100 hover:bg-slate-700 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePunch(punch.id)}
                      className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
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
