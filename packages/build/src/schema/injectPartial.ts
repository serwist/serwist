import { z } from "zod";

export const injectPartial = z
  .object({
    /**
     * The string to find inside of the `swSrc` file. Once found, it will be
     * replaced by the generated precache manifest.
     * @default "self.__SW_MANIFEST"
     */
    injectionPoint: z.string().default("self.__SW_MANIFEST"),
    /**
     * The path to the service worker file that will be read during
     * the build process, relative to the current working directory.
     */
    swSrc: z.string(),
  })
  .strict("Do not pass invalid properties to InjectPartial!");
