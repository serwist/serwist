import type { SpawnOptionsWithoutStdio } from "node:child_process";
import { spawn } from "node:child_process";

import { NextInstance } from "./next-instance-base.ts";
import { getURLFromLog } from "./utils.ts";

export class NextInstanceStart extends NextInstance {
  public async spawn() {
    const spawnOpts: SpawnOptionsWithoutStdio = {
      cwd: this._appTestDir,
      shell: process.platform === "win32",
      env: {
        ...process.env,
        NODE_ENV: "" as any,
        PORT: "0",
      },
    };

    console.log("running next build...");

    await new Promise<void>((resolve, reject) => {
      this._process = spawn("pnpm", ["next", "build", this._turbo ? "" : "--webpack"], spawnOpts);
      this._process.stdout.on("data", (chunk: Buffer) => {
        const msg = chunk.toString();
        this._cliOutput += msg;
        if (msg) console.log(msg);
      });
      this._process.stderr.on("data", (chunk: Buffer) => {
        const msg = chunk.toString();
        this._cliOutput += msg;
        if (msg) console.error(msg);
      });
      this._process.on("error", (err) => {
        reject(err);
      });
      this._process.on("exit", (code, signal) => {
        this._process = undefined;
        if (code || signal) {
          reject(new Error(`next build failed with code/signal ${code || signal}`));
        } else {
          console.log("next build ran successfully.");
          resolve();
        }
      });
    });

    console.log("running next start...");

    return new Promise<void>((resolve, reject) => {
      this._process = spawn("pnpm", ["next", "start"], spawnOpts);
      this._process.stdout.on("data", (chunk: Buffer) => {
        const msg = chunk.toString();
        this._cliOutput += msg;
        const potentialUrl = getURLFromLog(msg);
        if (potentialUrl !== undefined) {
          this._url = potentialUrl;
          resolve();
        }
        if (msg) console.log(msg);
      });
      this._process.stderr.on("data", (chunk: Buffer) => {
        const msg = chunk.toString();
        this._cliOutput += msg;
        if (msg) console.error(msg);
      });
      this._process.on("error", (err) => {
        reject(err);
      });
      this._process.on("exit", () => {
        this._process = undefined;
      });
    });
  }
}
