import { build } from "esbuild";

build({
  bundle: true,
  entryPoints: ["./src/index.ts"],
  logLevel: "info",
  minify: true,
  platform: "browser",
  sourcemap: "linked",
  treeShaking: true,
  outdir: ".dist",
  target: ["esnext", "node20.0.0"],
  format: "esm",
  outExtension: { ".js": ".mjs" },
  splitting: true,
});
