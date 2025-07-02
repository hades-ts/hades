import { create } from 'zustand';
import { LogEntry, LogFile, PropertyFilters, PropertyValues } from '../types';

interface LogStore {
  // File and watching state
  file: LogFile | null;
  isWatching: boolean;
  logs: LogEntry[];
  
  // Filter state
  messageFilter: string;
  properties: PropertyValues;
  activeFilters: PropertyFilters;
  expandedProperties: Set<string>;
  selectedProperty: string | null;
  
  // Computed state
  filteredLogs: LogEntry[];
  
  // Actions
  setFile: (file: LogFile | null) => void;
  setIsWatching: (isWatching: boolean) => void;
  addLogs: (newLogs: LogEntry[]) => void;
  clearLogs: () => void;
  setMessageFilter: (filter: string) => void;
  addProperty: (property: string, value: string) => void;
  togglePropertyFilter: (property: string, value: string) => void;
  clearPropertyFilters: (property?: string) => void;
  setExpandedProperties: (properties: Set<string>) => void;
  setSelectedProperty: (property: string | null) => void;
  resetFilters: () => void;
  updateFilteredLogs: () => void;
}

export const useLogStore = create<LogStore>((set, get) => ({
  // Initial state
  file: null,
  isWatching: false,
  logs: [],
  messageFilter: '',
  properties: {},
  activeFilters: {},
  expandedProperties: new Set(),
  selectedProperty: null,
  filteredLogs: [],

  // Actions
  setFile: (file) => set({ file }),
  
  setIsWatching: (isWatching) => set({ isWatching }),
  
  addLogs: (newLogs) => {
    const { logs, properties } = get();
    const updatedProperties = { ...properties };
    
    // Update properties with new log entries
    newLogs.forEach(log => {
      if (log && typeof log === 'object') {
        Object.entries(log).forEach(([key, value]) => {
          if (key !== 'message') {
            if (!updatedProperties[key]) {
              updatedProperties[key] = new Set();
            }
            updatedProperties[key].add(String(value));
          }
        });
      }
    });
    
    set({ 
      logs: [...logs, ...newLogs],
      properties: updatedProperties
    });
    
    // Update filtered logs
    get().updateFilteredLogs();
  },
  
  clearLogs: () => set({ 
    logs: [],
    properties: {},
    activeFilters: {},
    filteredLogs: []
  }),
  
  setMessageFilter: (messageFilter) => {
    set({ messageFilter });
    get().updateFilteredLogs();
  },
  
  addProperty: (property, value) => {
    const { properties } = get();
    const updatedProperties = { ...properties };
    
    if (!updatedProperties[property]) {
      updatedProperties[property] = new Set();
    }
    updatedProperties[property].add(value);
    
    set({ properties: updatedProperties });
  },
  
  togglePropertyFilter: (property, value) => {
    const { activeFilters } = get();
    const updatedFilters = { ...activeFilters };
    
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
    
    set({ activeFilters: updatedFilters });
    get().updateFilteredLogs();
  },
  
  clearPropertyFilters: (property) => {
    const { activeFilters } = get();
    const updatedFilters = { ...activeFilters };
    
    if (property) {
      delete updatedFilters[property];
    } else {
      // Clear all filters
      Object.keys(updatedFilters).forEach(key => {
        delete updatedFilters[key];
      });
    }
    
    set({ activeFilters: updatedFilters });
    get().updateFilteredLogs();
  },
  
  setExpandedProperties: (expandedProperties) => set({ expandedProperties }),
  
  setSelectedProperty: (selectedProperty) => set({ selectedProperty }),
  
  resetFilters: () => {
    set({
      messageFilter: '',
      properties: {},
      activeFilters: {},
      expandedProperties: new Set(),
      selectedProperty: null,
      filteredLogs: []
    });
  },
  
  updateFilteredLogs: () => {
    const { logs, messageFilter, activeFilters } = get();
    let filtered = logs;
    
    // Message filter
    if (messageFilter.trim()) {
      filtered = filtered.filter(log =>
        log.message && log.message.toLowerCase().includes(messageFilter.toLowerCase())
      );
    }
    
    // Property filters
    Object.entries(activeFilters).forEach(([property, values]) => {
      if (values.size > 0) {
        filtered = filtered.filter(log =>
          log[property] && values.has(String(log[property]))
        );
      }
    });
    
    set({ filteredLogs: filtered });
  }
})); 