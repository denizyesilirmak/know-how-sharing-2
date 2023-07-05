import { resolve } from "path";
import { defineConfig } from "vite";

//vite public output directory

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
    outDir: "dist",
  },
  publicDir: "public",
  base: "",
});
