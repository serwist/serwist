import { dev } from "$app/environment";
import { PUBLIC_CANONICAL_URL } from "$env/static/public";
import { Resvg } from "@resvg/resvg-js";
import { type ReactElement, createElement } from "react";
import type { Font } from "satori";
import satori, { init as initSatori } from "satori/wasm";
import initYoga, { type Yoga } from "yoga-wasm-web";
import { encodeBase64 } from "./base64";
import { ENCODED_CANONICAL_URL } from "./constants";
import type { OpenGraphImage } from "./types";

let yoga: Yoga | null = null;
let monoFont: Font | null = null;

export interface ImageResponseOptions extends ResponseInit {
  /**
   * The width of the image.
   * @default 1200
   */
  width?: number;
  /**
   * The height of the image.
   * @default 630
   */
  height?: number;
  /**
   * Fetcher.
   */
  fetch: typeof globalThis.fetch;
  /**
   * Display debug information on the image.
   * @default false
   */
  debug?: boolean;
}

export class ImageResponse extends Response {
  constructor(element: ReactElement, { width = 1200, height = 630, fetch, debug = false, headers, ...init }: ImageResponseOptions) {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (yoga === null) {
            const yogaWasm = await (await fetch("/yoga.wasm")).arrayBuffer();
            yoga = await initYoga(yogaWasm);
            initSatori(yoga);
          }
          if (monoFont === null) {
            monoFont = {
              name: "Noto Sans Mono",
              data: await (await fetch("/noto-sans-mono.ttf")).arrayBuffer(),
              weight: 700,
              style: "normal",
            };
          }
          const svg = await satori(element, {
            width,
            height,
            debug,
            fonts: [monoFont],
          });
          const resvgJS = new Resvg(svg, {
            fitTo: { mode: "width", value: width },
          });
          controller.enqueue(resvgJS.render().asPng());
          controller.close();
        } catch (err) {
          console.log(err);
          controller.error(err);
        }
      },
    });
    super(stream, {
      headers: {
        "content-type": "image/png",
        "cache-control": dev ? "no-cache, no-store" : "public, immutable, no-transform, max-age=31536000",
        ...headers,
      },
      ...init,
    });
  }
}

export const getOpenGraphTemplate = (title: string, desc: string) => {
  return createElement(
    "div",
    {
      tw: "flex h-full w-full flex-col justify-between p-10 text-white",
      style: {
        fontFamily: "'Noto Sans Mono'",
        backgroundColor: "#0a0a0a",
      },
    },
    createElement("div", {
      tw: "flex items-center",
      style: {
        gap: "0.5rem",
      },
    }),
    createElement(
      "h1",
      {
        tw: "w-full text-6xl font-bold leading-[60px] md:text-7xl md:tracking-tight",
        style: {
          wordBreak: "break-word",
        },
      },
      title,
    ),
    createElement(
      "h3",
      {
        tw: "text-lg font-bold leading-7 md:text-xl md:tracking-tight",
      },
      desc,
    ),
  );
};

export const encodeOpenGraphImage = (image: OpenGraphImage) => {
  if (typeof image === "string") {
    return `/og/${ENCODED_CANONICAL_URL}/${encodeBase64(image)}.png`;
  }
  return `/og/${encodeBase64(`${image.desc} - ${PUBLIC_CANONICAL_URL}`)}/${encodeBase64(image.title)}.png`;
};
