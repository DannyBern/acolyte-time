import React from 'react';
import type { Tag } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  singleSelect?: boolean; // Mode single selection
}

const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onTagsChange,
  singleSelect = true, // Single tag par défaut
}) => {
  const { theme } = useTheme();
  const toggleTag = (tagId: string) => {
    if (singleSelect) {
      // Mode single: sélectionner uniquement ce tag
      if (selectedTags.includes(tagId)) {
        onTagsChange([]); // Désélectionner si déjà sélectionné
      } else {
        onTagsChange([tagId]); // Sélectionner uniquement celui-ci
      }
    } else {
      // Mode multiple (ancien comportement)
      if (selectedTags.includes(tagId)) {
        onTagsChange(selectedTags.filter(id => id !== tagId));
      } else {
        onTagsChange([...selectedTags, tagId]);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {availableTags.map(tag => {
        const isSelected = selectedTags.includes(tag.id);

        return (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 ${
              isSelected
                ? 'shadow-elegant'
                : theme === 'zen'
                ? 'bg-[#6b5545] hover:bg-[#7a6250] text-[#E6DDD4] border border-[#889D35]/40'
                : 'bg-slate-700 hover:bg-slate-600 text-platinum-300 border border-slate-600'
            }`}
            style={
              isSelected
                ? theme === 'zen'
                  ? {
                      backgroundColor: 'rgba(136, 157, 53, 0.3)',
                      color: '#E6DDD4',
                      border: '1px solid rgba(136, 157, 53, 0.6)',
                      boxShadow: '0 4px 6px -1px rgba(136, 157, 53, 0.4)',
                    }
                  : {
                      backgroundColor: tag.color,
                      color: '#fff',
                      boxShadow: `0 4px 6px -1px ${tag.color}40`,
                    }
                : undefined
            }
          >
            {tag.icon && <span className="mr-1">{tag.icon}</span>}
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};

export default TagSelector;
