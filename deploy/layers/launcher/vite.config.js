import { wgslVitePlugin } from "@vgpu/wgsl/loader-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [wgslVitePlugin({ minify: true })],
  build: {
    emptyOutDir: true,
    outDir: "dist",
    target: "es2022",
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "ocean.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
