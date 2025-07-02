import { create } from 'zustand';
import type { LogEntry } from '../types';

interface UiStore {
  // Selection state
  selectedLogEntry: LogEntry | null;
  
  // Actions
  setSelectedLogEntry: (logEntry: LogEntry | null) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  // Initial state
  selectedLogEntry: null,

  // Actions
  setSelectedLogEntry: (logEntry) => set({ selectedLogEntry: logEntry }),
})); 