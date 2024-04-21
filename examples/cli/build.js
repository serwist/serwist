import { cp, rm } from "node:fs/promises";
import { build } from "esbuild";

await rm("./dist", { recursive: true, force: true });

await build({
  entryPoints: [
    { in: "src/app.js", out: "app" },
    { in: "tmp/sw.js", out: "sw" },
  ],
  target: ["es2020"],
  bundle: true,
  minify: true,
  outdir: "dist",
});

await rm("./tmp", { recursive: true, force: true });

await cp("static", "dist", { recursive: true });
