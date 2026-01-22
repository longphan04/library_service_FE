import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'https://bd4328e96c81.ngrok-free.app'

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        // Proxy requests to the backend server to bypass CORS
        '/auth': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/profile': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/user': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/category': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/shelves': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/dashboard': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/book': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/author': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/publisher': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/borrow': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})