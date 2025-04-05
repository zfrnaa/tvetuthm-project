import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import compression from "vite-plugin-compression";

// dotenv.config(); // Load environment variables from .env

// https://vite.dev/config/
export default defineConfig({
  esbuild:{
    loader: 'jsx' // or 'tsx' if you are using typescript
  },
  plugins: [react(), tailwindcss(), compression()],
  assetsInclude: ["**/*.html"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'esbuild',  // Ensure minification
    rollupOptions: {
      treeshake: true,  // Force tree shaking
    }
  }
})
