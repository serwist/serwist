import { spawn } from "node:child_process";

describe("@serwist/build - CommonJS basic test", () => {
  test("Simple build", async () => {
    let cliOutput = "";
    let exitCode: number | null = null;

    await new Promise<void>((resolve) => {
      const build = spawn("node", ["build.js"], { cwd: __dirname });

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

    expect(cliOutput.includes("ERR_REQUIRE_ESM")).toBe(false);
    expect(exitCode).toBe(0);
    console.log(`build exited with code ${exitCode}, cli\n${cliOutput}`);
  });
});
