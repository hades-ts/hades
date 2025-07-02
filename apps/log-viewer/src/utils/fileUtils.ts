import { LogEntry } from '../types';

export const parseLogLine = (line: string): LogEntry | null => {
  try {
    return JSON.parse(line.trim());
  } catch {
    return null;
  }
};

export const readFileFromPosition = async (
  fileHandle: FileSystemFileHandle,
  position: number
): Promise<{ content: string; newPosition: number }> => {
  try {
    const file = await fileHandle.getFile();
    if (file.size <= position) return { content: '', newPosition: position };

    const slice = file.slice(position);
    const text = await slice.text();
    return { content: text, newPosition: file.size };
  } catch (err) {
    console.error('Error reading file:', err);
    return { content: '', newPosition: position };
  }
}; 