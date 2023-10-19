import type { Compiler } from "@swc/core";

export const resolveSwc = () => {
  let swc: Compiler | undefined;

  for (const swcSource of ["@swc/core", "next/dist/build/swc"]) {
    try {
      swc = require(swcSource);
      break;
    } catch {
      // Do nothing, this swc source might not be available
    }
  }

  if (!swc) {
    throw new Error(
      "Failed to resolve swc. Please install @swc/core if you haven't."
    );
  }

  return swc;
};
