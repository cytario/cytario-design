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
  // Rebuild the stylesheet after each JS build (incl. --watch rebuilds), so
  // dist/index.css is always regenerated in the same pass rather than by a
  // separate watcher that races the consumer's reload.
  onSuccess: "npm run build:css",
  // Preserve dist/index.css produced by `build:css`
  clean: ["dist/index.js", "dist/index.js.map", "dist/index.d.ts"],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "lucide-react",
  ],
  outDir: "dist",
});
