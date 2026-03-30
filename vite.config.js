import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/system_tao/",
  build: {
    outDir: "docs",
  },
});
