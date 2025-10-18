import React from 'react';
import type { Tag } from '../types';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onTagsChange,
}) => {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
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
                : 'bg-slate-700 hover:bg-slate-600 text-platinum-300 border border-slate-600'
            }`}
            style={
              isSelected
                ? {
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
