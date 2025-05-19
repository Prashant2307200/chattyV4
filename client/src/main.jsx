import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css';
import App from './App.jsx';
import { QueryProvider } from './providers/queryProvider';
import { SocketProvider } from './providers/socketProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
)