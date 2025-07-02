import { useCallback, useRef } from 'react';
import { LogEntry, LogFile } from '../types';
import { parseLogLine, readFileFromPosition } from '../utils/fileUtils';

interface UseLogWatcherProps {
  file: LogFile | null;
  isWatching: boolean;
  onNewLogs: (logs: LogEntry[]) => void;
}

// Use module-level variable instead of useRef for interval storage
let currentInterval: number | null = null;

export const useLogWatcher = ({ file, isWatching, onNewLogs }: UseLogWatcherProps) => {
  const lastPositionRef = useRef(0);

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
      onNewLogs(newLogs);
    }
  }, [onNewLogs]);

  const startWatching = useCallback(async () => {
    if (!file || currentInterval !== null) return;

    // Initial read
    const { content, newPosition } = await readFileFromPosition(file.handle, 0);
    lastPositionRef.current = newPosition;
    processNewContent(content);

    // Set up polling with regular variable storage
    currentInterval = window.setInterval(async () => {
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

  }, [file, processNewContent]);

  const stopWatching = useCallback(() => {
    if (currentInterval !== null) {
      window.clearInterval(currentInterval);
      currentInterval = null;
    }
  }, []);

  return {
    startWatching,
    stopWatching,
    cleanup: () => {
      if (currentInterval !== null) {
        window.clearInterval(currentInterval);
        currentInterval = null;
      }
    }
  };
}; 