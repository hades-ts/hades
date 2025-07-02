import { create } from 'zustand';
import { LogEntry, LogFile, PropertyFilters, PropertyValues } from '../types';

// Special properties that are always visible
const SPECIAL_PROPERTIES = new Set(['timestamp', 'level', 'name', 'tags']);

interface LogStore {
  // File and watching state
  file: LogFile | null;
  isWatching: boolean;
  logs: LogEntry[];
  
  // Filter state
  messageFilter: string;
  properties: PropertyValues;
  specialProperties: PropertyValues;
  activeFilters: PropertyFilters;
  specialActiveFilters: PropertyFilters;
  selectedProperties: Set<string>; // Properties selected but no values chosen = filter by existence
  selectedProperty: string | null;
  
  // Selection state
  selectedLogEntry: LogEntry | null;
  
  // Sorting state
  sortOrder: 'newest' | 'oldest';
  
  // Computed state
  filteredLogs: LogEntry[];
  
  // Actions
  setFile: (file: LogFile | null) => void;
  setIsWatching: (isWatching: boolean) => void;
  addLogs: (newLogs: LogEntry[]) => void;
  clearLogs: () => void;
  setMessageFilter: (filter: string) => void;
  addProperty: (property: string, value: string) => void;
  togglePropertyFilter: (property: string, value: string, isSpecial?: boolean) => void;
  togglePropertySelection: (property: string) => void;
  clearPropertyFilters: (property?: string) => void;
  setSelectedProperty: (property: string | null) => void;
  setSelectedLogEntry: (logEntry: LogEntry | null) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  updateFilteredLogs: () => void;
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

export const useLogStore = create<LogStore>((set, get) => ({
  // Initial state
  file: null,
  isWatching: false,
  logs: [],
  messageFilter: '',
  properties: {},
  specialProperties: {},
  activeFilters: {},
  specialActiveFilters: {},
  selectedProperties: new Set(),
  selectedProperty: null,
  selectedLogEntry: null,
  sortOrder: 'newest',
  filteredLogs: [],

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
    
    // Update filtered logs
    get().updateFilteredLogs();
  },
  
  clearLogs: () => set({ 
    logs: [],
    properties: {},
    specialProperties: {},
    activeFilters: {},
    specialActiveFilters: {},
    filteredLogs: []
  }),
  
  setMessageFilter: (messageFilter) => {
    set({ messageFilter });
    get().updateFilteredLogs();
  },
  
  addProperty: (property, value) => {
    const { properties, specialProperties } = get();
    const isSpecial = SPECIAL_PROPERTIES.has(property);
    const targetProperties = isSpecial ? specialProperties : properties;
    const updatedProperties = { ...targetProperties };
    
    if (!updatedProperties[property]) {
      updatedProperties[property] = new Set();
    }
    updatedProperties[property].add(value);
    
    if (isSpecial) {
      set({ specialProperties: updatedProperties });
    } else {
      set({ properties: updatedProperties });
    }
  },
  
  togglePropertyFilter: (property, value, isSpecial = false) => {
    const { activeFilters, specialActiveFilters } = get();
    const targetFilters = isSpecial ? specialActiveFilters : activeFilters;
    const updatedFilters = { ...targetFilters };
    
    if (!updatedFilters[property]) {
      updatedFilters[property] = new Set();
    }
    
    if (updatedFilters[property].has(value)) {
      updatedFilters[property].delete(value);
      // Remove the property entirely if no values are selected
      if (updatedFilters[property].size === 0) {
        delete updatedFilters[property];
      }
    } else {
      updatedFilters[property].add(value);
    }
    
    if (isSpecial) {
      set({ specialActiveFilters: updatedFilters });
    } else {
      set({ activeFilters: updatedFilters });
    }
    
    get().updateFilteredLogs();
  },
  
  togglePropertySelection: (property) => {
    const { selectedProperties } = get();
    const newSelectedProperties = new Set(selectedProperties);
    
    if (newSelectedProperties.has(property)) {
      newSelectedProperties.delete(property);
    } else {
      newSelectedProperties.add(property);
    }
    
    set({ selectedProperties: newSelectedProperties });
    get().updateFilteredLogs();
  },
  
  clearPropertyFilters: (property) => {
    const { activeFilters, specialActiveFilters, selectedProperties } = get();
    
    if (property) {
      const updatedFilters = { ...activeFilters };
      const updatedSpecialFilters = { ...specialActiveFilters };
      const newSelectedProperties = new Set(selectedProperties);
      
      delete updatedFilters[property];
      delete updatedSpecialFilters[property];
      newSelectedProperties.delete(property);
      
      set({ 
        activeFilters: updatedFilters,
        specialActiveFilters: updatedSpecialFilters,
        selectedProperties: newSelectedProperties
      });
    } else {
      // Clear all filters
      set({
        activeFilters: {},
        specialActiveFilters: {},
        selectedProperties: new Set()
      });
    }
    
    get().updateFilteredLogs();
  },
  
  setSelectedProperty: (selectedProperty) => set({ selectedProperty }),
  
  setSelectedLogEntry: (logEntry) => set({ selectedLogEntry: logEntry }),
  
  toggleSortOrder: () => {
    const { sortOrder } = get();
    set({ sortOrder: sortOrder === 'newest' ? 'oldest' : 'newest' });
    get().updateFilteredLogs();
  },
  
  resetFilters: () => {
    set({
      messageFilter: '',
      activeFilters: {},
      specialActiveFilters: {},
      selectedProperties: new Set(),
      selectedProperty: null,
      selectedLogEntry: null,
    });
    // Update filtered logs to show all entries
    get().updateFilteredLogs();
  },
  
  updateFilteredLogs: () => {
    const { logs, messageFilter, activeFilters, specialActiveFilters, selectedProperties, sortOrder } = get();
    let filtered = logs;
    
    // Message filter
    if (messageFilter.trim()) {
      filtered = filtered.filter(log =>
        log.message && log.message.toLowerCase().includes(messageFilter.toLowerCase())
      );
    }
    
    // Special property filters
    Object.entries(specialActiveFilters).forEach(([property, values]) => {
      if (values.size > 0) {
        filtered = filtered.filter(log => {
          const logValue = log[property];
          if (!logValue) return false;
          
          // Handle arrays: check if any array element matches any filter value
          if (Array.isArray(logValue)) {
            return logValue.some(item => values.has(String(item)));
          }
          
          // Handle single values
          return values.has(String(logValue));
        });
      }
    });
    
    // Regular property filters
    Object.entries(activeFilters).forEach(([property, values]) => {
      if (values.size > 0) {
        filtered = filtered.filter(log => {
          const logValue = log[property];
          if (!logValue) return false;
          
          // Handle arrays: check if any array element matches any filter value
          if (Array.isArray(logValue)) {
            return logValue.some(item => values.has(String(item)));
          }
          
          // Handle single values
          return values.has(String(logValue));
        });
      }
    });
    
    // Property existence filters (selected properties with no values)
    selectedProperties.forEach(property => {
      // Only filter by existence if no specific values are selected for this property
      if (!activeFilters[property] || activeFilters[property].size === 0) {
        filtered = filtered.filter(log => log.hasOwnProperty(property));
      }
    });
    
    // Sort by timestamp
    filtered.sort((a, b) => {
      const aTime = new Date(String(a.timestamp || 0)).getTime();
      const bTime = new Date(String(b.timestamp || 0)).getTime();
      
      if (sortOrder === 'newest') {
        return bTime - aTime; // Newest first
      } else {
        return aTime - bTime; // Oldest first
      }
    });
    
    set({ filteredLogs: filtered });
  }
})); 