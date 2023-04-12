
import esbuild from "esbuild";
import {
  existsSync,
  mkdirSync,
} from "fs";
import { join } from "path";

const dist = join(process.cwd(), "dist");

if (!existsSync(dist)) {
  mkdirSync(dist);
}

// esm output bundle
esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/esm/index.js",
    bundle: true,
    sourcemap: true,
    minify: true,
    format: "esm",
    define: { global: "window" },
    target: ["esnext"],
  })
  .catch(() => process.exit(1));

// cjs output bundle
esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/cjs/index.js",
    bundle: true,
    sourcemap: true,
    minify: true,
    platform: "node",
    target: ["node16"],
  })
  .catch(() => process.exit(1));