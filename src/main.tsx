import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { logger } from './lib/logger.ts';
import './index.css';

// Register Service Worker for PWA across all environments
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        logger.info('PWA', 'ServiceWorker active with scope:', registration.scope);
      })
      .catch((error) => {
        logger.warn('PWA', 'ServiceWorker registration note:', error?.message || error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

