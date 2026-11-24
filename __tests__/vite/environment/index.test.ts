import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

import { createCommandState, runCommand } from "@serwist-tests/utils";
import type { PluginOptionsComplete } from "@serwist/vite";
import { build as buildPlugin, createContext } from "@serwist/vite";
import type { ResolvedConfig } from "vite";
import { describe, expect, test } from "vitest";

const distDir = path.join(__dirname, "dist");

const runBuild = async (script: string) => {
  rmSync(distDir, { recursive: true, force: true });

  const commandState = createCommandState();
  await runCommand("node", [script], __dirname, commandState);

  return commandState;
};

const generatedCount = (cliOutput: string) =>
  cliOutput.match(/files generated/g)?.length ?? 0;
const distPath = (...segments: string[]) => path.join(distDir, ...segments);

describe("@serwist/vite - build", () => {
  test("should generate the service worker in a client-only build", async () => {
    const commandState = await runBuild("build/client.mjs");

    expect(commandState.exitCode).toBe(0);
    expect(existsSync(distPath("client/sw.js"))).toBe(true);
    expect(existsSync(distPath("sw.js"))).toBe(false);
    // The precache manifest must be injected into the service worker.
    expect(readFileSync(distPath("client/sw.js"), "utf-8")).toContain(
      "index.html",
    );
    expect(generatedCount(commandState.cliOutput)).toBe(1);
  }, 120_000);

  test("should not generate the service worker in an SSR-only build", async () => {
    const commandState = await runBuild("build/ssr.mjs");

    expect(commandState.exitCode).toBe(0);
    expect(existsSync(distPath("server/server.js"))).toBe(true);
    // No service worker in output or another directory.
    expect(existsSync(distPath("server/sw.js"))).toBe(false);
    expect(existsSync(distPath("sw.js"))).toBe(false);
    expect(generatedCount(commandState.cliOutput)).toBe(0);
  }, 120_000);

  test("should generate the service worker in the client environment (client declared first)", async () => {
    const commandState = await runBuild("build/env.mjs");

    expect(commandState.exitCode).toBe(0);
    expect(existsSync(distPath("server/server.js"))).toBe(true);
    expect(existsSync(distPath("client/index.html"))).toBe(true);
    // The options must come from the app's configuration and not from the
    // environment Vite resolved last.
    expect(existsSync(distPath("sw.js"))).toBe(true);
    expect(existsSync(distPath("server/sw.js"))).toBe(false);
    expect(generatedCount(commandState.cliOutput)).toBe(1);
  }, 120_000);

  test("should generate the service worker in the client environment (client declared last)", async () => {
    const commandState = await runBuild("build/env-reversed.mjs");

    expect(commandState.exitCode).toBe(0);
    expect(existsSync(distPath("server/server.js"))).toBe(true);
    // The service worker is generated in the client environment no matter
    // the order the environments are declared in.
    expect(existsSync(distPath("client/index.html"))).toBe(true);
    expect(existsSync(distPath("sw.js"))).toBe(true);
    expect(existsSync(distPath("server/sw.js"))).toBe(false);
    expect(readFileSync(distPath("sw.js"), "utf-8")).toContain("index.html");
    expect(generatedCount(commandState.cliOutput)).toBe(1);
  }, 120_000);

  test("should only generate the service worker for the primary client environment", async () => {
    const commandState = await runBuild("build/env-multiple.mjs");

    expect(commandState.exitCode).toBe(0);
    expect(existsSync(distPath("server/server.js"))).toBe(true);
    expect(existsSync(distPath("sw/index.html"))).toBe(true);

    expect(existsSync(distPath("sw.js"))).toBe(true);
    expect(existsSync(distPath("sw/sw.js"))).toBe(false);
    expect(existsSync(distPath("server/sw.js"))).toBe(false);
    expect(generatedCount(commandState.cliOutput)).toBe(1);
  }, 120_000);
});

describe("@serwist/vite - build plugin environment", () => {
  const createContextWithOptions = () => {
    const ctx = createContext(
      {
        swSrc: "src/sw.ts",
        swDest: "sw.js",
        globDirectory: "dist/client",
      },
      undefined,
    );
    ctx.options = { disable: false } as unknown as PluginOptionsComplete;
    return ctx;
  };

  const environment = (
    name: string,
    consumer: "client" | "server",
    environments: Record<string, { consumer?: "client" | "server" }>,
  ) => ({
    name,
    config: { consumer },
    getTopLevelConfig: () => ({ environments }),
  });

  test("should only apply to the primary client environment", () => {
    const plugin = buildPlugin(createContextWithOptions(), {
      disabled: false,
      extendManifestEntries: () => {},
      async generateSW() {},
    });

    const applyToEnvironment = plugin.applyToEnvironment as unknown as (
      environment: unknown,
    ) => boolean;

    const environments = {
      client: { consumer: "client" as const },
      sw: { consumer: "client" as const },
      ssr: { consumer: "server" as const },
    };

    expect(
      applyToEnvironment(environment("client", "client", environments)),
    ).toBe(true);
    // A second client environment must not build the service worker again.
    expect(applyToEnvironment(environment("sw", "client", environments))).toBe(
      false,
    );
    // A server environment never contains a service worker.
    expect(applyToEnvironment(environment("ssr", "server", environments))).toBe(
      false,
    );
    // A build without any client environment never contains a service worker.
    expect(applyToEnvironment(environment("ssr", "server", {}))).toBe(false);
  });

  const shouldGenerate = async (config: { build: { ssr?: string } }) => {
    const ctx = createContextWithOptions();
    ctx.viteConfig = config as unknown as ResolvedConfig;

    let generated = 0;

    const plugin = buildPlugin(ctx, {
      disabled: false,
      extendManifestEntries: () => {},
      async generateSW() {
        generated++;
      },
    });

    // `closeBundle` is an object hook, its handler can be called directly.
    const closeBundle = plugin.closeBundle as unknown as {
      handler: () => Promise<void>;
    };
    await closeBundle.handler();

    return generated;
  };

  test("should not generate the service worker in an SSR build on Vite 5", async () => {
    // Vite 5 has no `environments` in its resolved configuration.
    expect(await shouldGenerate({ build: { ssr: "src/server.ts" } })).toBe(0);
  });

  test("should generate the service worker in a Vite 5 client build", async () => {
    expect(await shouldGenerate({ build: {} })).toBe(1);
  });
});
