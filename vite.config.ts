import wasm from "vite-plugin-wasm";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),wasm()],
  resolve: {
    alias: [{ 
      find: "@store", 
      replacement: resolve(__dirname, './src/app/store') 
    },
    { 
      find: "@components", 
      replacement: resolve(__dirname, './src/app/components') 
    },
    { 
      find: "@models", 
      replacement: resolve(__dirname, './src/shared/models') 
    },
    { 
      find: "@common", 
      replacement: resolve(__dirname, './src/app/common') 
    },
    { 
      find: "@pages", 
      replacement: resolve(__dirname, './src/app/pages') 
    },
    { 
      find: "@shared", 
      replacement: resolve(__dirname, './src/shared') 
    },
    { 
      find: "@hooks", 
      replacement: resolve(__dirname, './src/app/hooks') 
    },
    { 
      find: "@providers", 
      replacement: resolve(__dirname, './src/app/providers') 
    },
    { 
      find: "@styles", 
      replacement: resolve(__dirname, './src/styles') 
    }]
  }
})
