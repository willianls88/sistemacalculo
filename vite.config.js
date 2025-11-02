import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src/client", // pasta do frontend
  build: {
    outDir: "../../dist/client", // build sairá em /dist/client
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
  },
});

