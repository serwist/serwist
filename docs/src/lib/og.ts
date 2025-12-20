import { Resvg } from "@resvg/resvg-js";
import { createElement, type ReactElement } from "react";
import type { Font } from "satori";
import satori, { init as initSatori } from "satori/wasm";
import initYoga, { type Yoga } from "yoga-wasm-web";
import { dev } from "$app/environment";
import { encodeBase64 } from "./base64";
import type { OpenGraphImage } from "./types";

let yoga: Yoga | null = null;
let geistFont: Font | null = null;

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
          if (geistFont === null) {
            geistFont = {
              name: "Geist",
              data: await (await fetch("/fonts/geist-400.otf")).arrayBuffer(),
              weight: 700,
              style: "normal",
            };
          }
          const svg = await satori(element, {
            width,
            height,
            debug,
            fonts: [geistFont],
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
      tw: "flex h-full w-full flex-col justify-between p-20 text-white",
      style: {
        fontFamily: "'Geist'",
        backgroundColor: "#0d0d0d",
      },
    },
    createElement(
      "svg",
      {
        tw: "w-20 h-20 bg-white",
        version: "1.0",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 500 500",
        preserveAspectRatio: "xMidYMid meet",
      },
      createElement(
        "g",
        {
          transform: "translate(0,500) scale(0.1,-0.1)",
          fill: "#000000",
          stroke: "none",
        },
        createElement("path", {
          d: "M0 2500 l0 -2500 2500 0 2500 0 0 2500 0 2500 -2500 0 -2500 0 0\n-2500z m1167 1640 c120 -32 121 -33 92 -109 -17 -45 -28 -61 -39 -57 -117 39\n-163 48 -255 49 -176 2 -247 -52 -248 -187 -1 -106 30 -143 178 -211 248 -116\n282 -135 333 -189 64 -67 87 -136 80 -240 -11 -167 -113 -277 -288 -315 -121\n-26 -352 -8 -462 36 l-38 15 0 73 0 73 91 -29 c206 -67 380 -61 466 14 47 41\n63 82 63 160 0 105 -11 115 -249 233 -176 87 -211 108 -257 156 -67 70 -89\n136 -81 248 10 158 101 257 271 296 85 19 240 12 343 -16z m1183 -60 l0 -70\n-290 0 -290 0 0 -195 0 -195 273 -2 272 -3 0 -70 0 -70 -272 -3 -273 -2 0\n-225 0 -225 290 0 290 0 0 -70 0 -70 -372 2 -373 3 -3 633 -2 632 375 0 375 0\n0 -70z m773 56 c130 -25 207 -78 254 -174 26 -52 28 -67 28 -167 0 -94 -3\n-118 -24 -162 -26 -59 -97 -130 -160 -163 -24 -12 -41 -27 -38 -33 3 -7 77\n-133 166 -280 88 -148 161 -270 161 -273 0 -3 -39 -3 -87 -2 l-88 3 -51 85\nc-28 47 -97 163 -153 258 l-102 172 -99 0 -100 0 0 -260 0 -260 -80 0 -80 0 0\n635 0 635 189 0 c123 0 216 -5 264 -14z m205 -2020 c45 -15 82 -32 82 -39 0\n-6 -10 -37 -22 -69 -17 -44 -27 -57 -38 -52 -108 46 -269 66 -359 44 -98 -23\n-141 -80 -141 -187 0 -104 21 -129 168 -199 269 -128 287 -139 339 -190 66\n-65 87 -131 81 -245 -13 -227 -192 -344 -498 -325 -102 6 -222 31 -268 55 -20\n10 -22 19 -22 82 0 64 2 70 18 64 154 -59 364 -82 462 -50 101 33 143 95 143\n207 0 56 -16 97 -52 126 -9 7 -101 55 -206 106 -104 52 -209 110 -232 130\n-126 110 -137 350 -21 466 86 85 172 111 353 106 107 -3 145 -8 213 -30z\nm-2764 -8 c10 -61 66 -681 79 -868 l12 -185 38 175 c21 96 59 267 85 380 l48\n205 77 3 76 3 10 -38 c16 -58 149 -622 159 -673 l9 -45 6 45 c3 25 9 101 12\n170 3 69 19 282 35 474 17 191 30 356 30 367 0 17 8 19 75 19 71 0 75 -1 74\n-22 0 -13 -28 -297 -62 -633 l-62 -610 -87 -3 c-76 -2 -87 -1 -92 15 -12 40\n-156 653 -167 713 l-13 65 -14 -70 c-7 -38 -47 -215 -88 -393 -41 -178 -74\n-325 -74 -328 0 -2 -39 -4 -88 -4 l-87 0 -71 630 c-39 347 -68 633 -65 635 2\n3 35 5 72 5 l68 0 5 -32z m1741 -28 l0 -55 -125 -12 c-69 -6 -126 -12 -127\n-12 -2 -1 -3 -225 -3 -500 l0 -498 58 -6 c31 -4 90 -9 130 -13 l72 -7 0 -53 0\n-54 -340 0 -340 0 0 54 0 53 73 7 c39 4 98 9 130 13 l57 6 0 497 0 498 -32 5\nc-18 4 -77 9 -130 13 l-98 7 0 59 0 58 338 -2 337 -3 0 -55z m2245 -15 l0 -75\n-185 0 -185 0 0 -560 0 -560 -80 0 -80 0 0 560 0 560 -185 0 -185 0 0 75 0 75\n450 0 450 0 0 -75z",
          fill: "#0d0d0d",
        }),
        createElement("path", {
          d: "M2830 3775 l0 -237 123 4 c167 6 223 32 269 123 15 29 21 59 21 116\n1 105 -28 162 -98 199 -44 22 -63 25 -182 28 l-133 4 0 -237z",
          fill: "#0d0d0d",
        }),
      ),
    ),
    createElement(
      "div",
      {
        tw: "flex flex-col",
      },
      createElement(
        "h1",
        {
          tw: "w-full text-6xl tracking-tight",
          style: {
            wordBreak: "break-word",
          },
        },
        title,
      ),
      createElement(
        "h3",
        {
          tw: "text-neutral-400 text-3xl tracking-tight",
          style: {
            wordBreak: "break-word",
          },
        },
        desc,
      ),
    ),
  );
};

export const encodeOpenGraphImage = (image: OpenGraphImage) => {
  if (typeof image === "string") {
    return `/og/${encodeBase64("A Swiss Army knife for service workers.")}/${encodeBase64(image)}.png`;
  }
  return `/og/${encodeBase64(image.desc)}/${encodeBase64(image.title)}.png`;
};
