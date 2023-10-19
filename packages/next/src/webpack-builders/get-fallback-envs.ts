import path from "node:path";

import { logger } from "$utils/index.js";

import type { FallbackRoutes } from "../types.js";

export const getFallbackEnvs = ({
  fallbacks,
  buildId,
}: {
  fallbacks: FallbackRoutes;
  buildId: string;
}) => {
  let data = fallbacks.data;

  if (data && data.endsWith(".json")) {
    data = path.posix.join("/_next/data", buildId, data);
  }

  const envs = {
    __PWA_FALLBACK_DOCUMENT__: fallbacks.document || false,
    __PWA_FALLBACK_IMAGE__: fallbacks.image || false,
    __PWA_FALLBACK_AUDIO__: fallbacks.audio || false,
    __PWA_FALLBACK_VIDEO__: fallbacks.video || false,
    __PWA_FALLBACK_FONT__: fallbacks.font || false,
    __PWA_FALLBACK_DATA__: data || false,
  };

  if (Object.values(envs).filter((v) => !!v).length === 0) return;

  logger.info(
    "This app will fallback to these precached routes when fetching from the cache and the network fails:"
  );

  if (envs.__PWA_FALLBACK_DOCUMENT__) {
    logger.info(`  Documents (pages): ${envs.__PWA_FALLBACK_DOCUMENT__}`);
  }
  if (envs.__PWA_FALLBACK_IMAGE__) {
    logger.info(`  Images: ${envs.__PWA_FALLBACK_IMAGE__}`);
  }
  if (envs.__PWA_FALLBACK_AUDIO__) {
    logger.info(`  Audio: ${envs.__PWA_FALLBACK_AUDIO__}`);
  }
  if (envs.__PWA_FALLBACK_VIDEO__) {
    logger.info(`  Videos: ${envs.__PWA_FALLBACK_VIDEO__}`);
  }
  if (envs.__PWA_FALLBACK_FONT__) {
    logger.info(`  Fonts: ${envs.__PWA_FALLBACK_FONT__}`);
  }
  if (envs.__PWA_FALLBACK_DATA__) {
    logger.info(
      `  Data (/_next/data/**/*.json): ${envs.__PWA_FALLBACK_DATA__}`
    );
  }

  return envs;
};
