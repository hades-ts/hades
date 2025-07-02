export interface LogEntry {
  message?: string;
  [key: string]: unknown;
}

export interface LogFile {
  handle: FileSystemFileHandle;
  file: File;
}

export interface PropertyFilters {
  [property: string]: Set<string>;
}

export interface PropertyValues {
  [property: string]: Set<string>;
}

// FileSystemObserver API types (experimental)
export interface FileSystemObserverEntry {
  changedHandle: FileSystemHandle;
  type: 'appeared' | 'disappeared' | 'modified';
}

export type FileSystemObserverCallback = (
  records: FileSystemObserverEntry[],
  observer: FileSystemObserver
) => void;

export interface FileSystemObserver {
  observe(handle: FileSystemHandle): Promise<void>;
  disconnect(): void;
}

export interface FileSystemObserverConstructor {
  new (callback: FileSystemObserverCallback): FileSystemObserver;
}

declare global {
  interface Window {
    showOpenFilePicker(options?: {
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle[]>;
    FileSystemObserver: FileSystemObserverConstructor;
  }
} 