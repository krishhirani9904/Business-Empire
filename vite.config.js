// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Environment variables load karo
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // HTML Transform Plugin - Game ID inject karse
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            '%VITE_GD_GAME_ID%',
            env.VITE_GD_GAME_ID || ''
          );
        }
      }
    ],
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
    },
  };
});