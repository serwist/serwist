import { encodeOpenGraphImage } from "$lib/og";

export const load = () => ({
  title: "additionalPrecacheEntries - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "additionalPrecacheEntries",
    desc: "Configuring - @serwist/build",
  }),
});
