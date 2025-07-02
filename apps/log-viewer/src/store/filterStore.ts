import { create } from 'zustand';
import { LogEntry, PropertyFilters } from '../types';
import { useFileStore } from './fileStore';

interface FilterStore {
  // Filter state
  messageFilter: string;
  activeFilters: PropertyFilters;
  specialActiveFilters: PropertyFilters;
  selectedProperties: Set<string>; // Properties selected but no values chosen = filter by existence
  selectedProperty: string | null;
  filterMode: 'filter' | 'tint';
  
  // Sorting state
  sortOrder: 'newest' | 'oldest';
  
  // Computed state
  filteredLogs: LogEntry[];
  
  // Actions
  setMessageFilter: (filter: string) => void;
  togglePropertyFilter: (property: string, value: string, isSpecial?: boolean) => void;
  togglePropertySelection: (property: string) => void;
  clearPropertyFilters: (property?: string) => void;
  setSelectedProperty: (property: string | null) => void;
  toggleFilterMode: () => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  updateFilteredLogs: () => void;
  isLogMatchingFilters: (log: LogEntry) => boolean;
  hasActiveFilters: () => boolean;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
    // Initial state
    messageFilter: '',
    activeFilters: {},
    specialActiveFilters: {},
    selectedProperties: new Set(),
    selectedProperty: null,
    filterMode: 'filter',
    sortOrder: 'newest',
    filteredLogs: [],

    // Actions
    setMessageFilter: (messageFilter) => {
      set({ messageFilter });
      get().updateFilteredLogs();
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
    
    toggleFilterMode: () => {
      const { filterMode } = get();
      set({ filterMode: filterMode === 'filter' ? 'tint' : 'filter' });
      get().updateFilteredLogs();
    },
    
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
      });
      // Update filtered logs to show all entries
      get().updateFilteredLogs();
    },
    
    updateFilteredLogs: () => {
      const { messageFilter, activeFilters, specialActiveFilters, selectedProperties, sortOrder, filterMode } = get();
      const logs = useFileStore.getState().logs;
      let filtered = logs;
      
      // Only apply filters in filter mode, not in tint mode
      if (filterMode === 'filter') {
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
      }
      
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
    },
    
    isLogMatchingFilters: (log) => {
      const { messageFilter, activeFilters, specialActiveFilters, selectedProperties } = get();
      
      // Check message filter
      if (messageFilter.trim() && (!log.message || !log.message.toLowerCase().includes(messageFilter.toLowerCase()))) {
        return false;
      }
      
      // Check special property filters
      for (const [property, values] of Object.entries(specialActiveFilters)) {
        if (values.size > 0) {
          const logValue = log[property];
          if (logValue) {
            if (Array.isArray(logValue)) {
              if (!logValue.some(item => values.has(String(item)))) {
                return false;
              }
            } else {
              if (!values.has(String(logValue))) {
                return false;
              }
            }
          }
        }
      }
      
      // Check regular property filters
      for (const [property, values] of Object.entries(activeFilters)) {
        if (values.size > 0) {
          const logValue = log[property];
          if (logValue) {
            if (Array.isArray(logValue)) {
              if (!logValue.some(item => values.has(String(item)))) {
                return false;
              }
            } else {
              if (!values.has(String(logValue))) {
                return false;
              }
            }
          }
        }
      }
      
      // Check property existence filters
      for (const property of selectedProperties) {
        if (!log.hasOwnProperty(property)) {
          return false;
        }
      }
      
      return true;
    },

    hasActiveFilters: () => {
      const { messageFilter, activeFilters, specialActiveFilters, selectedProperties } = get();
      
      // Check if message filter is present
      if (messageFilter.trim()) {
        return true;
      }
      
      // Check if any special property filters are active
      for (const values of Object.values(specialActiveFilters)) {
        if (values.size > 0) {
          return true;
        }
      }
      
      // Check if any regular property filters are active
      for (const values of Object.values(activeFilters)) {
        if (values.size > 0) {
          return true;
        }
      }
      
      // Check if any property existence filters are active
      if (selectedProperties.size > 0) {
        return true;
      }
      
      return false;
    }
  })); 