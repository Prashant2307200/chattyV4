import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register';

import './index.css';
import App from './App.jsx';

import { SocketProvider } from './providers/socketProvider.jsx';
import { TanStackQueryProvider } from './providers/TanstackQueryProvider.jsx';

const updateSW = registerSW({
  onNeedRefresh() { },
  onOfflineReady() { }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TanStackQueryProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </TanStackQueryProvider>
    </BrowserRouter>
  </StrictMode>
)