// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';        // ← import your global stylesheet
import TGNApp from './TGNApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TGNApp />
  </React.StrictMode>
);
