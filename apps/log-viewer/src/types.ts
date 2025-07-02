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

declare global {
  interface Window {
    showOpenFilePicker(options?: {
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle[]>;
  }
} 