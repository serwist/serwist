import { postprocessPlugin as rolldownPostprocessPlugin } from "rolldown-plugin-serwist";
import type { Plugin } from "vite";

export const postprocessPlugin: Plugin = {
  ...rolldownPostprocessPlugin,
  applyToEnvironment(env) {
    return env.name === "serwist";
  },
};
