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
  const apiTarget = env.VITE_API_BASE_URL || 'https://batteries-diagnosis-yard-attitudes.trycloudflare.com'

  // Header để bypass trang cảnh báo của Ngrok
  const ngrokHeaders = {
    'ngrok-skip-browser-warning': 'true',
  }

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
        // Proxy requests to the backend server to bypass CORS and ngrok browser warning
        // NOTE: Đã xóa /borrow vì nó conflict với route FE /borrow-history
        // Sử dụng /borrow-ticket cho các API mượn/trả sách
        '/auth': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/forgot-password': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/reset-password': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/profile': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/user': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/category': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/shelves': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/dashboard': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/book-hold': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/book': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/author': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/publisher': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/borrow-ticket': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/notification': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
        '/ai': {
          target: 'https://unpractised-unmilitant-cherly.ngrok-free.dev',
          changeOrigin: true,
          secure: false,
          headers: ngrokHeaders,
        },
      }
    }
  }
})