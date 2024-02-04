import { z } from "zod";

export const requiredSwDestPartial = z
  .object({
    /**
     * The path and filename of the service worker file that will be created by
     * the build process, relative to the current working directory. It must end
     * in '.js'.
     */
    swDest: z.string(),
  })
  .strict("Do not pass invalid properties to RequiredSWDestPartial!");
