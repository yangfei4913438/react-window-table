import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@material-tailwind/react';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.scss';

import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
