# JSON Log Viewer

A modern, real-time JSON log viewer built with React, TypeScript, and Vite. View, filter, and monitor JSON log files with a beautiful, responsive interface.

## Features

- **Real-time monitoring**: Watch log files for changes and automatically update the view
- **Advanced filtering**: Filter logs by message content and property values
- **Property-based filters**: Dynamically generated filters based on log properties
- **Modern UI**: Clean, dark-themed interface with responsive design
- **File System API**: Uses the modern File System Access API for efficient file handling
- **TypeScript**: Fully typed for better development experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- A modern browser that supports the [File System Access API](https://caniuse.com/native-filesystem-api)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be served by any static file server.

## Usage

1. **Select a Log File**: Click "Select File" to choose a JSON log file from your system
2. **Start Watching**: Click "Start" to begin monitoring the file for changes
3. **Filter Logs**: 
   - Use the search bar to filter by message content
   - Expand property filters to filter by specific property values
4. **View Results**: See real-time statistics and filtered results

## Log File Format

The viewer expects JSON log files where each line is a valid JSON object:

```json
{"timestamp": "2023-01-01T12:00:00Z", "level": "info", "message": "Application started"}
{"timestamp": "2023-01-01T12:00:01Z", "level": "warn", "message": "High memory usage detected"}
{"timestamp": "2023-01-01T12:00:02Z", "level": "error", "message": "Database connection failed", "error": "ECONNREFUSED"}
```

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Application header
│   ├── SearchBar.tsx    # Message search component
│   ├── PropertyFilters.tsx # Property-based filtering
│   ├── LogEntry.tsx     # Individual log entry display
│   └── LogViewer.tsx    # Main application component
├── hooks/               # Custom React hooks
│   ├── useLogFilters.ts # Log filtering logic
│   └── useLogWatcher.ts # File watching logic
├── utils/               # Utility functions
│   └── fileUtils.ts     # File operation utilities
├── types.ts             # TypeScript type definitions
├── App.tsx             # Root application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Browser Compatibility

This application uses the File System Access API, which is currently supported in:
- Chrome 86+
- Edge 86+
- Opera 72+

For unsupported browsers, consider using a traditional file input fallback.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 