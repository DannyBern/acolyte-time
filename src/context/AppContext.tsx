import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppData, Punch, Tag } from '../types';
import { loadAppData, saveAppData, calculatePunchDuration } from '../utils/storage';

interface AppContextType {
  data: AppData;
  activePunch: Punch | null;
  addPunch: (punch: Omit<Punch, 'id'>) => void;
  updatePunch: (id: string, updates: Partial<Punch>) => void;
  deletePunch: (id: string) => void;
  startPunch: (description: string, tags: string[], notes?: string, forceStart?: boolean) => void;
  stopPunch: (description?: string, tags?: string[]) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  importData: (newData: AppData) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [activePunch, setActivePunch] = useState<Punch | null>(() => {
    const active = data.punches.find(p => p.endTime === null);
    return active || null;
  });

  // Sauvegarder automatiquement
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // Vérifier les punches actifs anciens au chargement
  useEffect(() => {
    if (activePunch) {
      const duration = calculatePunchDuration(activePunch);
      const TWELVE_HOURS = 12 * 60;

      if (duration > TWELVE_HOURS) {
        const shouldAdjust = window.confirm(
          `You have an active punch that started ${Math.floor(duration / 60)} hours ago. ` +
          'Would you like to adjust the end time?'
        );

        if (shouldAdjust) {
          const endTimeStr = window.prompt(
            'Enter end time (HH:MM in 24h format):',
            new Date().toTimeString().slice(0, 5)
          );

          if (endTimeStr) {
            try {
              const [hours, minutes] = endTimeStr.split(':').map(Number);
              const endDate = new Date();
              endDate.setHours(hours, minutes, 0, 0);

              updatePunch(activePunch.id, { endTime: endDate.toISOString() });
            } catch (error) {
              console.error('Invalid time format');
            }
          }
        }
      }
    }
  }, []); // Run once on mount

  const addPunch = useCallback((punch: Omit<Punch, 'id'>) => {
    const newPunch: Punch = {
      ...punch,
      id: crypto.randomUUID(),
    };

    setData(prev => ({
      ...prev,
      punches: [...prev.punches, newPunch],
    }));

    if (newPunch.endTime === null) {
      setActivePunch(newPunch);
    }
  }, []);

  const updatePunch = useCallback((id: string, updates: Partial<Punch>) => {
    console.log('=== APP CONTEXT - updatePunch ===');
    console.log('Punch ID:', id);
    console.log('Updates:', updates);

    setData(prev => {
      const punchToUpdate = prev.punches.find(p => p.id === id);
      console.log('Punch before update:', punchToUpdate);

      const updatedPunches = prev.punches.map(p =>
        p.id === id ? { ...p, ...updates } : p
      );

      const updatedPunch = updatedPunches.find(p => p.id === id);
      console.log('Punch after update:', updatedPunch);
      console.log('Total punches:', updatedPunches.length);

      return {
        ...prev,
        punches: updatedPunches,
      };
    });

    // Update activePunch using prev callback to avoid stale closure
    setActivePunch(prev => {
      // Only update if the edited punch is the currently active one
      if (prev?.id === id) {
        console.log('Updating activePunch because it matches ID');
        // If endTime is being set to a non-null value and the punch had no endTime before (was active), clear activePunch
        if (updates.endTime !== undefined && updates.endTime !== null && prev.endTime === null) {
          console.log('Clearing activePunch (punch ended)');
          return null;
        }
        // Otherwise update activePunch with the changes
        console.log('Updating activePunch with new data');
        return { ...prev, ...updates };
      }
      return prev;
    });
  }, []);

  const deletePunch = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this punch?')) {
      setData(prev => ({
        ...prev,
        punches: prev.punches.filter(p => p.id !== id),
      }));

      if (activePunch?.id === id) {
        setActivePunch(null);
      }
    }
  }, [activePunch]);

  const startPunch = useCallback((description: string, tags: string[], notes?: string, forceStart?: boolean) => {
    // Si forceStart est false/undefined ET qu'il y a un punch actif, bloquer
    if (!forceStart && activePunch) {
      window.alert('Please stop the current punch before starting a new one.');
      return;
    }

    const newPunch: Punch = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      endTime: null,
      tags,
      description,
      notes: notes || '',
    };

    setData(prev => ({
      ...prev,
      punches: [...prev.punches, newPunch],
    }));

    setActivePunch(newPunch);
  }, [activePunch]);

  const stopPunch = useCallback((description?: string, tags?: string[]) => {
    if (!activePunch) {
      return;
    }

    const updates: Partial<Punch> = {
      endTime: new Date().toISOString(),
    };

    if (description !== undefined) {
      updates.description = description;
    }

    if (tags !== undefined) {
      updates.tags = tags;
    }

    setData(prev => ({
      ...prev,
      punches: prev.punches.map(p =>
        p.id === activePunch.id ? { ...p, ...updates } : p
      ),
    }));

    setActivePunch(null);
  }, [activePunch]);

  const addTag = useCallback((tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: crypto.randomUUID(),
    };

    setData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
  }, []);

  const updateTag = useCallback((id: string, updates: Partial<Tag>) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  }, []);

  const deleteTag = useCallback((id: string) => {
    if (window.confirm('Delete this tag? It will be removed from all punches.')) {
      setData(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t.id !== id),
        punches: prev.punches.map(p => ({
          ...p,
          tags: p.tags.filter(tid => tid !== id),
        })),
      }));
    }
  }, []);

  const importData = useCallback((newData: AppData) => {
    setData(newData);
    const active = newData.punches.find(p => p.endTime === null);
    setActivePunch(active || null);
  }, []);

  const resetData = useCallback(() => {
    if (window.confirm('Reset all data? This cannot be undone.')) {
      setData(loadAppData());
      setActivePunch(null);
    }
  }, []);

  const value: AppContextType = {
    data,
    activePunch,
    addPunch,
    updatePunch,
    deletePunch,
    startPunch,
    stopPunch,
    addTag,
    updateTag,
    deleteTag,
    importData,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
