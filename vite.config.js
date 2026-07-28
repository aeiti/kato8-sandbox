import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy target controls the public base path.
//   dev   -> served at http://localhost:5173/            (base '/')
//   pages -> served at https://aeiti.github.io/kato8-sandbox/
//
// Default is 'dev' so plain `npm run dev` works locally.
// The deploy workflow sets VITE_DEPLOY_TARGET=pages before `npm run build`.
const target = process.env.VITE_DEPLOY_TARGET || 'dev'
const base = target === 'pages' ? '/kato8-sandbox/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'docs',
  },
})
