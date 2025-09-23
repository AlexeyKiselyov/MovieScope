import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import 'modern-normalize/modern-normalize.css';
import './index.css';

import App from './Components/App.tsx';
import SmoothScrolling from './Components/SmoothScrolling/SmoothScrolling.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SmoothScrolling>
        <App />
      </SmoothScrolling>
    </BrowserRouter>
  </StrictMode>
);
