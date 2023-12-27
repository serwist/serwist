import { swScope, swType, swUrl } from "virtual:internal-serwist";

export const getSerwist = async () => {
  if ("serviceWorker" in navigator) {
    return new (await import("@serwist/window")).Serwist(swUrl, { scope: swScope, type: swType });
  }
  return undefined;
};
