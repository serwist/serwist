import type { SpawnOptionsWithoutStdio } from "node:child_process";
import { spawn } from "node:child_process";

import { NextInstance } from "./next-instance-base.ts";
import { getURLFromLog } from "./utils.ts";

export class NextInstanceStart extends NextInstance {
  public async spawn() {
    const spawnOpts: SpawnOptionsWithoutStdio = {
      shell: false,
      env: {
        ...process.env,
        NODE_ENV: "" as any,
        PORT: "0",
      },
    };

    console.log("running next build...");

    await new Promise<void>((resolve, reject) => {
      try {
        let buildStdout = "";
        let buildStderr = "";
        this._process = spawn("pnpm", ["next", "build", this._appTestDir], spawnOpts);
        this._process.stdout.on("data", (chunk: Buffer) => {
          const msg = chunk.toString();
          this._cliOutput += msg;
          buildStdout += msg;
        });
        this._process.stderr.on("data", (chunk: Buffer) => {
          const msg = chunk.toString();
          this._cliOutput += msg;
          buildStderr += msg;
        });
        this._process.on("exit", (code, signal) => {
          this._process = undefined;
          if (code || signal) {
            reject(new Error(`next build failed with code/signal ${code || signal}`));
          } else {
            console.log(`next build ran successfully with stdout: ${buildStdout || "none"} and stderr: ${buildStderr || "none"}`);
            resolve();
          }
        });
      } catch (err) {
        console.error("failed to build next app", err);
        setTimeout(() => process.exit(1), 0);
      }
    });

    console.log("running next start...");

    return new Promise<void>((resolve, reject) => {
      this._process = spawn("pnpm", ["next", "start", this._appTestDir], spawnOpts);
      this._process.stdout.on("data", (chunk: Buffer) => {
        const msg = chunk.toString();
        this._cliOutput += msg;
        const potentialUrl = getURLFromLog(msg);
        if (potentialUrl !== undefined) {
          this._url = potentialUrl;
          resolve();
        }
        console.log(msg);
      });
      this._process.stderr.on("data", (chunk: Buffer) => {
        const msg = chunk.toString();
        this._cliOutput += msg;
        console.error(msg);
      });
      this._process.on("exit", (code, signal) => {
        this._process = undefined;
        if (code || signal) {
          reject(new Error(`next start failed with code/signal ${code || signal}`));
        } else {
          console.log(`next start ran successfully with stdout: ${this._cliOutput || "none"}`);
          resolve();
        }
      });
    });
  }
}
