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
  const apiTarget = env.VITE_API_BASE_URL || 'https://pensions-imagination-metadata-waiting.trycloudflare.com'

  // Header để bypass trang cảnh báo của Ngrok
  const ngrokHeaders = {
    'ngrok-skip-browser-warning': 'true',
  }

  // Bypass proxy for HTML requests (SPA navigation) - fix 404 on refresh
  const bypassHtml = (req) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return req.url;
    }
  };

  // List of API paths to proxy
  const proxyPaths = [
    '/auth', '/api', '/forgot-password', '/reset-password', '/profile', '/user',
    '/category', '/shelves', '/dashboard', '/book-hold', '/book', '/author',
    '/publisher', '/borrow-ticket', '/notification'
  ];

  // Generate proxy config
  const proxyConfig = proxyPaths.reduce((config, path) => {
    config[path] = {
      target: apiTarget,
      changeOrigin: true,
      secure: false,
      headers: ngrokHeaders,
      bypass: bypassHtml,
    };
    return config;
  }, {});

  // Add custom AI proxy
  proxyConfig['/ai'] = {
    target: 'https://unpractised-unmilitant-cherly.ngrok-free.dev',
    changeOrigin: true,
    secure: false,
    headers: ngrokHeaders,
    bypass: bypassHtml,
  };

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
      port: 5173,
      historyApiFallback: true, // Ensure fallback to index.html
      proxy: proxyConfig
    }
  }
})