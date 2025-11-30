import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Esto le dice a Vite que "@" significa la carpeta "src"
      '@': path.resolve(__dirname, './src'),
    },
  },
})
