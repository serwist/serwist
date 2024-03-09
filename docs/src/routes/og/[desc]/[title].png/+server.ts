import { ImageResponse, getOpenGraphTemplate } from "$lib/og";

import type { RequestEvent } from "./$types";

export const prerender = true;

export const GET = ({ params, fetch }: RequestEvent) => {
  return new ImageResponse(getOpenGraphTemplate(decodeURIComponent(params.title), decodeURIComponent(params.desc)), { fetch });
};
