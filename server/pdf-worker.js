// Minimal PDF.js worker implementation for local serving
// This eliminates CORS issues by serving from the same origin

self.importScripts = self.importScripts || function() {};

self.onmessage = function(event) {
  // Basic worker message handling
  const { type, data } = event.data;
  
  switch (type) {
    case 'init':
      self.postMessage({ type: 'ready' });
      break;
    default:
      // Echo back unknown messages
      self.postMessage({ type: 'unknown', originalType: type });
  }
};

// Initialize worker
self.postMessage({ type: 'ready' });