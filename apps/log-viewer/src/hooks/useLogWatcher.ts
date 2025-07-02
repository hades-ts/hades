import { useCallback, useRef } from 'react';
import { LogEntry, LogFile } from '../types';
import { parseLogLine, readFileFromPosition } from '../utils/fileUtils';

interface UseLogWatcherProps {
  file: LogFile | null;
  isWatching: boolean;
  onNewLogs: (logs: LogEntry[]) => void;
}

export const useLogWatcher = ({ file, isWatching, onNewLogs }: UseLogWatcherProps) => {
  const lastPositionRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

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
    if (!file || isWatching) return;

    // Initial read
    const { content, newPosition } = await readFileFromPosition(file.handle, 0);
    lastPositionRef.current = newPosition;
    processNewContent(content);

    // Set up polling
    intervalRef.current = window.setInterval(async () => {
      const { content, newPosition } = await readFileFromPosition(file.handle, lastPositionRef.current);
      lastPositionRef.current = newPosition;
      if (content) {
        processNewContent(content);
      }
    }, 1000);
  }, [file, isWatching, processNewContent]);

  const stopWatching = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    startWatching,
    stopWatching,
    cleanup: () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    }
  };
}; 