import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Task {
  text: string;
  completed: boolean;
}

function parseTaskLines(notes: string): Task[] {
  if (!notes || !notes.trim()) return [];

  return notes.split('\n').filter(line => line.trim()).map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('[x] ')) {
      return { text: trimmed.slice(4), completed: true };
    }
    if (trimmed.startsWith('[ ] ')) {
      return { text: trimmed.slice(4), completed: false };
    }
    // Legacy notes without prefix — treat as unchecked
    return { text: trimmed, completed: false };
  });
}

function serializeTaskLines(tasks: Task[]): string {
  return tasks
    .map(t => `${t.completed ? '[x]' : '[ ]'} ${t.text}`)
    .join('\n');
}

interface TaskNotesProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskNotes: React.FC<TaskNotesProps> = ({ value, onChange }) => {
  const { theme } = useTheme();
  const [newTask, setNewTask] = useState('');
  const tasks = parseTaskLines(value);

  const toggleTask = (index: number) => {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    onChange(serializeTaskLines(updated));
  };

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    const updated = [...tasks, { text, completed: false }];
    onChange(serializeTaskLines(updated));
    setNewTask('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <div className="space-y-1">
      {/* Task list */}
      {tasks.map((task, i) => (
        <label
          key={i}
          className={`flex items-start gap-3 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
            theme === 'dark'
              ? 'hover:bg-slate-800/50'
              : theme === 'zen'
              ? 'hover:bg-[#564635]/40'
              : 'hover:bg-gray-100'
          }`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(i)}
            className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 cursor-pointer transition-colors ${
              theme === 'dark'
                ? 'border-slate-600 bg-slate-900 checked:bg-gold-600 checked:border-gold-600 accent-amber-500'
                : theme === 'zen'
                ? 'border-[#889D35]/60 bg-[#6b5545] checked:bg-[#889D35] checked:border-[#889D35] accent-[#889D35]'
                : 'border-slate-400 bg-white checked:bg-blue-500 checked:border-blue-500 accent-blue-500'
            }`}
          />
          <span
            className={`text-sm leading-relaxed transition-all ${
              task.completed
                ? theme === 'dark'
                  ? 'line-through text-platinum-600 opacity-50'
                  : theme === 'zen'
                  ? 'line-through text-[#D2C0A7]/50 opacity-50'
                  : 'line-through text-gray-400 opacity-50'
                : theme === 'dark'
                ? 'text-platinum-200'
                : theme === 'zen'
                ? 'text-[#E6DDD4]'
                : 'text-gray-800'
            }`}
          >
            {task.text}
          </span>
        </label>
      ))}

      {/* Add task input */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all ${
            theme === 'dark'
              ? 'bg-slate-900/50 border-slate-700/50 text-platinum-100 placeholder-platinum-600/50 focus:ring-gold-500/30 focus:border-gold-500/30'
              : theme === 'zen'
              ? 'bg-[#6b5545] border-[#889D35]/40 text-[#E6DDD4] placeholder-[#D2C0A7]/50 focus:ring-[#889D35]/50 focus:border-[#889D35]'
              : 'bg-white border-slate-300 text-gray-900 placeholder-gray-400 focus:ring-blue-400/30 focus:border-blue-400'
          }`}
        />
      </div>
    </div>
  );
};

export default TaskNotes;
