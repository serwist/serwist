import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("@serwist/cli - basic", () => {
  test("Simple build", async () => {
    let cliOutput = "";
    let exitCode: number | null = null;

    await new Promise<void>((resolve) => {
      const build = spawn("pnpm", ["serwist", "build"], { cwd: __dirname });

      build.stdout.on("data", (data: Buffer) => {
        const msg = data.toString();
        cliOutput += msg;
      });

      build.stderr.on("data", (data: Buffer) => {
        const msg = data.toString();
        cliOutput += msg;
      });

      build.on("close", (code) => {
        exitCode = code;
        resolve();
      });
    });
    expect(exitCode, cliOutput).toBe(0);
    expect(readFileSync(path.join(__dirname, "dist/service-worker.js"), "utf-8")).toContain("icon-512x512.png");
    console.log(`build exited with code ${exitCode}, cli\n${cliOutput}`);
  });
});
