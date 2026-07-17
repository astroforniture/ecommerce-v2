import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /**
   * Dev esclusivamente su http://localhost:5173/
   * strictPort: niente fallback5174+ — libera la porta (es. npx kill-port 5173) e rilancia.
   */
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  define: {
    'process.env': {},
  },
})
