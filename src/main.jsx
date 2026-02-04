// src/main.jsx
// Entry point of the React application
// This file mounts React to the HTML page

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import global styles

// Create root and render app
// StrictMode helps catch potential problems in development
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);