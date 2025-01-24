import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Erzwingt die Nutzung von @mui/styled-engine-sc anstelle von @mui/styled-engine
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
})
