import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  dts: {
    compilerOptions: {
      moduleResolution: "node" as never,
    },
  },
  splitting: false,
  sourcemap: true,
  // Preserve dist/index.css produced by `npm run build:css`
  clean: ["dist/index.js", "dist/index.js.map", "dist/index.d.ts"],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "lucide-react",
  ],
  outDir: "dist",
});
