import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
  },

  preview: {
    allowedHosts: ["buildkiwi-pattern-lab-production.up.railway.app"],
  },
});
