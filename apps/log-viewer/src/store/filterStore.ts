import { create } from 'zustand';
import type { LogEntry, PropertyFilters } from '../types';
import { useFileStore } from './fileStore';

interface FilterStore {
  // Filter state
  messageFilter: string;
  activeFilters: PropertyFilters;
  specialActiveFilters: PropertyFilters;
  selectedProperties: Set<string>; // Properties selected but no values chosen = filter by existence
  excludedProperties: Set<string>; // Properties to exclude
  excludedFilters: PropertyFilters; // Property values to exclude
  specialExcludedFilters: PropertyFilters; // Special property values to exclude
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
  togglePropertyExclusion: (property: string) => void;
  toggleExcludedFilter: (property: string, value: string, isSpecial?: boolean) => void;
  clearPropertyFilters: (property?: string) => void;
  setSelectedProperty: (property: string | null) => void;
  toggleFilterMode: () => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  updateFilteredLogs: () => void;
  isLogMatchingFilters: (log: LogEntry) => boolean;
  hasActiveFilters: () => boolean;
  isPropertyExcluded: (property: string) => boolean;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
    // Initial state
    messageFilter: '',
    activeFilters: {},
    specialActiveFilters: {},
    selectedProperties: new Set(),
    excludedProperties: new Set(),
    excludedFilters: {},
    specialExcludedFilters: {},
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
    
    togglePropertyExclusion: (property) => {
      const { excludedProperties } = get();
      const newExcludedProperties = new Set(excludedProperties);
      
      if (newExcludedProperties.has(property)) {
        newExcludedProperties.delete(property);
      } else {
        newExcludedProperties.add(property);
      }
      
      set({ excludedProperties: newExcludedProperties });
      get().updateFilteredLogs();
    },
    
    toggleExcludedFilter: (property, value, isSpecial = false) => {
      const { excludedFilters, specialExcludedFilters } = get();
      const targetFilters = isSpecial ? specialExcludedFilters : excludedFilters;
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
        set({ specialExcludedFilters: updatedFilters });
      } else {
        set({ excludedFilters: updatedFilters });
      }
      
      get().updateFilteredLogs();
    },
    
    clearPropertyFilters: (property) => {
      const { activeFilters, specialActiveFilters, selectedProperties, excludedProperties, excludedFilters, specialExcludedFilters } = get();
      
      if (property) {
        const updatedFilters = { ...activeFilters };
        const updatedSpecialFilters = { ...specialActiveFilters };
        const updatedExcludedFilters = { ...excludedFilters };
        const updatedSpecialExcludedFilters = { ...specialExcludedFilters };
        const newSelectedProperties = new Set(selectedProperties);
        const newExcludedProperties = new Set(excludedProperties);
        
        delete updatedFilters[property];
        delete updatedSpecialFilters[property];
        delete updatedExcludedFilters[property];
        delete updatedSpecialExcludedFilters[property];
        newSelectedProperties.delete(property);
        newExcludedProperties.delete(property);
        
        set({ 
          activeFilters: updatedFilters,
          specialActiveFilters: updatedSpecialFilters,
          excludedFilters: updatedExcludedFilters,
          specialExcludedFilters: updatedSpecialExcludedFilters,
          selectedProperties: newSelectedProperties,
          excludedProperties: newExcludedProperties
        });
      } else {
        // Clear all filters
        set({
          activeFilters: {},
          specialActiveFilters: {},
          excludedFilters: {},
          specialExcludedFilters: {},
          selectedProperties: new Set(),
          excludedProperties: new Set()
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
        excludedProperties: new Set(),
        excludedFilters: {},
        specialExcludedFilters: {},
        selectedProperty: null,
      });
      // Update filtered logs to show all entries
      get().updateFilteredLogs();
    },
    
    updateFilteredLogs: () => {
      const { messageFilter, activeFilters, specialActiveFilters, selectedProperties, excludedProperties, excludedFilters, specialExcludedFilters, sortOrder, filterMode } = get();
      const logs = useFileStore.getState().logs;
      let filtered = logs;
      
      // Apply inclusion filters only in filter mode
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
            filtered = filtered.filter(log => Object.hasOwn(log, property));
          }
        });
      }
      
      // EXCLUSIONS ALWAYS APPLY (regardless of filter/tint mode)
      
      // Property exclusion filters
      excludedProperties.forEach(property => {
        filtered = filtered.filter(log => !Object.hasOwn(log, property));
      });
      
      // Special property value exclusions
      Object.entries(specialExcludedFilters).forEach(([property, values]) => {
        if (values.size > 0) {
          filtered = filtered.filter(log => {
            const logValue = log[property];
            if (!logValue) return true; // If property doesn't exist, don't exclude
            
            // Handle arrays: exclude if any array element matches any excluded value
            if (Array.isArray(logValue)) {
              return !logValue.some(item => values.has(String(item)));
            }
            
            // Handle single values
            return !values.has(String(logValue));
          });
        }
      });
      
      // Regular property value exclusions
      Object.entries(excludedFilters).forEach(([property, values]) => {
        if (values.size > 0) {
          filtered = filtered.filter(log => {
            const logValue = log[property];
            if (!logValue) return true; // If property doesn't exist, don't exclude
            
            // Handle arrays: exclude if any array element matches any excluded value
            if (Array.isArray(logValue)) {
              return !logValue.some(item => values.has(String(item)));
            }
            
            // Handle single values
            return !values.has(String(logValue));
          });
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
    },
    
    isLogMatchingFilters: (log) => {
      const { messageFilter, activeFilters, specialActiveFilters, selectedProperties, excludedProperties, excludedFilters, specialExcludedFilters } = get();
      
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
        if (!Object.hasOwn(log, property)) {
          return false;
        }
      }
      
      // Check property exclusion filters
      for (const property of excludedProperties) {
        if (Object.hasOwn(log, property)) {
          return false;
        }
      }
      
      // Check special property value exclusions
      for (const [property, values] of Object.entries(specialExcludedFilters)) {
        if (values.size > 0) {
          const logValue = log[property];
          if (logValue) {
            if (Array.isArray(logValue)) {
              if (logValue.some(item => values.has(String(item)))) {
                return false;
              }
            } else {
              if (values.has(String(logValue))) {
                return false;
              }
            }
          }
        }
      }
      
      // Check regular property value exclusions
      for (const [property, values] of Object.entries(excludedFilters)) {
        if (values.size > 0) {
          const logValue = log[property];
          if (logValue) {
            if (Array.isArray(logValue)) {
              if (logValue.some(item => values.has(String(item)))) {
                return false;
              }
            } else {
              if (values.has(String(logValue))) {
                return false;
              }
            }
          }
        }
      }
      
      return true;
    },

    hasActiveFilters: () => {
      const { messageFilter, activeFilters, specialActiveFilters, selectedProperties, excludedProperties, excludedFilters, specialExcludedFilters } = get();
      
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
      
      // Check if any property exclusion filters are active
      if (excludedProperties.size > 0) {
        return true;
      }
      
      // Check if any special property value exclusions are active
      for (const values of Object.values(specialExcludedFilters)) {
        if (values.size > 0) {
          return true;
        }
      }
      
      // Check if any regular property value exclusions are active
      for (const values of Object.values(excludedFilters)) {
        if (values.size > 0) {
          return true;
        }
      }
      
      return false;
    },

    isPropertyExcluded: (property) => {
      const { excludedProperties } = get();
      return excludedProperties.has(property);
    }
  })); 