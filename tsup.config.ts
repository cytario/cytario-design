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
  clean: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "lucide-react",
  ],
  outDir: "dist",
});
