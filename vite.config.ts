/// <reference types="vite-plugin-svgr/client" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
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
});
