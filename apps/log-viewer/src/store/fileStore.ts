import { create } from 'zustand';
import type { LogEntry, LogFile, PropertyValues } from '../types';

// Special properties that are always visible
const SPECIAL_PROPERTIES = new Set(['timestamp', 'level', 'name', 'tags']);

interface FileStore {
  // File and watching state
  file: LogFile | null;
  isWatching: boolean;
  logs: LogEntry[];
  
  // Property state (extracted from logs)
  properties: PropertyValues;
  specialProperties: PropertyValues;
  
  // Actions
  setFile: (file: LogFile | null) => void;
  setIsWatching: (isWatching: boolean) => void;
  addLogs: (newLogs: LogEntry[]) => void;
  clearLogs: () => void;
}

// Helper function to extract values from property (handles arrays)
const extractPropertyValues = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    // For arrays, return each element as a string
    return value.map(item => String(item));
  }
  // For non-arrays, return as single-item array
  return [String(value)];
};

export const useFileStore = create<FileStore>((set, get) => ({
  // Initial state
  file: null,
  isWatching: false,
  logs: [],
  properties: {},
  specialProperties: {},

  // Actions
  setFile: (file) => set({ file }),
  
  setIsWatching: (isWatching) => set({ isWatching }),
  
  addLogs: (newLogs) => {
    const { logs, properties, specialProperties } = get();
    const updatedProperties = { ...properties };
    const updatedSpecialProperties = { ...specialProperties };
    
    // Update properties with new log entries
    newLogs.forEach(log => {
      if (log && typeof log === 'object') {
        Object.entries(log).forEach(([key, value]) => {
          if (key !== 'message') {
            const targetProperties = SPECIAL_PROPERTIES.has(key) ? updatedSpecialProperties : updatedProperties;
            
            if (!targetProperties[key]) {
              targetProperties[key] = new Set();
            }
            
            // Extract values (handles arrays by splitting them)
            const values = extractPropertyValues(value);
            values.forEach(val => {
              targetProperties[key].add(val);
            });
          }
        });
      }
    });
    
    set({ 
      logs: [...logs, ...newLogs],
      properties: updatedProperties,
      specialProperties: updatedSpecialProperties
    });
  },
  
  clearLogs: () => set({ 
    logs: [],
    properties: {},
    specialProperties: {}
  }),
})); 