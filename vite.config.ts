import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  esbuild: {
    drop: mode === "production" ? ["debugger"] : [],
    pure:
      mode === "production"
        ? ["console.log", "console.info", "console.debug"]
        : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          styles: ["styled-components"],
          http: ["axios"],
        },
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
}));
