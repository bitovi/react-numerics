// vite.config.js
import { resolve } from "path"
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import typescript from '@rollup/plugin-typescript';
export default defineConfig({
  plugins: [react(), typescript()],
  test: {
      globals: true,
      setupFiles: 'libs/react-numerics/jest.setup.ts',
      environment: 'jsdom'
  },
  build: {
    lib: {
      entry: resolve(__dirname, "libs/react-numerics/src/index.ts"),
      name: "react-numerics",
      // the proper extensions will be added
      fileName: "react-numerics",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
        },
      },
    },
  },
})
