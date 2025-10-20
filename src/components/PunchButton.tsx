import React, { useState, useEffect, useRef } from 'react';
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
  const notesUpdateTimeoutRef = useRef<number | null>(null);
  const isUpdatingNotesRef = useRef(false);
  const punchInAudioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudioRef = useRef<HTMLAudioElement | null>(null);

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
      // Ne mettre à jour les notes que si on ne les modifie pas actuellement
      if (!isUpdatingNotesRef.current) {
        setNotes(activePunch.notes || '');
      }
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
        // Démarrer un nouveau punch avec les nouvelles valeurs (forceStart: true)
        setTimeout(() => {
          startPunch(description, selectedTags, notes, true);
        }, 100);
      }
    }
  }, [selectedTags, description]);

  // Mettre à jour les notes avec debounce pour éviter le flickering
  useEffect(() => {
    if (activePunch) {
      isUpdatingNotesRef.current = true;

      // Annuler le timeout précédent
      if (notesUpdateTimeoutRef.current) {
        clearTimeout(notesUpdateTimeoutRef.current);
      }

      // Sauvegarder après 500ms d'inactivité
      notesUpdateTimeoutRef.current = setTimeout(() => {
        if (notes !== (activePunch.notes || '')) {
          updatePunch(activePunch.id, { notes });
        }
        // Réinitialiser le flag après la mise à jour
        setTimeout(() => {
          isUpdatingNotesRef.current = false;
        }, 100);
      }, 500);
    }

    return () => {
      if (notesUpdateTimeoutRef.current) {
        clearTimeout(notesUpdateTimeoutRef.current);
      }
    };
  }, [notes]);

  const handlePunchToggle = () => {
    if (activePunch) {
      // Jouer le son de Stop (electrical cord unplug)
      if (stopAudioRef.current) {
        stopAudioRef.current.volume = 1.0; // Volume maximum pour clarté
        stopAudioRef.current.currentTime = 0; // Redémarrer depuis le début
        stopAudioRef.current.play().catch(err => {
          console.log('Stop audio bloqué:', err);
        });
      }
      stopPunch(description, selectedTags);
      setShowForm(false);
    } else {
      if (!showForm) {
        setShowForm(true);
      } else {
        // Jouer le son de Punch In (VHS tape insert)
        if (punchInAudioRef.current) {
          punchInAudioRef.current.volume = 1.0; // Volume maximum pour clarté
          punchInAudioRef.current.currentTime = 0; // Redémarrer depuis le début
          punchInAudioRef.current.play().catch(err => {
            console.log('Punch In audio bloqué:', err);
          });
        }
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
      {/* Audio elements - invisible mais prêts à jouer */}
      <audio
        ref={punchInAudioRef}
        src="/acolyte-time/punch-in.mp3"
        preload="auto"
      />
      <audio
        ref={stopAudioRef}
        src="/acolyte-time/punch-stop.mp3"
        preload="auto"
      />

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

      {/* Action Buttons - Professional Full Width Design */}
      <div className="space-y-4">
        {/* Main Punch/Stop Button - Full Width with Professional Press Animation */}
        <button
          onClick={handlePunchToggle}
          className={`
            relative w-full py-5 font-bold text-xl uppercase tracking-wide
            transition-all duration-150 ease-out
            rounded-lg
            ${activePunch
              ? 'bg-red-800/50 hover:bg-red-800/60 text-white border-2 border-red-700/70'
              : showForm
              ? 'bg-green-700/50 hover:bg-green-700/60 text-white border-2 border-green-600/70'
              : 'bg-blue-700/50 hover:bg-blue-700/60 text-white border-2 border-blue-600/70'
            }
            shadow-[0_6px_0_0_rgba(0,0,0,0.3),0_8px_20px_rgba(0,0,0,0.2)]
            hover:shadow-[0_6px_0_0_rgba(0,0,0,0.3),0_10px_25px_rgba(0,0,0,0.3)]
            active:shadow-[0_2px_0_0_rgba(0,0,0,0.3),0_3px_8px_rgba(0,0,0,0.2)]
            active:translate-y-[4px]
            active:brightness-90
            backdrop-blur-sm
          `}
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform, box-shadow',
          }}
        >
          {activePunch ? 'Stop' : showForm ? 'Punch In' : 'Start Timer'}
        </button>

        {showForm && !activePunch && (
          <button
            onClick={handleCancel}
            className="
              relative w-full py-3 font-semibold text-sm uppercase tracking-wider
              text-platinum-300 bg-slate-700/50 hover:bg-slate-600/50
              border-2 border-slate-600/50
              rounded-lg
              transition-all duration-150 ease-out
              shadow-[0_4px_0_0_rgba(0,0,0,0.2),0_6px_15px_rgba(0,0,0,0.15)]
              hover:shadow-[0_4px_0_0_rgba(0,0,0,0.2),0_8px_18px_rgba(0,0,0,0.2)]
              active:shadow-[0_1px_0_0_rgba(0,0,0,0.2),0_2px_5px_rgba(0,0,0,0.15)]
              active:translate-y-[3px]
              backdrop-blur-sm
            "
            style={{
              transform: 'translateZ(0)',
              willChange: 'transform, box-shadow',
            }}
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
