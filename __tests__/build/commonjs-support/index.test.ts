import { createCommandState, runCommand } from "@serwist-tests/utils";
import { describe, expect, test } from "vitest";

describe("@serwist/build - CommonJS basic test", () => {
  test("Simple build", async () => {
    const commandState = createCommandState();
    await runCommand("node", ["scripts/build.js"], __dirname, commandState);
    expect(commandState.cliOutput).not.toContain("ERR_REQUIRE_ESM");
    expect(commandState.exitCode).toBe(0);
    console.log(`build exited with code ${commandState.exitCode}, cli\n${commandState.cliOutput}`);
  });
});
