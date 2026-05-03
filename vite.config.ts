import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "~", replacement: path.resolve(__dirname, "./src") },
      { find: "next/router", replacement: path.resolve(__dirname, "./src/shims-next-router.ts") },
      { find: "next/link", replacement: path.resolve(__dirname, "./src/shims-next-link.tsx") },
      { find: "next", replacement: path.resolve(__dirname, "./src/shims-next.ts") },
    ],
  },
});
