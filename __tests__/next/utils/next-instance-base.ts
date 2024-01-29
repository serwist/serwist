import type { ChildProcessWithoutNullStreams } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import * as cheerio from "cheerio";
import type { PackageJson } from "type-fest";

import treeKill from "./tree-kill.ts";

export interface NextInstanceOpts {
  skipInstall: boolean;
  dependencies?: PackageJson["dependencies"];
}

export abstract class NextInstance {
  protected _isDestroyed: boolean;
  protected _appTestDir: string;
  protected _url: string;
  protected _skipInstall: boolean;
  protected _cliOutput: string;
  protected _process: ChildProcessWithoutNullStreams | undefined;
  protected _dependencies: PackageJson["dependencies"] | undefined;
  constructor(opts: NextInstanceOpts) {
    this._isDestroyed = false;
    this._url = "";
    this._appTestDir = "";
    this._skipInstall = opts.skipInstall;
    this._cliOutput = "";
    this._process = undefined;
    this._dependencies = undefined;
  }
  public get cliOutput() {
    return this._cliOutput;
  }
  public get appTestDir() {
    return this._appTestDir;
  }
  protected async clean() {
    try {
      await Promise.all([
        fs.rm(path.join(this._appTestDir, ".next"), { recursive: true, force: true, maxRetries: 10, retryDelay: 1000 }),
        fs.rm(path.join(this._appTestDir, "public/sw.js"), { maxRetries: 10, force: true }),
        fs.rm(path.join(this._appTestDir, "next-env.d.ts"), { maxRetries: 10, force: true }),
      ]);
    } catch (err) {
      console.error("failed to clean up test dir", err);
    }
  }
  async setup(sourceDir: string) {
    this._appTestDir = sourceDir;
  }
  abstract spawn(): Promise<void>;
  public async destroy() {
    if (this._isDestroyed) {
      throw new Error("next instance already destroyed");
    }
    this._isDestroyed = true;
    if (this._process) {
      try {
        let exitResolve: () => void;
        const exitPromise = new Promise<void>((resolve) => {
          exitResolve = resolve;
        });
        this._process.addListener("exit", () => exitResolve());
        await new Promise<void>((resolve) => {
          if (this._process?.pid) {
            treeKill(this._process.pid, "SIGKILL", (err) => {
              if (err) {
                console.error("failed to kill tree of process", this._process?.pid, "err:", err);
              }
              resolve();
            });
          }
        });
        this._process.kill("SIGKILL");
        await exitPromise;
        this._process = undefined;
        console.log("stopped next server");
      } catch (err) {
        console.error("failed to stop next server", err);
      }
    }
    await this.clean();
  }
  public async fetch(pathname: string, init?: RequestInit) {
    if (this._url === "") {
      throw new Error("fetch error: base URL not defined.");
    }
    return await fetch(new URL(pathname, this._url), init);
  }
  public async render(pathname: string, init?: RequestInit) {
    return cheerio.load(await (await this.fetch(pathname, init)).text());
  }
}
