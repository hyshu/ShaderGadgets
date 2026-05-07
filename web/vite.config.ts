import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const typegpuPath = fileURLToPath(
  new URL("./node_modules/typegpu", import.meta.url),
);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      typegpu: typegpuPath,
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
