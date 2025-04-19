import { serwist } from "@serwist/react-router";
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  prerender: true,
  presets: [serwist()],
} satisfies Config;
