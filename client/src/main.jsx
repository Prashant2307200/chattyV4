import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css';
import App from './App.jsx';

import { AuthProvider } from './providers/AuthProvider.jsx';
import { TanStackQueryProvider } from './providers/TanstackQueryProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TanStackQueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TanStackQueryProvider>
    </BrowserRouter>
  </StrictMode>
)