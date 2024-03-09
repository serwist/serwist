import { encodeBase64 } from "$lib/base64";
import { ENCODED_CANONICAL_URL } from "$lib/server-constants";
import type { LayoutServerLoad } from "./$types";

export const prerender = true;

export const load: LayoutServerLoad = () => ({
  fallbackOgImage: `/og/${ENCODED_CANONICAL_URL}/${encodeBase64("Serwist")}.png`,
});
