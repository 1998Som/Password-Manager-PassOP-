import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

// Try to get the key from different possible sources
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
                       import.meta.env.CLERK_PUBLISHABLE_KEY ||
                       'pk_test_Y29udGVudC1raW5nZmlzaC03NS5jbGVyay5hY2NvdW50cy5kZXYk';

console.log('Environment check:', {
  mode: import.meta.env.MODE,
  key: PUBLISHABLE_KEY ? 'Found' : 'Missing',
  env: import.meta.env
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
)
