import { create } from 'zustand';
import type { FileSystemObserver, FileSystemObserverEntry, LogEntry, LogFile, PropertyValues } from '../types';
import { parseLogLine, readFileFromPosition } from '../utils/fileUtils';

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
  
  // Internal watching state
  observer: FileSystemObserver | { type: 'polling'; intervalId: number } | null;
  lastPosition: number;
  
  // Actions
  setFile: (file: LogFile | null) => void;
  setIsWatching: (isWatching: boolean) => void;
  addLogs: (newLogs: LogEntry[]) => void;
  clearLogs: () => void;
  startWatching: () => Promise<void>;
  stopWatching: () => void;
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
  observer: null,
  lastPosition: 0,

  // Actions
  setFile: (file) => {
    const { stopWatching } = get();
    // Stop watching the previous file
    stopWatching();
    // Reset position for new file
    set({ file, lastPosition: 0 });
  },
  
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
            const isSpecial = SPECIAL_PROPERTIES.has(key);
            const targetProperties = isSpecial ? updatedSpecialProperties : updatedProperties;
            
            if (!targetProperties[key]) {
              targetProperties[key] = new Set();
              console.log(`Found new ${isSpecial ? 'special' : 'regular'} property: ${key}`);
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
    specialProperties: {},
    lastPosition: 0
  }),
  
  startWatching: async () => {
    const { file, observer, lastPosition, clearLogs } = get();
    
    if (!file) {
      console.log('No file to watch');
      return;
    }
    
    if (observer) {
      console.log('Observer already exists, skipping');
      return;
    }
    
    console.log('Starting file watcher for', file.file.name);
    
    const processNewContent = (content: string) => {
      const lines = content.split('\n').filter(line => line.trim());
      const newLogs: LogEntry[] = [];
      
      lines.forEach(line => {
        const parsed = parseLogLine(line);
        if (parsed) {
          console.log("Parsed a log line:");
          console.log(parsed);
          newLogs.push(parsed);
        }
      });
      
      if (newLogs.length > 0) {
        console.log(`Processing ${newLogs.length} new log entries`);
        get().addLogs(newLogs);
      }
    };
    
    const handleFileChange = async (records: FileSystemObserverEntry[]) => {
      console.log('File change event received with', records.length, 'records');
      const { file, lastPosition } = get();
      if (!file) return;
      
      try {
        // Read new content from our last position
        const { content, newPosition } = await readFileFromPosition(file.handle, lastPosition);
        set({ lastPosition: newPosition });
        
        if (content) {
          processNewContent(content);
        }
      } catch (error) {
        console.error('Error processing file changes:', error);
      }
    };
    
    try {
      // Check if FileSystemObserver is available
      if (!window.FileSystemObserver) {
        console.warn('FileSystemObserver not available, falling back to polling');
        // Fallback to polling
        startPolling();
        return;
      }
      
      // Initial read if starting from beginning
      if (lastPosition === 0) {
        console.log('Initial read from position 0');
        clearLogs();
        
        const { content, newPosition } = await readFileFromPosition(file.handle, 0);
        set({ lastPosition: newPosition });
        processNewContent(content);
      }
      
      // Create and start observer
      const newObserver = new window.FileSystemObserver(handleFileChange);
      await newObserver.observe(file.handle);
      
      set({ observer: newObserver });
      console.log('Started watching file with FileSystemObserver');
    } catch (error) {
      console.error('Error starting file observer:', error);
      console.warn('Falling back to polling');
      startPolling();
    }
    
    // Polling fallback
    function startPolling() {
      const { file } = get();
      if (!file) return;
      
      console.log('Starting polling mode');
      
      // Initial read for polling mode
      if (lastPosition === 0) {
        console.log('Initial read from position 0 (polling)');
        clearLogs();
        
        readFileFromPosition(file.handle, 0).then(({ content, newPosition }) => {
          set({ lastPosition: newPosition });
          if (content) {
            processNewContent(content);
          }
        }).catch(error => {
          console.error('Error during initial read:', error);
        });
      }
      
      const pollInterval = setInterval(async () => {
        const { file, lastPosition } = get();
        if (!file) return;
        
        try {
          const { content, newPosition } = await readFileFromPosition(file.handle, lastPosition);
          set({ lastPosition: newPosition });
          if (content) {
            processNewContent(content);
          }
        } catch (error) {
          console.error('Error during file polling:', error);
        }
      }, 1000);
      
      set({ observer: { type: 'polling', intervalId: pollInterval } });
    }
  },
  
  stopWatching: () => {
    const { observer } = get();
    
    console.log('Stopping file watcher');
    if (observer) {
      if ('disconnect' in observer) {
        console.log('Disconnecting FileSystemObserver');
        observer.disconnect();
      } else if (observer.type === 'polling') {
        console.log('Clearing polling interval');
        clearInterval(observer.intervalId);
      }
      set({ observer: null });
    } else {
      console.log('No observer to stop');
    }
  },
})); 