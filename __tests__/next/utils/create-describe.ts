import type { NextInstance, NextInstanceOpts } from "./next-instance-base.ts";
import { NextInstanceDev } from "./next-instance-dev.ts";
import { NextInstanceStart } from "./next-instance-start.ts";

const validTestModes = ["dev", "start"] as const;

type NextTestMode = (typeof validTestModes)[number];

interface NextTestOpts extends NextInstanceOpts {
  sourceDir: string;
}

const isValidTestMode = (mode: string | undefined): mode is NextTestMode => typeof mode === "string" && validTestModes.includes(mode as any);

let testMode: NextTestMode = "start";

const envTestMode = process.env.TEST_MODE;

if (isValidTestMode(envTestMode)) {
  testMode = envTestMode;
}

const createNext = async (opts: NextTestOpts) => {
  let nextInstance: NextInstance | undefined = undefined;
  try {
    switch (testMode) {
      case "dev":
        nextInstance = new NextInstanceDev(opts);
        break;
      case "start":
        nextInstance = new NextInstanceStart(opts);
        break;
    }
    await nextInstance.setup(opts.sourceDir);
    await nextInstance.spawn();
    return nextInstance;
  } catch (err) {
    console.error(`failed to create next instance: ${err}, cliOutput:${nextInstance?.cliOutput ? `\n${nextInstance.cliOutput}` : "N/A"}`);
    try {
      await nextInstance?.destroy();
    } catch (err) {
      console.error("failed to clean up after failure", err);
    }
    throw new Error("failed to create next instance.");
  }
};

export const createDescribe = (name: string, opts: NextTestOpts, fn: (args: { next: NextInstance; testMode: NextTestMode }) => void) => {
  describe(name, () => {
    let next: NextInstance;
    beforeAll(async () => {
      next = await createNext(opts);
    });
    afterAll(async () => {
      await next?.destroy();
    });
    const nextProxy = new Proxy<NextInstance>({} as NextInstance, {
      get(_target, property: keyof NextInstance) {
        const prop = next[property];
        return typeof prop === "function" ? prop.bind(next) : prop;
      },
    });
    fn({ next: nextProxy, testMode });
  });
};
