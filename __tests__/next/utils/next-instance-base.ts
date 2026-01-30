import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { lstatSync } from "node:fs";
import fs from "node:fs/promises";
import * as cheerio from "cheerio";
import { glob } from "glob";
import type { PackageJson } from "type-fest";
import treeKill from "./tree-kill.ts";

export interface NextInstanceOpts {
  turbo?: boolean;
  skipInstall: boolean;
  dependencies?: PackageJson["dependencies"];
}

export abstract class NextInstance {
  protected _isDestroyed: boolean;
  protected _appTestDir: string;
  protected _url: string;
  protected _skipInstall: boolean;
  protected _turbo: boolean;
  protected _cliOutput: string;
  protected _process: ChildProcessWithoutNullStreams | undefined;
  protected _dependencies: PackageJson["dependencies"] | undefined;
  constructor(opts: NextInstanceOpts) {
    this._isDestroyed = false;
    this._url = "";
    this._appTestDir = "";
    this._turbo = opts.turbo ?? false;
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
      const filesToRemove = await glob(
        [".next", "next-env.d.ts", "public/sw.js", "public/sw.js.map", "public/swe-worker-*.js", "public/swe-worker-*.js.map"],
        { absolute: true, cwd: this._appTestDir },
      );
      console.log("cleaning up test dir", filesToRemove);
      await Promise.all(
        filesToRemove.map((file) => {
          const isDirectory = lstatSync(file).isDirectory();
          return fs.rm(file, { force: true, maxRetries: 10, recursive: isDirectory, retryDelay: 1000 });
        }),
      );
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
        console.log("stopping next server");
        let exitResolve: () => void;
        const exitPromise = new Promise<void>((resolve) => {
          exitResolve = resolve;
        });
        this._process.addListener("exit", () => exitResolve());
        await new Promise<void>((resolve) => {
          const pid = this._process?.pid;
          if (pid) {
            treeKill(pid, "SIGKILL", (err) => {
              if (err) {
                console.error("failed to kill tree of process", pid, "err:", err);
              }
              resolve();
            });
          }
        });
        this._process?.kill("SIGKILL");
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
