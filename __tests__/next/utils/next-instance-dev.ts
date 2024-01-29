import type { SpawnOptionsWithoutStdio } from "node:child_process";
import { spawn } from "node:child_process";

import { NextInstance } from "./next-instance-base.ts";
import { getURLFromLog } from "./utils.ts";

export class NextInstanceDev extends NextInstance {
  public async spawn() {
    const spawnOpts: SpawnOptionsWithoutStdio = {
      shell: false,
      env: {
        ...process.env,
        NODE_ENV: "" as any,
        PORT: "0",
      },
    };

    console.log("running next dev...");

    return new Promise<void>((resolve) => {
      try {
        this._process = spawn("pnpm", ["next", "dev", this._appTestDir], spawnOpts);
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
        });
      } catch (err) {
        console.error(`next spawn failed: ${err}, cli: ${this._cliOutput}`);
      }
    });
  }
}
