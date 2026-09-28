import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import Bootstrap 5 CSS, Bootstrap Icons, and Bootstrap JS bundle
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Corporate Theme & Design System Overrides
import './index.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
