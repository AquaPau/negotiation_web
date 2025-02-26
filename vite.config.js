import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
  },
  server: {
      allowedHosts: ["negotiation-app-web-aquapau.amvera.io"],
      watch: {
        usePolling: true,
      },
      host: '0.0.0.0',
      strictPort: true,
      port: 5173,
    }
})