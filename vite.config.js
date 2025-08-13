import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react(),
    tailwindcss(),
  ],
  define: {
    'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Y29udGVudC1raW5nZmlzaC03NS5jbGVyay5hY2NvdW50cy5kZXYk')
  },
  envPrefix: 'VITE_'
}))
