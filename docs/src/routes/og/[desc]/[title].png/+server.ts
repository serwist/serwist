import { decodeBase64 } from "$lib/base64";
import { getOpenGraphTemplate, ImageResponse } from "$lib/og";

import type { RequestEvent } from "./$types";

export const prerender = true;

export const GET = ({ params, fetch }: RequestEvent) => {
  return new ImageResponse(getOpenGraphTemplate(decodeBase64(params.title), decodeBase64(params.desc)), { fetch });
};
