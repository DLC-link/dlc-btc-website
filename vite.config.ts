import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { ViteToml } from 'vite-plugin-toml'
import { readFileSync } from 'fs';

import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>  {

  const env = loadEnv(mode, process.cwd(), '')

  const bitcoinNetworkConfiguration = readFileSync(resolve(__dirname, `./config.${env.VITE_BITCOIN_NETWORK}.json`), 'utf-8');

  return {
  plugins: [react(), wasm(), ViteToml()],
  build: {
    target: 'esnext',
  },
  define: {
    bitcoinNetworkConfiguration: JSON.stringify(bitcoinNetworkConfiguration)
  },
  resolve: {
    alias: [
      { 
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
      find: "@functions",
      replacement: resolve(__dirname, './src/app/functions')
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
}
})
