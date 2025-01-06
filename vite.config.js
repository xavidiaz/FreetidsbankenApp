import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
      theme: { extend: {} },
      plugins: [],
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(new URL(import.meta.url).pathname), "./src"),
    },
  },
  build: {
    minify: "terser",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ["axios"], // ✅ Prevents axios from being bundled incorrectly
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          radix: ["@radix-ui/react-toast", "@radix-ui/react-dialog"],
          vendor: ["zustand"],
        },
      },
    },
  },
});
