// Simple PDF.js worker endpoint to serve the worker file locally
// This helps avoid CORS issues with external CDNs

const express = require('express');
const path = require('path');

// Serve the PDF worker from node_modules
function setupPDFWorker(app) {
  app.get('/pdf.worker.min.js', (req, res) => {
    const workerPath = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(workerPath);
  });
}

module.exports = { setupPDFWorker };