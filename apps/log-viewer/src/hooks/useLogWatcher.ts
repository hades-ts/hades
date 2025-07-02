import { useCallback, useRef } from 'react';
import { FileSystemObserver, FileSystemObserverEntry, LogEntry, LogFile } from '../types';
import { parseLogLine, readFileFromPosition } from '../utils/fileUtils';

interface UseLogWatcherProps {
  file: LogFile | null;
  isWatching: boolean;
  onNewLogs: (logs: LogEntry[]) => void;
  onClearLogs?: () => void;
}

export const useLogWatcher = ({ file, isWatching: _isWatching, onNewLogs, onClearLogs }: UseLogWatcherProps) => {
  const lastPositionRef = useRef(0);
  const currentFileRef = useRef<FileSystemFileHandle | null>(null);
  const currentObserverRef = useRef<FileSystemObserver | any>(null);

  // Reset position when file changes
  if (file?.handle !== currentFileRef.current) {
    console.log('File changed, resetting position');
    lastPositionRef.current = 0;
    currentFileRef.current = file?.handle || null;
  }

  const processNewContent = useCallback((content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const newLogs: LogEntry[] = [];

    lines.forEach(line => {
      const parsed = parseLogLine(line);
      if (parsed) {
        newLogs.push(parsed);
      }
    });

    if (newLogs.length > 0) {
      console.log(`Processing ${newLogs.length} new log entries`);
      onNewLogs(newLogs);
    }
  }, [onNewLogs]);

  const handleFileChange = useCallback(async (records: FileSystemObserverEntry[]) => {
    if (!file) return;

    try {
      // Log all change records for debugging
      console.log('File change event received with', records.length, 'records');
      
      // Read new content from our last position (only once per change event)
      const { content, newPosition } = await readFileFromPosition(file.handle, lastPositionRef.current);
      lastPositionRef.current = newPosition;
      
      if (content) {
        processNewContent(content);
      }
    } catch (error) {
      console.error('Error processing file changes:', error);
    }
  }, [file, processNewContent]);

  const stopWatching = useCallback(() => {
    console.log('Stopping file watcher');
    if (currentObserverRef.current !== null) {
      if (typeof currentObserverRef.current === 'object' && 'observe' in currentObserverRef.current && 'disconnect' in currentObserverRef.current) {
        // It's a FileSystemObserver
        currentObserverRef.current.disconnect();
      } else if (currentObserverRef.current?.type === 'polling') {
        clearInterval(currentObserverRef.current.intervalId);
      }
      currentObserverRef.current = null;
    }
  }, []);

  const startWatching = useCallback(async () => {
    if (!file) {
      console.log('No file to watch');
      return;
    }
    
    if (currentObserverRef.current !== null) {
      console.log('Observer already exists, skipping');
      return;
    }

    console.log('Starting file watcher for', file.file.name);

    try {
      // Check if FileSystemObserver is available
      if (!window.FileSystemObserver) {
        console.warn('FileSystemObserver not available, falling back to polling');
        // Fallback to polling if FileSystemObserver is not available
        fallbackPolling();
        return;
      }

      // Only do initial read if we haven't read this file before (position is 0)
      if (lastPositionRef.current === 0) {
        console.log('Initial read from position 0');
        // Clear existing logs before initial read to prevent duplication during hot reload
        if (onClearLogs) {
          onClearLogs();
        }

        // Initial read
        const { content, newPosition } = await readFileFromPosition(file.handle, 0);
        lastPositionRef.current = newPosition;
        processNewContent(content);
      }

      // Create and start observer
      currentObserverRef.current = new window.FileSystemObserver(handleFileChange);
      await currentObserverRef.current.observe(file.handle);
      
      console.log('Started watching file with FileSystemObserver');
    } catch (error) {
      console.error('Error starting file observer:', error);
      console.warn('Falling back to polling');
      fallbackPolling();
    }
  }, [file, processNewContent, handleFileChange, onClearLogs]);

  const fallbackPolling = useCallback(() => {
    if (!file) return;

    console.log('Starting polling mode');

    // Only do initial read if we haven't read this file before (position is 0)
    if (lastPositionRef.current === 0) {
      console.log('Initial read from position 0 (polling)');
      // Clear existing logs before initial read to prevent duplication during hot reload
      if (onClearLogs) {
        onClearLogs();
      }

      // Do initial read for polling mode
      readFileFromPosition(file.handle, 0).then(({ content, newPosition }) => {
        lastPositionRef.current = newPosition;
        if (content) {
          processNewContent(content);
        }
      }).catch(error => {
        console.error('Error during initial read:', error);
      });
    }

    const pollInterval = setInterval(async () => {
      try {
        const { content, newPosition } = await readFileFromPosition(file.handle, lastPositionRef.current);
        lastPositionRef.current = newPosition;
        if (content) {
          processNewContent(content);
        }
      } catch (error) {
        console.error('Error during file polling:', error);
      }
    }, 1000);

    // Store the interval ID in a way that can be cleared
    currentObserverRef.current = { type: 'polling', intervalId: pollInterval };
  }, [file, processNewContent, onClearLogs]);

  return {
    startWatching,
    stopWatching,
    cleanup: () => {
      console.log('Cleanup called');
      if (currentObserverRef.current !== null) {
        if (typeof currentObserverRef.current === 'object' && 'observe' in currentObserverRef.current && 'disconnect' in currentObserverRef.current) {
          // It's a FileSystemObserver
          currentObserverRef.current.disconnect();
        } else if (currentObserverRef.current?.type === 'polling') {
          clearInterval(currentObserverRef.current.intervalId);
        }
        currentObserverRef.current = null;
      }
    }
  };
}; 