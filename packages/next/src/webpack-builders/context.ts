import type { BrowserslistOptions } from "../private-types.js";
import { convertBoolean } from "../utils.js";

const resolveContextEnv = <T>(
  env: string | undefined,
  transform?: (_: string) => T
) => {
  if (env) {
    return transform?.(env);
  }
  return undefined;
};

interface NextPWAContext {
  shouldMinify: boolean | undefined;
  useSwcMinify: boolean | undefined;
  browserslist: BrowserslistOptions | undefined;
  devWatchWorkers: boolean | undefined;
}

export const nextPWAContext: NextPWAContext = {
  shouldMinify: resolveContextEnv(process.env.NEXT_PWA_MINIFY, convertBoolean),
  useSwcMinify: resolveContextEnv(
    process.env.NEXT_PWA_SWC_MINIFY,
    convertBoolean
  ),
  browserslist: undefined,
  devWatchWorkers: resolveContextEnv(
    process.env.NEXT_PWA_DEV_WATCH,
    convertBoolean
  ),
};

/**
 * Set default value for a key in `nextPWAContext`.
 * @param key The key in `nextPWAContext`
 * @param value The value
 */
export const setDefaultContext = <T extends keyof NextPWAContext>(
  key: T,
  value: NextPWAContext[T]
) => {
  if (nextPWAContext[key] === undefined || nextPWAContext[key] === null) {
    nextPWAContext[key] = value;
  }
};
