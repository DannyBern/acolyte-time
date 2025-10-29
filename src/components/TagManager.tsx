import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Tag } from '../types';

// Palette de couleurs neutres et professionnelles
const PRESET_COLORS = [
  '#6B7280', // Gray 500 - Neutre
  '#94A3B8', // Slate 400 - Neutre clair
  '#475569', // Slate 600 - Neutre foncé
  '#71717A', // Zinc 500 - Neutre moderne
  '#52525B', // Zinc 600 - Charcoal
  '#3F3F46', // Zinc 700 - Anthracite
  '#78716C', // Stone 500 - Taupe
  '#57534E', // Stone 600 - Brun neutre
  '#64748B', // Slate 500 - Bleu gris
  '#334155', // Slate 700 - Bleu foncé neutre
  '#4B5563', // Gray 600 - Gris moyen
  '#374151', // Gray 700 - Gris foncé
  '#1F2937', // Gray 800 - Charcoal profond
  '#525252', // Neutral 600
  '#404040', // Neutral 700
];

// Emojis professionnels 3D de haute qualité (Microsoft Fluent style)
const PRESET_ICONS = [
  '💼', // Briefcase - Business
  '📊', // Chart - Analytics
  '🎯', // Target - Goals
  '⚡', // Lightning - Energy/Fast
  '🔔', // Bell - Notifications
  '📱', // Phone - Communication
  '💻', // Laptop - Development
  '📝', // Memo - Writing
  '🔍', // Magnifier - Research
  '⚙️', // Gear - Settings
  '📧', // Email - Messages
  '📅', // Calendar - Schedule
  '🏆', // Trophy - Achievement
  '⭐', // Star - Important
  '🎨', // Palette - Design
  '🔒', // Lock - Security
  '📈', // Growth chart - Progress
  '💡', // Bulb - Ideas
  '🚀', // Rocket - Launch
  '🎓', // Graduation - Learning
  '🏃', // Running - Fitness
  '☕', // Coffee - Break
  '🌐', // Globe - International
  '📦', // Package - Delivery
];

const TagManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data, addTag, updateTag, deleteTag } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState<Omit<Tag, 'id'>>({
    name: '',
    color: PRESET_COLORS[0],
    icon: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      // Les tags créés manuellement sont des shortcuts
      addTag({ ...newTag, isShortcut: true });
      setNewTag({ name: '', color: PRESET_COLORS[0], icon: '' });
      setIsAdding(false);
    }
  };

  const handleUpdateTag = (id: string, updates: Partial<Tag>) => {
    updateTag(id, updates);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-850 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-elegant-xl border border-slate-700/50 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-platinum-100">Manage Tags</h2>
          <button
            onClick={onClose}
            className="text-platinum-400 hover:text-platinum-100 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Existing Tags */}
          <div className="space-y-3 mb-6">
            {data.tags.map(tag => (
              <div
                key={tag.id}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                {editingId === tag.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tag.name}
                      onChange={(e) => handleUpdateTag(tag.id, { name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-platinum-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => handleUpdateTag(tag.id, { color })}
                          className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                          style={{
                            backgroundColor: color,
                            borderColor: tag.color === color ? '#fff' : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_ICONS.map(icon => (
                        <button
                          key={icon}
                          onClick={() => handleUpdateTag(tag.id, { icon })}
                          className={`px-3 py-1 rounded text-lg transition-all hover:scale-110 ${
                            tag.icon === icon ? 'bg-gold-600' : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-slate-900 rounded font-medium transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-platinum-100 font-medium">
                        {tag.icon && <span className="mr-2">{tag.icon}</span>}
                        {tag.name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(tag.id)}
                        className="px-3 py-1 text-sm text-platinum-400 hover:text-platinum-100 hover:bg-slate-700 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Tag */}
          {isAdding ? (
            <div className="bg-slate-900 rounded-lg p-4 border border-gold-500/50">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="Tag name"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-platinum-100 placeholder-platinum-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  autoFocus
                />
                <div>
                  <div className="text-sm text-platinum-400 mb-2">Color</div>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewTag({ ...newTag, color })}
                        className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: newTag.color === color ? '#fff' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-platinum-400 mb-2">Icon (optional)</div>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_ICONS.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setNewTag({ ...newTag, icon })}
                        className={`px-3 py-1 rounded text-lg transition-all hover:scale-110 ${
                          newTag.icon === icon ? 'bg-gold-600' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-slate-900 rounded font-medium transition-colors"
                  >
                    Add Tag
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewTag({ name: '', color: PRESET_COLORS[0], icon: '' });
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-platinum-300 rounded font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-gold-500 rounded-lg text-platinum-400 hover:text-gold-500 transition-colors"
            >
              + Add New Tag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagManager;
