import { createCommandState, runCommand } from "@serwist-tests/utils";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("@serwist/cli - basic", () => {
  test("Simple build", async () => {
    const commandState = createCommandState();
    await runCommand("pnpm", ["serwist", "build"], __dirname, commandState);
    expect(commandState.exitCode).toBe(0);
    expect(readFileSync(path.join(__dirname, "dist/service-worker.js"), "utf-8")).toContain("icon-512x512.png");
    console.log(`build exited with code ${commandState.exitCode}, cli\n${commandState.cliOutput}`);
  });
});
